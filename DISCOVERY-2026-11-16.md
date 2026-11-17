# Read-only AWS organization discovery — 2026-11-16

## Scope and safety

This record is based only on successful read-only AWS API calls. No accounts, OUs, policies, roles, resources, or billing settings were changed.

## Confirmed baseline

| Area | Finding |
| --- | --- |
| Organization | `o-69thjcwurl`; all features enabled |
| Management account | `323041437079` — **Management Account** |
| First application account | `677132534084` — **Math Facts Space Academy**; active; created today |
| Current hierarchy | Both accounts are direct children of the organization root (`r-xlr2`); no OUs exist yet |
| SCP capability | Enabled; the only SCP definition present is AWS-managed `FullAWSAccess` |
| Direct SCP attachments | No SCP was returned as directly attached to the root or Math Facts account. No custom restriction is evident from this inventory. |
| Delegated administrators | None |
| Trusted AWS service access | IAM Identity Center (`sso.amazonaws.com`) only |
| AWS Control Tower | No landing zone exists |

## Important access observation

The local sign-in used for this inventory resolved to the **management-account root user**, not the personal user mentioned earlier. That was adequate for a narrowly scoped read-only inventory, but it should not become the normal platform operating path.

Before any implementation work, use the personal administrator identity or IAM Identity Center role for routine access, with MFA. Keep the management-account root user for account recovery and exceptional break-glass use only.

## Non-root operating access — verified 2026-11-16

The local `personal-admin` profile now authenticates through IAM Identity Center as `steven.clark87` with the management account's `AdministratorAccess` permission set. It successfully assumed the Math Facts account's existing `OrganizationAccountAccessRole` for a short, read-only access check.

This is the approved normal path for future reviewed platform and deployment work. The role-assumption check returned no secrets and made no persistent changes.

## Approved organization change — completed 2026-11-16

The following approved actions were completed and independently verified:

| Action | Result |
| --- | --- |
| Created `App-Experiment` OU | Created beneath the organization root (`ou-xlr2-pdspqlnq`) |
| Created `Apps-Production` OU | Created beneath the organization root (`ou-xlr2-j7qwznay`) |
| Moved Math Facts account | **Math Facts Space Academy** is now a child of `Apps-Production` |
| Attached SCPs | None; `Apps-Production` has no direct SCP attachments |

No application resources, IAM roles, billing settings, Auth0 settings, or SCPs were changed.

## Policy-lab account — created 2026-11-16

**AWS Policy Lab** (`769674418312`) was created as a member account, moved to `App-Experiment`, and tagged with the standard platform tags. Its initial `OrganizationAccountAccessRole` is available for controlled lab access. No SCP is attached to the account.

The Organizations Tag Policy type was then enabled and the reporting-only `standard-resource-tags` policy (`p-95yferwt1v`) was attached to AWS Policy Lab only. At that stage, no SCP was attached to the lab or production account.

The SCP policy type was then enabled. AWS attached its default `FullAWSAccess` policy to the member accounts, and the custom `deny-leave-organization` SCP (`p-ukbxfvla`) was attached to AWS Policy Lab only. The Math Facts production account has only `FullAWSAccess`; no custom SCP is attached.

## Recommended next changes — proposed, not performed

1. Leave `FullAWSAccess` in place; do not attach a service allowlist or Region-deny policy yet.
2. Set up the ordinary cross-account administration/deployment path from the management account to the application account using the user's non-root identity or IAM Identity Center. Verify it with read-only role assumption before any deployment.
3. Implement the versioned application foundation in this repository, synthesize it, review its change set, and request explicit approval before deploying anything into the Math Facts account.

## Why this order

The organization has no existing OU or policy complexity to preserve, so the account move is low in organizational complexity. However, the newly created application account still needs its access/deployment baseline reviewed. A policy-lab account should be created before testing restrictive SCPs; testing policy behavior in the child-focused production account would needlessly risk the game’s deployment path.

## Remaining read-only checks before implementation

- Verify the personal non-root administrator/Identity Center role and its management-account permissions.
- Verify the `OrganizationAccountAccessRole` or intentionally chosen cross-account role in the Math Facts account, without relying on root credentials.
- Inventory the account's enabled Regions and any initial resources/CloudTrail configuration after the account-creation process settles.
- Confirm the preferred application deployment identity and repository/CI location.

