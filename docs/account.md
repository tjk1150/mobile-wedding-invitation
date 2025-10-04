---
title: Account Section
summary: Collapsible account lists for groom and bride with copy-to-clipboard.
---

## Purpose
Provide guests with bank account numbers in a tidy, accessible, mobile-first UI. Each group (groom/bride) is a toggle. When expanded, it reveals multiple accounts with a one-tap copy action.

## UX
- Default: Both groups collapsed.
- Tap a group header to toggle expand/collapse.
- Expanded view lists each account as: Bank | Account Number and the Account Holder beneath, with a Copy button on the right.
- Copy action copies the account number to clipboard and shows a short confirmation toast (e.g., "복사되었습니다").
- On small screens, tap targets are at least 44px height.

## Accessibility
- Group header is a `<button>` with `aria-expanded` and `aria-controls`.
- The panel has `role="region"` and `aria-labelledby` that points to the header id.
- `Copy` button includes `aria-label` like: "계좌번호 복사: {bank} {accountNumber}".
- Focus order: header → first item → copy buttons. After copy, return focus to the same button.

## Data Shape
Recommended structure for content (localizable labels are omitted here):
```ts
export type AccountEntry = {
  bankName: string;          // e.g., "기업"
  accountNumber: string;     // display string with hyphens, e.g., "020-120598-01-013"
  accountHolder: string;     // e.g., "한창희"
  note?: string;             // optional memo (e.g., 관계, 지점)
};

export type AccountGroup = {
  titleKey: string;          // i18n key, e.g., 'account.groom.title'
  entries: AccountEntry[];
};
```

Example JSON (KR):
```json
{
  "account": {
    "title": "마음 전하실 곳",
    "groom": {
      "title": "신랑측 계좌번호",
      "entries": [
        {"bankName": "기업", "accountNumber": "020-120598-01-013", "accountHolder": "한창희"},
        {"bankName": "우리", "accountNumber": "1002-703-811267", "accountHolder": "한상열"},
        {"bankName": "국민", "accountNumber": "778-21-0277-104", "accountHolder": "김경임"}
      ]
    },
    "bride": {
      "title": "신부측 계좌번호",
      "entries": [
        {"bankName": "농협", "accountNumber": "302-0080-5373-81", "accountHolder": "박지연"},
        {"bankName": "하나", "accountNumber": "450-810702-90707", "accountHolder": "박창권"},
        {"bankName": "농협", "accountNumber": "302-0663-3044-11", "accountHolder": "한순옥"}
      ]
    },
    "copy": "복사",
    "copied": "계좌번호가 복사되었습니다"
  }
}
```

## Interaction Details
- Copy uses the Clipboard API: `navigator.clipboard.writeText(...)` with a graceful fallback to a hidden `<textarea>`.
- The copied text should by default be the unformatted number (digits only). To copy as displayed, set `copyAsDisplayed = true` in the component props.
- Optional: Haptic feedback on mobile (`navigator.vibrate?.(10)`).

## Component Outline (React/Next.js)
```tsx
// <section className="account" aria-label={t('account.title')}>
//   <AccountGroupToggle id="groom" title={t('account.groom.title')}
//     items={groomEntries} />
//   <AccountGroupToggle id="bride" title={t('account.bride.title')}
//     items={brideEntries} />
// </section>
```

Each `AccountGroupToggle`:
- Header button with chevron icon and `aria-expanded`.
- Content panel `<ul>` with list items containing:
  - left: "{bankName} | {accountNumber}"
  - below: `{accountHolder}`
  - right: Copy button

## CSS Hooks
- Wrap in `section.account` to inherit global section width/margins.
- Suggested classes: `.account-toggle`, `.account-panel`, `.account-item`, `.account-bank`, `.account-number`, `.account-name`, `.account-copy`.

## i18n Keys
- `account.title`
- `account.groom.title`, `account.bride.title`
- `account.copy`, `account.copied`

## Edge Cases
- Multiple accounts per group; groups may be empty (hide when 0 entries).
- Copy failures should show an error toast.
- Long account numbers should wrap gracefully; avoid overflow.

## QA Checklist
- Toggle works with keyboard and screen readers.
- Copy works on iOS Safari and Android Chrome.
- Localized strings appear from `locales/*.json`.
- Section respects `section.account` container styles.
