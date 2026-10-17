# Transition from Recovery Phrase to Email & Password Authentication

Replace the 12-word recovery phrase (mnemonic) authentication flow with a clean, professional Email & Password sign-up and sign-in experience while maintaining sequential numeric User IDs (`1`, `2`, `3`, ...) and full backward compatibility.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmation in Phase 1:
> - **Authentication Method**: Users sign up and sign in using **Email address** and **Security Password**.
> - **User ID Allocation**: New accounts continue to receive auto-assigned sequential numeric IDs (`1`, `2`, `3`, ...).
> - **Account Migration**: Existing accounts (such as User #1 and User #2) will be updated to store an email field (e.g. `user1@boostpay.app`, `user2@boostpay.app`), allowing seamless sign-in with email and password without data loss.

- **Confirmed Decision 1**: Email and Password authentication replacing recovery phrases.
- **Confirmed Decision 2**: Sequential numeric User IDs (`1`, `2`, ...) automatically assigned on email signup.
- **Confirmed Decision 3**: Non-destructive data migration for existing users.

---

## 1. Overview & Core Concept

- **What It Does**: Removes 12-word phrase generation and copy-phrase requirements from the Auth Gate (`AuthGate.tsx`). Replaces them with an Email input field and Password verification.
- **Target Audience**: Everyday fintech users who prefer standard email/password login.
- **Key Value**: Streamlined onboarding and familiar banking-grade authentication.

---

## 2. User Experience & Visual Design

- **Sign In Tab**:
  - Input field for **Email Address** (e.g., `user@gmail.com`).
  - Input field for **Security Password** with show/hide toggle.
  - Submit button: "Sign In to Wallet".
- **Create Account Tab**:
  - Input field for **Email Address**.
  - Input field for **Security Password**.
  - Input field for **Confirm Password**.
  - Submit button: "Complete Registration".
- **Admin Portal Inspection**:
  - The Admin User Directory will display user email addresses alongside their sequential User ID, balance, and lifetime profit.

---

## 3. Technical Architecture & Data Strategy

### Data Model Changes (`src/types.ts` & Backend `User` Entity)
- Replace or supplement `phrase: string` with `email: string`.
- Retain `id: string` (sequential numeric ID: `1`, `2`, `3`, ...).
- Retain `password?: string`.

### Component & Store Changes
1. **`src/types.ts`**: Add `email: string` to `User`.
2. **`src/components/AuthGate.tsx`**: Replace mnemonic generation and phrase copy box with email input.
3. **`src/services/store.ts` & `server.ts`**:
   - Update `registerUser(email, password)` to store email.
   - Update `loginUser(email, password)` to authenticate against `user.email === cleanEmail`.
   - Migrate existing database records in `data/boostpay_db.json` to have default emails (e.g. `admin@boostpay.app` for user #1, `user2@boostpay.app` for user #2).
