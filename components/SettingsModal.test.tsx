import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { PaySettings } from "../types/calculate";
import SettingsModal from "./SettingsModal";

const settings: PaySettings = {
    bonusPay1: 1.5, bonusPay2: 2, bonus1After: 8, bonus2After: 10,
    weekendBonus1: 1.5, weekendBonus2: 2, weekendOvertimeAfter: 3,
    publicHolidayBonus: 2, breaksOnlyDeductBasePay: false,
};

test("break deduction setting renders as an unchecked checkbox by default", () => {
    const html = renderToStaticMarkup(<SettingsModal values={settings} onSave={() => {}} />);
    const input = html.match(/<input[^>]*name="breaksOnlyDeductBasePay"[^>]*>/)?.[0];
    assert.ok(input);
    assert.ok(input.includes('type="checkbox"'));
    assert.ok(!input.includes("checked"));
    assert.ok(html.includes("Breaks only deduct base pay"));
});

test("break deduction checkbox reflects the saved setting", () => {
    const html = renderToStaticMarkup(<SettingsModal values={{ ...settings, breaksOnlyDeductBasePay: true }} onSave={() => {}} />);
    const input = html.match(/<input[^>]*name="breaksOnlyDeductBasePay"[^>]*>/)?.[0];
    assert.ok(input?.includes("checked"));
});
