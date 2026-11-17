# Standard resource tags

All taggable application resources use these keys:

| Tag | Purpose | Source |
| --- | --- | --- |
| `Application` | Groups a workload's resources and cost | Application identifier |
| `Environment` | Distinguishes lifecycle boundary | Application environment |
| `CostCenter` | Groups portfolio spending | Reviewed platform configuration |
| `ManagedBy` | Identifies the managing repository/workflow | Reviewed platform configuration |

Activate the selected user-defined tags in AWS Billing Cost Allocation Tags before expecting them in Cost Explorer or cost and usage reports. Stack-level tags complement, but do not replace, explicit resource tags because propagation varies by resource type.
