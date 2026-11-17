# Deployment access and role boundaries

## Immediate profile chain

`personal-admin` is the human IAM Identity Center profile in the management account. It is an SSO profile, so renew it with:

```sh
aws sso login --profile personal-admin
```

It is **not** renewed with `aws login`. The application-account profiles assume their respective account bootstrap role from `personal-admin`:

| Profile | Account | Role | Use |
| --- | --- | --- | --- |
| `policy-lab` | `769674418312` | `OrganizationAccountAccessRole` | Experiment-only policy and deployment tests |
| `math-facts-production` | `677132534084` | `OrganizationAccountAccessRole` | First production release only |

The production profile configuration is:

```ini
[profile math-facts-production]
role_arn = arn:aws:iam::677132534084:role/OrganizationAccountAccessRole
source_profile = personal-admin
region = us-east-1
```

After SSO login, always verify the assumed target before a deployment:

```sh
aws --profile math-facts-production sts get-caller-identity
```

It must return account `677132534084`. Do not use root credentials for normal deployment work.

## Long-term roles

The existing `OrganizationAccountAccessRole` is appropriate as a bootstrap/recovery path but is broader than a long-term application deployment role. Evolve to these boundaries:

| Role or permission set | Scope | Allowed purpose |
| --- | --- | --- |
| `PlatformAdmin` Identity Center permission set | Management account | OUs, account vending, organization-policy lifecycle; no application workloads |
| `AppDeploymentRole` | One application account | CloudFormation deployment of that app's reviewed stacks, scoped `iam:PassRole`, S3 artifact upload, and CloudFront invalidation |
| `AppCloudFormationExecutionRole` | One application account | Only the resource actions required by that app's approved infrastructure template |
| `AppOperatorReadOnly` | One application account | Troubleshooting and cost/resource inspection; no mutations |
| Lambda runtime role | One function | Only its data and logging permissions; never deployment/admin permissions |
| Root user | Each account | MFA-protected emergency account recovery only |

## Operating principles

1. Use short-lived IAM Identity Center sessions and named profiles; never create routine long-lived access keys.
2. Separate organization governance, deployment, runtime, and read-only troubleshooting permissions.
3. Require a target-account identity check before every production mutation.
4. Deploy the same reviewed source revision through a change set; never patch production through the console.
5. Keep the policy-lab account as the first target for new SCPs, tag policies, and account-baseline changes.
6. Narrow the bootstrap `OrganizationAccountAccessRole` only after the replacement deployment/read-only roles have been proven in Policy Lab.
