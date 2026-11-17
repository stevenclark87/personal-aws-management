# First deployment runbook

## Preconditions

1. Use `aws sso login --profile personal-admin`; do not use root credentials.
2. Confirm the target account is **Math Facts Space Academy** and remains in `Apps-Production`.
3. Obtain Auth0's non-secret issuer URL and API audience. Do not place any Auth0 client secret in this repository or CDK context.
4. Build the game frontend and Lambda bundle in its own repository.
5. Copy the example configuration outside source control, replace its placeholder paths/values, and validate it against the v1 schema.

## Review-only phase

```sh
export APP_CONFIG=/absolute/path/to/math-facts.production.json
export AWS_PROFILE=personal-admin
npm install
npm run check
npx cdk synth --strict
npx cdk diff
```

Review the generated CloudFormation change set against the v1 resource boundary. Stop if the diff introduces a VPC, NAT gateway, load balancer, provisioned concurrency, or an unapproved service.

## Approval and deploy phase

Create a change record containing the exact config revision, synthesized template, diff, predicted recurring costs, rollback plan, and approver. Only after explicit approval, bootstrap the target account if needed and deploy with standard CloudFormation rollback enabled. Never use CDK hotswap or express deployment for production.

## Rollback

For code/config errors, deploy the prior reviewed application/foundation release. Do not delete the S3 bucket or DynamoDB table as a rollback mechanism; both are retained deliberately. Record any CloudFront cache invalidation performed during a rollback.
