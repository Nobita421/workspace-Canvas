# Codacy Analysis Report — workspace-Canvas

**Report date:** 2026-01-06  
**Repository:** Nobita421/workspace-Canvas  
**Branch:** master  
**Last analysed commit:** ead7aa7d8bfa2bbd6bf994ecb7794ade30545ab0  
**Analysis window:** 2026-01-06T16:47:26Z → 2026-01-06T16:47:42Z

---

## Summary

- **Grade:** A (94/100)
- **Issues:** 74 (4 issues / kLoC)
- **LoC:** 16,430
- **Complex files:** 14 (20%)
- **Duplication:** 7%
- **Coverage:** 0% (70/70 files uncovered)

---

## Issues (74)

| Severity | Category | Tool | Pattern | File | Line | Message |
| --- | --- | --- | --- | --- | ---: | --- |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L32) | 32 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-dynamic-delete | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L163) | 163 | Do not delete dynamically computed property keys. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L530) | 530 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L643) | 643 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L540) | 540 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/PlaygroundManager.tsx](src/components/ui/PlaygroundManager.tsx#L66) | 66 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/hooks/useWindowSize.ts](src/hooks/useWindowSize.ts#L24) | 24 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-dynamic-delete | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L160) | 160 | Do not delete dynamically computed property keys. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L122) | 122 | Unnecessary optional chain on a non-nullish value. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-misused-promises | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L156) | 156 | Promise returned in function argument where a void return was expected. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-dynamic-delete | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L32) | 32 | Do not delete dynamically computed property keys. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L243) | 243 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-possible-timing-attacks | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L45) | 45 | Potential timing attack, left side: true |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/Profile.tsx](src/components/ui/Profile.tsx#L41) | 41 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useRealtime.ts](src/hooks/useRealtime.ts#L59) | 59 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L271) | 271 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L148) | 148 | Generic Object Injection Sink |
| High | Security | ESLint | ESLint8_xss_no-mixed-html | [src/hooks/useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts#L124) | 124 | Non-HTML variable 'activeElement' is used to store raw HTML |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/TickerWidget.tsx](src/components/entities/TickerWidget.tsx#L28) | 28 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L35) | 35 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L198) | 198 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_xss_no-mixed-html | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L121) | 121 | Non-HTML variable 'target' is used to store raw HTML |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L263) | 263 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/PlaygroundManager.tsx](src/components/ui/PlaygroundManager.tsx#L69) | 69 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L532) | 532 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L163) | 163 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L225) | 225 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L294) | 294 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/ToastContainer.tsx](src/components/ui/ToastContainer.tsx#L63) | 63 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L128) | 128 | Unnecessary conditional, value is always truthy. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L92) | 92 | Unnecessary conditional, expected left-hand side of `??` operator to be possibly null or undefined. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/LaserPointer.tsx](src/components/ui/LaserPointer.tsx#L12) | 12 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/app/api/threads/route.ts](src/app/api/threads/route.ts#L207) | 207 | Generic Object Injection Sink |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L128) | 128 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/hooks/useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts#L151) | 151 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L223) | 223 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L205) | 205 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/hooks/useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts#L125) | 125 | Unnecessary optional chain on a non-nullish value. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L123) | 123 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/ToastContainer.tsx](src/components/ui/ToastContainer.tsx#L68) | 68 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L157) | 157 | Variable Assigned to Object Injection Sink |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-misused-promises | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L177) | 177 | Promise-returning function provided to attribute where a void return was expected. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L160) | 160 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L543) | 543 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L88) | 88 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L550) | 550 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L331) | 331 | Unnecessary conditional, both sides of the expression are literal values. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L152) | 152 | Unnecessary conditional, value is always truthy. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L513) | 513 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_xss_no-mixed-html | [src/components/entities/Zone.tsx](src/components/entities/Zone.tsx#L32) | 32 | Non-HTML variable 'targetElement' is used to store raw HTML |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L58) | 58 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L176) | 176 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L188) | 188 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L279) | 279 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L83) | 83 | Generic Object Injection Sink |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L151) | 151 | Variable Assigned to Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L175) | 175 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-unnecessary-condition | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L61) | 61 | Unnecessary conditional, both sides of the expression are literal values. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L129) | 129 | Variable Assigned to Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/PlaygroundManager.tsx](src/components/ui/PlaygroundManager.tsx#L34) | 34 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L522) | 522 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L498) | 498 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L94) | 94 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L132) | 132 | Generic Object Injection Sink |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L267) | 267 | Variable Assigned to Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L239) | 239 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | Trivy | Trivy_vulnerability_high | [package-lock.json](package-lock.json#L5206) | 5206 | Insecure dependency npm/next@16.0.9 (GHSA-5j59-xgg2-r9c4: Next has a Denial of Service with Server Components - Incomplete Fix Follow-Up) (update to 16.0.10) |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L182) | 182 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/entities/Zone.tsx](src/components/entities/Zone.tsx#L41) | 41 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| High | Security | ESLint | ESLint8_security_detect-object-injection | [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L156) | 156 | Generic Object Injection Sink |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/ui/Profile.tsx](src/components/ui/Profile.tsx#L54) | 54 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| Error | Security | ESLint | ESLint8_security-node_detect-possible-timing-attacks | [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L45) | 45 | Potential timing attack, left side: password |
| Warning | ErrorProne | ESLint | ESLint8_@typescript-eslint_no-confusing-void-expression | [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L92) | 92 | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |

