# Personal AWS App Foundation

Reusable, low-idle-cost infrastructure foundations for personal AWS applications.

The first consumer will be Math Facts Space Academy, but this repository does not contain that game's code and does not deploy it automatically.

## Current status

- Organization baseline and operating access are documented in [DISCOVERY-2026-11-16.md](DISCOVERY-2026-11-16.md).
- `static-api-game/v1` is a **local, un-deployed** reusable CDK prototype.
- Math Facts Space Academy's existing SAM template remains its only deployment source of truth; see [the integration record](docs/integrations/math-facts-space-academy.md).
- No SCPs are defined or attached by this repository.
- Deployment requires an explicit approved change plan in the target account.

## Foundation contract

See [config/static-api-game.v1.example.json](config/static-api-game.v1.example.json) and [schemas/static-api-game.v1.schema.json](schemas/static-api-game.v1.schema.json). The consuming application supplies its built frontend path, Lambda code path, Auth0 issuer/audience, and permitted browser origins. Secrets are never part of this contract. A foundation must match an application's data schema and routes before it becomes that application's deployment source.

Every foundation configuration must also provide the standard cost-allocation tags: `Application`, `Environment`, `CostCenter`, and `ManagedBy`. `Application` and `Environment` derive from the app contract; `CostCenter` and `ManagedBy` are explicit platform inputs.

## Local review commands

```sh
npm install
npm run check
npm run synth
npm run diff
```

`synth` and `diff` inspect the desired CloudFormation result only. `deploy` is intentionally not provided as a convenience command; deployment must be invoked only after a reviewed change record and explicit approval.

## Architecture boundary

The foundation provisions only a private S3 origin, CloudFront, HTTP API with Auth0 JWT validation, on-demand Lambda, and on-demand DynamoDB. It intentionally excludes NAT gateways, load balancers, always-on compute, provisioned concurrency, and paid baseline monitoring services.

## Before a deployment

Follow [docs/runbooks/first-deployment.md](docs/runbooks/first-deployment.md). Use the `personal-admin` IAM Identity Center profile and the target account's `OrganizationAccountAccessRole`; do not use the management-account root user.
