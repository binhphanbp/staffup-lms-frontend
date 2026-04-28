# StaffUp LMS — Audit báo cáo (dev branch, 2026-04-27)

Snapshot cuối:

- BE: `dbf242f` — `Merge pull request #100 from binhphanbp/devin/1777218810-p23-course-forum`
- FE: `45a279b` — `Merge pull request #76 from binhphanbp/devin/1777218810-p23-course-forum`

Toàn bộ check chạy trên `origin/dev` mới nhất sau pull, deps clean install, BE migrate + seed thành công, BE/FE đều start được.

---

## 1. Đã DONE từ lần review trước (HANDOFF → thực tế trên dev)

| HANDOFF mã             | Tên                                                                         | BE PR   | FE PR       | Verify                                                                                  |
| ---------------------- | --------------------------------------------------------------------------- | ------- | ----------- | --------------------------------------------------------------------------------------- |
| P2.1                   | Adaptive Quiz (GMAT-style, Elo, band)                                       | #92 #93 | #68 #69     | `/adaptive-quiz` load OK, `/adaptive-quiz/banks` 200, admin `/adaptive-quiz-admin` có   |
| P2.2                   | Skill Gap Analysis (skill catalog, position matrix, my-gap, history)        | #94 #99 | #70 #72     | `/skill-gap/my-gap` 200, `/skill-profile` + `/skill-history` load                       |
| P2.7                   | PWA + offline lesson                                                        | —       | #67         | manifest + SW + prompt "Cài StaffUp lên thiết bị" hiện trên mọi page                    |
| P2.3 polish            | Voice Roleplay (rollback turn on AI fail, end-session khi chatbot disabled) | #90     | #65         | endpoint OK                                                                             |
| Forum                  | Course discussion forum (P2.3 trong HANDOFF mới)                            | #100    | #76         | UI render OK nhưng **BE 500 — xem bug #1**                                              |
| Leaderboards           | Adaptive Quiz + Voice Roleplay leaderboard                                  | #95     | #71         | `/adaptive-quiz/leaderboard` 200, sidebar có `BXH Adaptive Quiz` + `BXH Voice Roleplay` |
| Manager                | Department analytics + Manager Coach RBAC fix                               | #98     | #74         | `/manager/department-analytics` 200                                                     |
| RBAC                   | Trainer access cho admin Adaptive Quiz + Skills pages                       | —       | #73         | role check                                                                              |
| Bug fix                | Skill profile mock data, admin double header, RoleGuard race                | —       | #75         | merged                                                                                  |
| Multi-problem Code Lab | Registry DB + persist submissions                                           | #91     | #66         | `/lab` 5 problems, FizzBuzz có history 100/100, `/lab/[slug]` editor OK                 |
| Dark mode toggle       | Header có nút toggle "Chuyển sang chế độ tối"                               | —       | (đã có sẵn) | nút render OK                                                                           |
| P2.4                   | Video Lesson AI Summary (làm session trước)                                 | #84     | #62         | đã merged                                                                               |

---

## 2. BUGS phát hiện (theo độ ưu tiên)

### BUG #1 — CRITICAL: Forum listThreads BE trả 500 (Express 5 + Zod validate middleware)

**Triệu chứng**

```
GET /api/v1/courses/1/forum/threads → 500
GET /api/v1/courses/1/forum/threads?page=1&limit=10 → 500
PrismaClientValidationError: Argument `take`: Invalid value provided. Expected Int, provided String.
PrismaClientValidationError: Argument `skip` is missing.
```

**Tác động**

- Mọi list thread (forum) trong learning room đều 500 → tab "Hỏi đáp (Q&A)" hiển thị empty/loading mãi.
- Chặn flow forum hoàn toàn (PR #100 BE + #76 FE vừa merged).

**Root cause (đã trace)**

1. Project upgrade lên `express@^5.2.1`. Express 5 làm `req.query` thành read-only (verified: `Object.defineProperty` trên `req.query` silently no-op).
2. `src/middlewares/validate.middleware.ts:74-89` cố gắng mutate `req.query` bằng `delete` + `Object.defineProperty` → KHÔNG có hiệu lực trên Express 5 → controller nhận giá trị string gốc, không phải số đã parse từ Zod.
3. `forum.service.ts:335` tính `skip = (query.page - 1) * query.limit`:
   - Khi không có qs: `query.page` undefined → `skip = NaN`, `take = undefined` → Prisma reject.
   - Khi có qs: `query.page = "1"`, `query.limit = "10"` (string) → `skip = 0`, `take = "10"` → Prisma reject vì `take` phải là Int.
4. Lý do các route khác KHÔNG fail: hoặc service tự cast `Number()` (vd `enrollment.service.ts:listEnrollments`) hoặc destructure default (`const {page = 1, limit = 20} = query`). Forum thiếu cả 2 nên bị lộ bug ra ngay.

**Đề xuất fix** (chọn 1):

- (A) Quick patch service: thêm `Number(query.page ?? 1)`, `Number(query.limit ?? 10)` trong `forum.service.ts`.
- (B) Fix root: refactor `validate.middleware.ts` lưu kết quả vào `res.locals.validated{Body,Query,Params}` thay vì mutate `req.*`. Cập nhật tất cả controller đọc từ `res.locals`. (Đúng hơn nhưng đụng nhiều file).
- (C) Compromise: trong middleware, gán parsed result vào `req.validatedQuery / validatedParams`. Controller đọc từ đó. Backward compat: vẫn để mutate cũ chạy (no-op trên Express 5).

Recommend: **(A)** trước để unblock; sau đó (C) hoặc (B) để fix gốc.

File liên quan: <ref_snippet file="/home/ubuntu/repos/staffup-lms-backend/src/services/forum.service.ts" lines="335-362" /> · <ref_snippet file="/home/ubuntu/repos/staffup-lms-backend/src/middlewares/validate.middleware.ts" lines="68-89" />

---

### BUG #2 — CRITICAL: Duplicate `selfEnroll` & `selfEnrollSchema`

**File**:

- <ref_snippet file="/home/ubuntu/repos/staffup-lms-backend/src/schemas/enrollment.schema.ts" lines="32-37" />
- <ref_snippet file="/home/ubuntu/repos/staffup-lms-backend/src/controllers/enrollment.controller.ts" lines="15-38" />

**Triệu chứng**

```
src/schemas/enrollment.schema.ts(32,14): error TS2451: Cannot redeclare block-scoped variable 'selfEnrollSchema'.
src/schemas/enrollment.schema.ts(35,14): error TS2451: Cannot redeclare block-scoped variable 'selfEnrollSchema'.
src/controllers/enrollment.controller.ts(32,10): error TS2300: Duplicate identifier 'selfEnroll'.
```

**Tác động**: Code chạy được dev mode (transpile-only) nhưng `tsc --noEmit` fail → block production build. Pre-existing (commit `876dba7`) nhưng vẫn còn nguyên — chứng tỏ team chưa chạy typecheck CI gate.

**Fix**: xoá block lặp lại (lines 35-37 schema và lines 32-38 controller). Sửa 30 giây.

---

### BUG #3 — Typecheck errors (15 errors, 8 file)

`pnpm tsc --noEmit` fail với 15 errors. Không break runtime (vì dev dùng `--transpile-only`) nhưng block production build. Liệt kê:

| File                                             | Line        | Lỗi                                                                                                              |
| ------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/config/gemini.config.ts`                    | 1           | `@google/genai` là ESM-only, cần dynamic `import()` (TS1479)                                                     |
| `src/controllers/company-document.controller.ts` | 76, 97, 108 | `await import('@/utils')` — TS không resolve path alias trong dynamic import → cannot find module                |
| `src/controllers/company-document.controller.ts` | 84          | `pdf-parse` default export không tồn tại trên ESM types                                                          |
| `src/controllers/course.controller.ts`           | 32          | `ParsedQs` thiếu property `expand: string[]` (mismatch type assertion)                                           |
| `src/controllers/enrollment.controller.ts`       | 32          | duplicate `selfEnroll` (xem bug #2)                                                                              |
| `src/schemas/enrollment.schema.ts`               | 32, 35      | duplicate `selfEnrollSchema` (xem bug #2)                                                                        |
| `src/services/ai-chat.service.ts`                | 281, 408    | `Record<string, unknown>[]` không assignable cho Prisma `InputJsonValue` (cần cast `as Prisma.InputJsonArray`)   |
| `src/services/course.service.ts`                 | 881-882     | type narrow fail: `query.expand.split(',')` — type của `query.expand` chưa narrow xuống string trong else branch |
| `src/services/user.service.ts`                   | 312, 322    | tuple `[string, number][]` không match `(string \| number)[][]` từ `Object.entries`                              |

**Đề xuất**: gộp thành 1 PR "fix: resolve typecheck errors blocking production build". 1-2h dev.

---

### BUG #4 — ENV: GEMINI_API_KEY đã hit monthly spending cap

**Triệu chứng**

```
[Reco] Gemini call failed: {"error":{"code":429,"message":"Your project has exceeded its monthly spending cap...","status":"RESOURCE_EXHAUSTED"}}
GET /api/v1/recommendations/me 502
```

**Tác động (rộng)**: Mọi tính năng dùng Gemini sẽ trả `502 AI service unavailable`:

- Personalized Recommender (`/recommendations/me`)
- AI Course Studio
- AI Question Generator
- Code Lab AI Reviewer (submit)
- Video Lesson AI Summary (generate)
- AI Q&A trong Learning Room
- AI Grading
- Voice Roleplay
- Adaptive Quiz (nếu dùng AI explain)
- Manager Coach Chat / Weekly Briefing
- Skill Gap AI suggestions

**Không phải code bug**, nhưng cần:

- Vào https://ai.studio/spend để raise cap, hoặc
- Tạo project Gemini mới và rotate `GEMINI_API_KEY` trong `.env` BE.

---

## 3. Lint / quality

| Repo | Errors | Warnings |
| ---- | ------ | -------- |
| BE   | 0      | 332      |
| FE   | 0      | 24       |

Không block, nhưng tech-debt:

- BE: chủ yếu `@typescript-eslint/no-explicit-any`, `prefer-const`, ~119 chỗ `prisma as any` (HANDOFF tech debt cũ còn nguyên).
- FE: `@next/next/no-img-element` (10 chỗ) + một vài `react-hooks/exhaustive-deps` (admin/learning-progress, admin/risk-assessment).

---

## 4. CHƯA LÀM / nên làm tiếp (theo HANDOFF, loại trừ phần đồng đội)

### Hackathon-friendly (high impact, không đụng team-mate)

| Mã             | Tên                                             | Effort       | Lý do                                                                    |
| -------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------ |
| **Bug fix #1** | Forum 500 (Express 5 + validate)                | S (≤30 phút) | **CRITICAL — broken trong prod**                                         |
| **Bug fix #2** | Duplicate selfEnroll/selfEnrollSchema           | S (5 phút)   | block production build                                                   |
| **Bug fix #3** | 13 typecheck errors khác                        | M (1-2h)     | block production build                                                   |
| P0.4           | Mobile responsive deep-check                    | M            | sidebar collapse mobile, table → card stack, modal full-screen mobile    |
| P0.4           | A11y pass                                       | M            | keyboard nav (Tab/Enter trên modal), aria-label, contrast AA, focus ring |
| Tech debt      | Cleanup `prisma as any` (119 chỗ)               | M            | type safety, refactor sang Prisma generated types                        |
| Tech debt      | Tách `course.service.ts` (2026 dòng giờ)        | M            | bounded context: course-crud / publish / content                         |
| Tech debt      | Redis rate-limit cho `ai-chat` (hiện in-memory) | S-M          | scale + protect AI cost                                                  |

### Đồng đội đang làm (không đụng vào)

- P2.3 Voice Roleplay polish thêm

### HANDOFF cũ — đã verify done không cần làm

- P2.4 Video Lesson AI Summary
- P2.5 Onboarding Builder UI nâng cao
- P2.7 PWA + offline lesson
- P0.4 Dark mode foundation + toggle (header có nút, đã wire)

---

## 5. Khuyến nghị thứ tự làm tiếp

1. **NGAY**: fix Bug #1 (forum 500) — quick patch (A) trong forum.service.ts, deploy hotfix.
2. **NGAY**: fix Bug #2 (duplicate selfEnroll) — xoá block lặp.
3. **NGAY**: rotate GEMINI_API_KEY hoặc raise cap (env, không phải code).
4. **Tuần này**: dọn 13 tsc errors còn lại để bật production build.
5. **Tuần sau**: P0.4 Mobile responsive deep-check + A11y pass — chấm điểm UI/UX cao cho hackathon.
6. **Sau đó**: dọn tech debt (`prisma as any`, split course.service.ts).

---

## 6. Tệp liên quan

Bug #1 — Forum:

- `src/middlewares/validate.middleware.ts` (root cause Express 5)
- `src/services/forum.service.ts:335-362`
- `src/controllers/forum.controller.ts:8-15`

Bug #2 — Duplicate enrollment:

- `src/schemas/enrollment.schema.ts:32-37`
- `src/controllers/enrollment.controller.ts:15-38`

Bug #3 — Typecheck:

- (xem bảng trên)

Bug #4 — env:

- `.env` (rotate `GEMINI_API_KEY`)
