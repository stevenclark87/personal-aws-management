# Math Facts Space Academy integration record

**Status:** inspected locally; no application or AWS changes made.

## Auth0 configuration verified

The game repository already contains these public identifiers in `src/runtime-config.js`:

| Setting | Verified value |
| --- | --- |
| Domain | `dev-asm5l37e0xa0flt1.us.auth0.com` |
| Client ID | `VZAKAukHZhVNMLfy1KqIHI7Ak9MylAIq` |
| API audience | `https://math-facts-api` |
| API Gateway issuer value | `https://dev-asm5l37e0xa0flt1.us.auth0.com/` |

These are public browser/API identifiers, not secrets. No Auth0 client secret is required or permitted for the game browser build.

## Canonical deployment path

The application already has a reviewed SAM implementation in `infra/template.yaml` and a parent-operated release script at `scripts/deploy.mjs`. It provisions the required private S3 + CloudFront, HTTP API with Auth0 JWT validation, on-demand Lambda, and on-demand DynamoDB architecture.

For the first release, **this SAM template is the only approved infrastructure source of truth**. Do not deploy `static-api-game/v1` for Math Facts Space Academy: its current generic data key and catch-all-route contract do not match the game’s `pk`/`sk` table and `/profile` API contract.

## Platform role for the first release

This repository provides the organization baseline, access path, change record, review gates, and deployment runbook. After the first successful application release, extract the proven SAM contract into a reusable platform foundation version that supports explicit table-key and route definitions.

## Remaining pre-deployment action

Run the application’s local tests and prepare a deployment change record using the personal IAM Identity Center identity. The CloudFront URL is created by the approved stack; after deployment, add that exact URL to Auth0's Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins.
