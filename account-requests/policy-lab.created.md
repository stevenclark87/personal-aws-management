# AWS Policy Lab account record

**Created:** 2026-11-16

| Field | Value |
| --- | --- |
| Account name | AWS Policy Lab |
| Account ID | `769674418312` |
| OU | `App-Experiment` (`ou-xlr2-pdspqlnq`) |
| Provisioning role | `OrganizationAccountAccessRole` |
| SCP attachment after lab approval | `deny-leave-organization` (`p-ukbxfvla`), lab account only |
| Tag-policy attachment | `standard-resource-tags` (`p-95yferwt1v`), reporting-only, lab account only |

## Account tags

- `Application=platform-policy-lab`
- `Environment=experiment`
- `CostCenter=personal-apps`
- `ManagedBy=personal-aws-management`

## Next permitted use

This account is the only first target for the policy package in `policies/`. The reporting-only standard-tag policy and the lab-only deny-leave SCP are attached for validation. No custom policy is attached to `Apps-Production`.
