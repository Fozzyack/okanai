# Okanai

A demo weekly gross-pay calculator for hourly work, with weekday, weekend, and public-holiday rates. Amounts are in Australian dollars (AUD), before tax and deductions; actual payroll rules may differ.

Built with Next.js 16.4, React 19.3, TypeScript, Tailwind CSS 4, and GSAP with `@gsap/react`. Landing-page and calculator reveal animations respect reduced-motion preferences.

## Prerequisites

- Bun 1.2.22, as specified in `package.json`; dependencies are locked in `bun.lock`.
- Node.js 20.9 or newer for the Next.js CLI.

## Local setup

From the project directory:

```bash
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/calculate](http://localhost:3000/calculate) for the calculator. No account, database, or environment variables are required.

## Using the calculator

1. Enter your base hourly rate (default: $25 AUD; zero is allowed).
2. Work through Monday–Sunday. Use the clock-in and clock-out sliders, arrow keys, or time inputs, and mark public holidays where applicable.
3. Choose **Save & next**, or skip a day you did not work. After Sunday, review weekly hours, gross pay, regular/overtime totals, and the daily breakdown.
4. Edit a day or your base pay from the summary. After changing times or a holiday selection, save the day again to include it in totals.

Times use 15-minute increments. The end must be after the start within the same day; midnight clock-out means the end of that day. Shifts extending beyond midnight are not supported, and breaks are not deducted.

New weeks suggest 9 AM–5 PM. Saving a worked day carries its times forward to untouched draft days, without changing edited drafts, saved days, or days off. Skipping does not change remembered times; holiday selections never carry forward. Draft and skipped days contribute nothing to totals.

Details are held only in browser memory and reset on reload. **Start a fresh week** clears all shifts and holiday selections and resets the hourly rate to $25 and suggested times to 9 AM–5 PM. The help button explains these rules in the app.

### Estimate rules

| Day | Pay tiers |
| --- | --- |
| Monday–Friday | First 8 hours at 1× base rate; next 2 at 1.5×; remaining hours at 2× |
| Saturday and Sunday | First 3 hours at 1.5×; remaining hours at 2×; all classified as overtime |
| Public holiday | All hours at 2×, classified as overtime; overrides weekday/weekend tiers |

Multipliers do not stack, and there is no weekly overtime threshold. For example, a 10-hour Monday at $25/hour yields $275 AUD: 8 × $25 plus 2 × $37.50.

This is a demo estimate, not legal payroll advice. Taxes, deductions, superannuation, and award-specific rules are not included.

The landing-page card displays a fixed, illustrative **$1,632.35 AUD**. It is not calculated from the card’s displayed day, rate, or hours and is not a calculator result. The `/calculate` route calculates totals from your saved inputs.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun run start` | Serve an existing production build; run `build` first |
| `bun test lib/payroll.test.ts` | Run the existing payroll unit tests |

There are no `lint` or `test` scripts in `package.json`. The existing tests contain outdated expectations for some pay tiers and currently fail; `lib/payroll.ts` and the calculator help describe the implemented rules.

## Project files

- `app/page.tsx` — landing page and illustrative pay card.
- `app/landing-motion.tsx` — scoped GSAP hero animations using `useGSAP`, with reduced-motion handling and cleanup.
- `app/calculate/` — calculator route, step-by-step form, summary, and help dialog.
- `components/` — hourly-rate and daily-schedule inputs.
- `lib/payroll.ts` — pay rules, validation, shift state, and AUD/time formatting.
- `lib/payroll.test.ts` — payroll unit tests.
- `app/layout.tsx` and `app/globals.css` — shared layout, Geist fonts, and global styles.
- `next.config.ts` — Next.js options and the Tailwind Turbopack loader for global CSS.

## Troubleshooting

- **Shift validation error:** choose an end after the start in 15-minute increments. Use midnight only as clock-out at the end of the day.
- **A day is missing from totals:** suggested or edited draft shifts are not counted until saved. Skipped days count as zero.
- **Production server has no build:** run `bun run build` before `bun run start`.
- **Font download fails during build:** `app/layout.tsx` uses `next/font/google` for Geist fonts, so builds require access to Google Fonts.
