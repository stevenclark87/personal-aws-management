# Organization-policy test protocol

## Safety rules

- The policy package starts unattached. `policies/manifest.json` must list no targets until explicit approval.
- Keep AWS-managed `FullAWSAccess` in place at the root and OUs. These are deny-based guardrails, not a replacement allowlist.
- Use the `App-Experiment` policy-lab account for every first attachment.
- Record the policy file hash, account/OU target, start/end time, expected result, actual result, and rollback action in the change record.
- Roll back by detaching the just-attached policy from the lab target; do not edit policy text in place during a test.

## Test order

1. Attach the tag policy in reporting-only mode and confirm the four standard keys/casing are recognized. It must not block resource creation.
2. Attach `deny-leave-organization` to the lab account; verify an attempt to leave is denied and normal account administration still works.
3. Build and deploy the Math Facts fixture stack in the lab account only after the application deployment plan is approved.
4. Draft and test a Region-boundary SCP only after the fixture’s required API calls are captured.
5. Promote only a documented, unchanged policy version to `Apps-Production`.

## Promotion gate

Promotion requires a reviewed change record, successful lab test evidence, a named rollback owner, and an explicit approval. No policy is promoted by account-vending automation merely because it exists in this repository.
