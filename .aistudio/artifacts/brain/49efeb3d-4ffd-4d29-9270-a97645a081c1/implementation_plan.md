# Duplicate Account Prevention & Admin Deletion

Implement duplicate email prevention during new user registration and provide administrators with explicit controls to delete user accounts directly from the Admin Portal.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmation in Phase 1:
> - **Duplicate Prevention**: Prevent new sign-ups if an account with the same email address already exists.
> - **Admin Deletion**: Enable administrators to delete duplicate or unwanted accounts directly from the Admin Portal (`DATABASE` or user management tab).

- **Confirmed Decision 1**: Block registration if email already exists.
- **Confirmed Decision 2**: Admin Portal deletion action for cleaning up accounts.

---

## 1. Overview & Core Concept

- **What It Does**: Validates during registration that the submitted email is not already registered. If it exists, returns a clear error message prompting the user to sign in instead. Adds a delete button in the Admin Portal user list.
- **Key Value**: Clean user database with zero duplicate emails and full administrative cleanup control.

---

## 2. Technical Architecture & Implementation Steps

1. **Backend & Store Registration Validation (`server.ts` & `store.ts`)**:
   - In `/api/users/register` and `registerUser`, check if `db.users` already contains an account with `user.email.toLowerCase() === cleanEmail`.
   - If found and not a restoration of the same user ID, return a 400 error: `"An account with this email address already exists. Please sign in."`
2. **Admin Portal User Deletion (`AdminPortal.tsx` & `server.ts`)**:
   - Ensure `handleDeleteUser` correctly removes the user from `db.users` and cleans up associated transactions/notifications or cascades safely.
   - Display a Delete button for each user in the Admin Portal User Table.
