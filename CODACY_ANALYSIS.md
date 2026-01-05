# Codacy Analysis Report - workspace-Canvas

**Date:** January 5, 2026  
**Repository:** [Nobita421/workspace-Canvas](https://github.com/Nobita421/workspace-Canvas)  
**Grade:** **A (93/100)**

---

## 📊 Summary Metrics

- **Total Issues:** 96
- **Lines of Code (LoC):** 16,108
- **Complex Files:** 13 (19%)
- **Duplication:** 7%
- **Test Coverage:** 0% (66 files uncovered)

---

## 🛡️ Security Issues (Critical/High)

| File Path | Line | Issue Description | Pattern ID |
| :--- | :--- | :--- | :--- |
| [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L56) | 56 | Variable Assigned to Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L147) | 147 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts#L124) | 124 | HTML passed in to function `['INPUT', 'TEXTAREA'].includes` | `xss_no-mixed-html` |
| [src/hooks/useRealtime.ts](src/hooks/useRealtime.ts#L58) | 58 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/components/entities/Zone.tsx](src/components/entities/Zone.tsx#L32) | 32 | HTML passed in to function `['INPUT', 'TEXTAREA', 'BUTTON'].includes` | `xss_no-mixed-html` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L150) | 150 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L267) | 267 | Variable Assigned to Object Injection Sink | `security_detect-object-injection` |
| [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L30) | 30 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L130) | 130 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L155) | 155 | Variable Assigned to Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L127) | 127 | Generic Object Injection Sink | `security_detect-object-injection` |
| [package-lock.json](package-lock.json#L5206) | 5206 | Insecure dependency `next@16.0.7` (GHSA-mwv6-3258-q52c) | `Trivy_vulnerability_high` |
| [src/components/ui/ErrorBoundary.tsx](src/components/ui/ErrorBoundary.tsx#L53) | 53 | Dangerous `location.href` assignment (XSS risk) | `xss_no-location-href-assign` |
| [src/app/api/threads/route.ts](src/app/api/threads/route.ts#L207) | 207 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L45) | 45 | Potential timing attack in password comparison | `security_detect-possible-timing-attacks` |
| [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L51) | 51 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L83) | 83 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L157) | 157 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L151) | 151 | Function Call Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L154) | 154 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L128) | 128 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L129) | 129 | Generic Object Injection Sink | `security_detect-object-injection` |
| [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L29) | 29 | Generic Object Injection Sink | `security_detect-object-injection` |

---

## ⚠️ Error Prone Issues (High/Warning)

| File Path | Line | Issue Description | Pattern ID |
| :--- | :--- | :--- | :--- |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L86) | 86 | Promises must be awaited or marked as ignored | `no-floating-promises` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L150) | 150 | Unnecessary conditional, value is always truthy | `no-unnecessary-condition` |
| [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L177) | 177 | Promise-returning function provided to attribute where void expected | `no-misused-promises` |
| [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx#L40) | 40 | Promises must be awaited or marked as ignored | `no-floating-promises` |
| [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L61) | 61 | Unnecessary conditional, both sides are literal values | `no-unnecessary-condition` |
| [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L230) | 230 | Invalid operand for a '+' operation (unknown type) | `restrict-plus-operands` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L156) | 156 | Do not delete dynamically computed property keys | `no-dynamic-delete` |
| [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L85) | 85 | Unnecessary conditional on non-nullish value | `no-unnecessary-condition` |
| [src/hooks/useThreadData.ts](src/hooks/useThreadData.ts#L154) | 154 | Promise returned in function argument where void expected | `no-misused-promises` |
| [src/components/ui/AuthModal.tsx](src/components/ui/AuthModal.tsx#L308) | 308 | Promise-returning function provided to attribute where void expected | `no-misused-promises` |
| [src/hooks/useCanvasState.ts](src/hooks/useCanvasState.ts#L127) | 127 | Unnecessary conditional, value is always truthy | `no-unnecessary-condition` |
| [src/components/workspace/ConnectionLines.tsx](src/components/workspace/ConnectionLines.tsx#L29) | 29 | Do not delete dynamically computed property keys | `no-dynamic-delete` |
| [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L331) | 331 | Unnecessary conditional, both sides are literal values | `no-unnecessary-condition` |
| [src/hooks/useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts#L124) | 124 | Unnecessary optional chain on a non-nullish value | `no-unnecessary-condition` |
| [src/components/entities/Card.tsx](src/components/entities/Card.tsx#L190) | 190 | Forbidden non-null assertion | `no-non-null-assertion` |
| [src/components/workspace/Canvas.tsx](src/components/workspace/Canvas.tsx#L305) | 305 | Promises must be awaited or marked as ignored | `no-floating-promises` |

---

## 🎨 Code Style & Best Practices

The majority of the remaining issues (approx. 50+) are **"Returning a void expression from an arrow function shorthand is forbidden"** (`no-confusing-void-expression`).

**Affected Files:**

- `src/components/workspace/Canvas.tsx`
- `src/components/ui/Profile.tsx`
- `src/components/entities/Zone.tsx`
- `src/components/entities/Card.tsx`
- `src/components/ui/AuthModal.tsx`
- `src/components/workspace/ConnectionLines.tsx`
- `src/hooks/useWindowSize.ts`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/components/ui/PlaygroundManager.tsx`
- `src/components/ui/ToastContainer.tsx`
- `src/components/entities/TickerWidget.tsx`
- `src/components/ui/LaserPointer.tsx`

---

## 📦 Dependency Vulnerabilities

- **Next.js Vulnerability:** `next@16.0.7` is vulnerable to Denial of Service and Source Code Exposure.
- **Recommendation:** Update to `next@16.0.9` or later in `package.json` and lock files.
