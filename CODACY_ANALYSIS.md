# Codacy Analysis Report - workspace-Canvas

**Date:** January 6, 2026  
**Repository:** [Nobita421/workspace-Canvas](https://github.com/Nobita421/workspace-Canvas)  
**Grade:** **A (94/100)**

---

##  Summary Metrics

- **Total Issues:** 74
- **Lines of Code (LoC):** 16,342
- **Complex Files:** 14 (20%)
- **Duplication:** 7%
- **Test Coverage:** 0% (68 files uncovered)

---

##  Changes Since Last Analysis

- **Issues reduced:** 96  **74** (22 issues fixed)
- **Grade improved:** 93  **94**
- **Lockfile updates:** `next` upgraded to `16.0.9` (Trivy now recommends `16.0.10`)

---

##  High-severity Security Findings (selected)

- `src/hooks/useThreadData.ts` — variable or function-level object injection sinks (several occurrences)
- `src/hooks/useCanvasState.ts` — object injection / unsafe indexing
- `src/components/workspace/ConnectionLines.tsx` — object injection and dynamic deletes
- `src/components/workspace/Canvas.tsx` — variable assigned to object injection sink
- `src/components/entities/Card.tsx` — XSS-like patterns (`.includes((e.target as HTMLElement).tagName)`) flagged as risky
- `src/components/ui/AuthModal.tsx` — potential timing attack in password comparison

> Recommendation: audit all object-injection locations, validate and sanitize keys, avoid dynamic property writes/deletes where possible, and add explicit type checks.

---

##  Error-Prone & Best-Practice Issues (selected)

- **Floating promises / unhandled promises** (use `await` or `void`/`.catch`) in several hooks and components.
- **Confusing void arrow expressions** — many event handlers return void expressions shorthand; replace with braces to satisfy `@typescript-eslint/no-confusing-void-expression`.
- **Dynamic deletes** (e.g., `delete obj[key]`) flagged; prefer setting undefined or using immutability helpers.
- **Unnecessary conditionals** reported where values are statically truthy.

---

##  Dependency Vulnerabilities

- `next@16.0.9` detected by Trivy with GHSA-5j59-xgg2-r9c4; **recommend upgrade to `16.0.10`** once available and retest lockfiles (`pnpm-lock.yaml` / `package-lock.json`).

---

## Next Steps / Notes

1. Prioritize **security** fixes: object injection sinks and XSS patterns.
2. Fix high-severity ESLint findings and floating promises next.
3. Update `next` to `16.0.10` when available and regenerate lockfiles.
4. Re-run Codacy after fixes to confirm issue count drops further.

---

*Full issue list captured by Codacy is available in the Codacy dashboard. For a targeted set of fixes, I can create PR suggestions for the highest-impact items.*
