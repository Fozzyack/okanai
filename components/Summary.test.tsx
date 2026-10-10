import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { hoursWorked, PaySettings } from "../types/calculate";
import Summary from "./Summary";

const settings: PaySettings = {
    bonusPay1: 1.5,
    bonusPay2: 2,
    bonus1After: 8,
    bonus2After: 10,
    weekendBonus1: 1.5,
    weekendBonus2: 2,
    weekendOvertimeAfter: 3,
    publicHolidayBonus: 1.5,
    breaksOnlyDeductBasePay: false,
};

const emptyWeek = (): hoursWorked[] => Array.from({ length: 7 }, () => ({
    start: 0, end: 0, break_time: 0, is_public_holiday: false,
}));

test("summary displays calculated totals, daily pay, and break costs", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1260, break_time: 60, is_public_holiday: false };
    week[5] = { start: 540, end: 1020, break_time: 0, is_public_holiday: false };
    week[6] = { ...week[5], is_public_holiday: true };
    const html = renderToStaticMarkup(<Summary weeklyHours={week} basePay="20" settings={settings} onStartAgain={() => {}} />);
    assert.ok(html.includes("Start again"));
    for (const text of ["$790.00", "$260.00", "$290.00", "$240.00", "27h", "$40.00", "Public holiday", "60 min unpaid break", "Normal hours", "Overtime hours"]) {
        assert.ok(html.includes(text), `Missing ${text}`);
    }
    assert.ok(html.includes('aria-label="Monday: $260.00"'));
    assert.match(html, /Normal hours<\/dt><dd[^>]*>8h<\/dd>/);
    assert.match(html, /Overtime hours<\/dt><dd[^>]*>3h<\/dd>/);
    assert.match(html, /Overtime hours<\/dt><dd[^>]*>5h<\/dd>/);
});

test("all-skipped weeks show zero totals without invalid chart heights", () => {
    const html = renderToStaticMarkup(<Summary weeklyHours={emptyWeek()} basePay="20" settings={settings} onStartAgain={() => {}} />);
    assert.ok(html.includes("$0.00"));
    assert.equal(html.match(/Not scheduled/g)?.length, 7);
    assert.ok(!html.includes("NaN"));
    assert.ok(!html.includes("Infinity"));
});

test("summary reflects changed settings", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1020, break_time: 0, is_public_holiday: true };
    const html = renderToStaticMarkup(<Summary weeklyHours={week} basePay="20" settings={{ ...settings, publicHolidayBonus: 2 }} onStartAgain={() => {}} />);
    assert.ok(html.includes("$320.00"));
});

test("invalid settings show a helpful alert instead of crashing", () => {
    const html = renderToStaticMarkup(<Summary weeklyHours={emptyWeek()} basePay="20" settings={{ ...settings, bonus2After: 7 }} onStartAgain={() => {}} />);
    assert.ok(html.includes('role="alert"'));
    assert.ok(html.includes("Check your settings"));
    assert.ok(html.includes("second overtime threshold cannot precede the first"));
});

test("summary reflects base-only break deductions", () => {
    const week = emptyWeek();
    week[0] = { start: 540, end: 1200, break_time: 60, is_public_holiday: false };
    const html = renderToStaticMarkup(<Summary weeklyHours={week} basePay="20" settings={{ ...settings, breaksOnlyDeductBasePay: true }} onStartAgain={() => {}} />);
    assert.ok(html.includes("$240.00"));
    assert.ok(html.includes("$20.00"));
    assert.ok(html.includes("Breaks deduct normal-rate hours first"));
    assert.match(html, /Normal hours<\/dt><dd[^>]*>7h<\/dd>/);
    assert.match(html, /Overtime hours<\/dt><dd[^>]*>3h<\/dd>/);
});

test("summary shows weekend and holiday break deductions at their applicable rates", () => {
    const week = emptyWeek();
    week[5] = { start: 540, end: 1200, break_time: 60, is_public_holiday: false };
    week[6] = { ...week[5], is_public_holiday: true };
    const html = renderToStaticMarkup(<Summary weeklyHours={week} basePay="20" settings={{ ...settings, publicHolidayBonus: 2.5, breaksOnlyDeductBasePay: true }} onStartAgain={() => {}} />);
    for (const amount of ["$880.00", "$380.00", "$500.00", "$30.00", "$50.00"]) {
        assert.ok(html.includes(amount), `Missing ${amount}`);
    }
});
