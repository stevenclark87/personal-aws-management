# Math Facts Space Academy — Policy Lab change-set review

**Status:** executed successfully in AWS Policy Lab; not deployed to production.

## Scope

| Field | Value |
| --- | --- |
| Target account | AWS Policy Lab (`769674418312`) |
| Region | `us-east-1` |
| Stack | `MathFactsSpaceAcademyLabReview` |
| Change set | `samcli-deploy1794888228` |
| Change-set status | Executed successfully |
| Stack status | `CREATE_COMPLETE` |

## Validated inputs

- The Math Facts SAM template passed `sam validate --lint`.
- The application package built successfully with SAM.
- The template's production-only environment constraint was preserved; the Policy Lab account and stack name provide the test boundary.
- Point-in-time recovery remains disabled for this review, avoiding an unapproved recurring backup cost.

## Proposed resources: 11 additions

- API Gateway HTTP API and default stage
- Private S3 game bucket and scoped bucket policy
- CloudFront distribution and origin access control
- Lambda function, least-privilege role, invoke permission, and 30-day log group
- On-demand DynamoDB progress table

The change set proposes no VPC, NAT gateway, load balancer, provisioned concurrency, RDS database, or always-on compute.

## Post-deployment verification

- All 11 stack resources reached `CREATE_COMPLETE`.
- The standard tags were observed on the HTTP API/stage, S3 bucket, Lambda function, CloudFormation stack, CloudFront distribution, DynamoDB table, and Lambda log group.
- The S3 bucket has all four public-access blocks enabled.
- An unauthenticated `GET /profile` returned `401`, confirming the HTTP API JWT authorizer rejects anonymous access.

## Lab outputs

| Output | Value |
| --- | --- |
| Game URL | `https://d7ys3fv2hpmbf.cloudfront.net` |
| API URL | `https://e6wbmt3a58.execute-api.us-east-1.amazonaws.com` |
| CloudFront distribution | `E22AFRM2AHYXVN` |

The frontend build has not been uploaded to the lab bucket because executing a pre-created CloudFormation change set intentionally bypasses the application's release script. Auth0 has not been configured with the lab CloudFront URL, so an end-to-end browser login test has not been attempted.

## Supporting artifact storage

`PolicyLabSamArtifacts` is a private, encrypted, tagged temporary S3 bucket holding the packaged Lambda/template artifacts. It has a seven-day expiration rule. It remains until this review change set is either executed or discarded, then it should be emptied and removed.

## Approval boundary

This lab stack does **not** deploy Math Facts to its production account. A separate explicit approval is required for production deployment. The temporary artifact bucket remains until the lab review is complete, then it should be emptied and removed.
