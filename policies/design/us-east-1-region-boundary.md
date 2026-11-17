# `us-east-1` Region-boundary SCP — design only

**Status:** not JSON, not deployable, and not approved for attachment.

The application workload belongs in `us-east-1`, but a Region-deny SCP must preserve the global and cross-Region API calls needed for IAM Identity Center, Organizations, CloudFront, IAM, STS, billing, CloudFormation/SAM deployment, S3 control-plane operations, KMS, and any future approved services.

## Required lab evidence before drafting JSON

1. Inventory every API called during CDK/SAM packaging, CloudFormation deployment, static-file upload, CloudFront invalidation, Auth0 browser login, rollback, and cost review.
2. Derive a `NotAction` exception list only from that evidence and current AWS documentation.
3. Attach the candidate policy to the policy-lab account only.
4. Re-run the full deployment and rollback path there.
5. Document every blocked action and whether it is intentionally blocked or needs an exception.
6. Promote a tagged, immutable policy version only after review.

Never attach an untested Region-deny SCP to the organization root or `Apps-Production`.
