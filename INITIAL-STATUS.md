# AWS account foundation — confirmed starting point

**Confirmed 2026-11-16**

- An AWS Organizations management account already exists.
- The owner has a personal user able to access that management account.
- A member account for Math Facts Kids Game already exists.
- The first application will use its production account only; no separate development account is planned.
- No AWS configuration changes have been requested or made by this project.

## Read-only discovery

Completed on 2026-11-16. The findings are recorded in [DISCOVERY-2026-11-16.md](DISCOVERY-2026-11-16.md). The inventory inspected only:

1. the signed-in account and role;
2. organization identity, roots, OUs, and member-account placement;
3. enabled policy types, service control policies, and their attachments;
4. delegated administrators and trusted AWS service access;
5. whether AWS Control Tower already governs this organization;
6. the new application's account identity and available cross-account deployment path.

The inventory confirms the real starting state before an OU move, policy attachment, account bootstrap, or application deployment is proposed for approval.

## Recommended authentication approach

Use the normal AWS sign-in or SSO route for the management account, then refresh the connected AWS session in Codex. Routine work should use the personal non-root identity, not the management-account root user. Do not share an access key, secret key, password, MFA code, or Auth0 secret in chat.

If access is governed through IAM Identity Center, the ideal role is a temporary read-only audit role in the management account. If it is a personal IAM user, use a temporary session with only the required read permissions.
