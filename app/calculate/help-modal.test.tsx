import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { PaySettings } from "../../types/calculate";
import CalculatorHelp from "./help-modal";

const settings: PaySettings = {
    bonusPay1: 1.75,
    bonusPay2: 2.25,
    bonus1After: 6,
    bonus2After: 9,
    weekendBonus1: 1.8,
    weekendBonus2: 2.4,
    weekendOvertimeAfter: 2.5,
    publicHolidayBonus: 3,
    breaksOnlyDeductBasePay: false,
};

const helpText = (values: PaySettings): string => renderToStaticMarkup(
    <CalculatorHelp settings={values} />,
).replace(/<[^>]*>/g, "").replace(/\s+/g, " ");

test("help describes all eight current pay settings", () => {
    const text = helpText(settings);
    for (const rule of [
        "at 3× your base rate",
        "up to 6 paid hours per day",
        "after 6 and up to 9 pay 1.75×",
        "hours beyond 9 pay 2.25×",
        "first 2.5 paid hours per day pay 1.8×",
        "Remaining paid hours pay 2.4×",
    ]) {
        assert.ok(text.includes(rule), `Missing rule: ${rule}`);
    }
});

test("help reflects updated settings rather than fixed defaults", () => {
    const text = helpText({ ...settings, publicHolidayBonus: 2.5, bonus1After: 7 });
    assert.ok(text.includes("at 2.5× your base rate"));
    assert.ok(text.includes("up to 7 paid hours per day"));
});

test("help matches skip, break, and holiday behavior", () => {
    const text = helpText(settings);
    assert.ok(text.includes("Skipped days stay at 0, 0"));
    assert.ok(text.includes("subtracted before applying daily overtime thresholds"));
    assert.ok(text.includes("All paid holiday hours are shown as normal hours"));
    assert.ok(!text.includes("15-minute increments"));
    assert.ok(!text.includes("regular 1× hours first"));
});

test("help explains enabled base-only break deductions", () => {
    const text = helpText({ ...settings, breaksOnlyDeductBasePay: true });
    assert.ok(text.includes("Breaks only deduct base pay is on"));
    assert.ok(text.includes("deduct break hours × your base hourly rate"));
    assert.ok(text.includes("up to 6 shift hours per day"));
    assert.ok(!text.includes("Breaks only deduct base pay is off"));
});
