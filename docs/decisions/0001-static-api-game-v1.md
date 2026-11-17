# ADR 0001: Static API Game Foundation v1

**Status:** accepted for local implementation; not deployed.

## Decision

Use a versioned CDK foundation for a static web game with a private S3 origin, CloudFront, API Gateway HTTP API, Auth0 JWT validation, on-demand Lambda, and on-demand DynamoDB in `us-east-1`.

## Constraints

- One production account for the first app.
- No NAT gateway, load balancer, always-on server, or provisioned concurrency.
- Auth0 remains external; issuer/audience are configuration, not secrets.
- DynamoDB and S3 are retained during stack deletion.
- SCP work belongs in the separate `App-Experiment` account and is not part of v1.

## Consequences

The consumer must provide a built frontend and Lambda artifact. CDK bootstrapping/deployment dependencies are considered explicitly during review, not silently added by the foundation.
