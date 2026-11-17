# ADR 0002: Preserve the Math Facts SAM template as canonical

**Status:** accepted.

## Context

The platform repository's generic CDK prototype and Math Facts Space Academy both describe the same broad service architecture. Inspection found important application-specific differences: the game requires a `pk`/`sk` DynamoDB schema and a JWT-protected `/profile` route, while the prototype assumes a single-key table and a catch-all API route.

## Decision

Use `math-facts-kids-game/infra/template.yaml` and its release workflow as the only deployment path for the first game release. Retain the CDK prototype for future design work, but do not treat it as a migration target or a second stack for this app.

## Consequences

There is one deployable infrastructure definition for the game, preventing duplicate resources or conflicting updates. A future reusable foundation version must expose application data-key, routes, CORS, and artifact inputs explicitly and prove compatibility through a migration plan before adoption.
