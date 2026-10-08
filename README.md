# Okanai

A simple weekly gross-pay calculator in AUD, with overtime, weekend and public-holiday rates, and unpaid breaks.

Built with Next.js, React, TypeScript, Tailwind CSS, and GSAP.

![Okanai calculator screenshot](assets/screenshot.png)

## Run locally

Requires Bun 1.2.22 and Node.js 20.9+.

```bash
bun install --frozen-lockfile
bun run dev
```

Open [localhost:3000](http://localhost:3000) or jump to the [calculator](http://localhost:3000/calculate). No account or environment variables needed.

## Commands

- Build: `bun run build`
- Serve the build: `bun run start`
- Test: `bun test lib/payroll.test.ts`

Demo estimates only—not payroll advice. Excludes tax, superannuation, and award-specific rules. Inputs reset on reload.
