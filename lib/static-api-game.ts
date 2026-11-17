import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export interface StaticApiGameConfig {
  contractVersion: "1.0.0";
  app: { slug: string; environment: "production"; region: "us-east-1" };
  tags: { costCenter: string; managedBy: string };
  frontend: { distPath: string; allowedOrigins: string[] };
  auth: { issuerUrl: string; audience: string };
  api: { lambdaCodePath: string; lambdaHandler: string };
  data: { progressTableName: string };
}

export interface StaticApiGameStackProps extends cdk.StackProps {
  config: StaticApiGameConfig;
}

/**
 * Contract v1 deliberately keeps the application's steady-state bill and attack
 * surface small. It creates no VPC/NAT, load balancer, provisioned concurrency,
 * or always-on compute. Stateful stores are retained when the stack is removed.
 */
export class StaticApiGameStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: StaticApiGameStackProps) {
    super(scope, id, props);
    const { config } = props;
    cdk.Tags.of(this).add("Application", config.app.slug);
    cdk.Tags.of(this).add("Environment", config.app.environment);
    cdk.Tags.of(this).add("CostCenter", config.tags.costCenter);
    cdk.Tags.of(this).add("ManagedBy", config.tags.managedBy);

    const assets = new s3.Bucket(this, "FrontendAssets", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false
    });

    const progress = new dynamodb.Table(this, "Progress", {
      tableName: `${config.app.slug}-${config.app.environment}-${config.data.progressTableName}`,
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const handler = new lambda.Function(this, "ApiHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset(config.api.lambdaCodePath),
      handler: config.api.lambdaHandler,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: { PROGRESS_TABLE_NAME: progress.tableName }
    });
    progress.grantReadWriteData(handler);

    const api = new apigwv2.HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowOrigins: config.frontend.allowedOrigins,
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowHeaders: ["authorization", "content-type"]
      }
    });
    const jwtAuthorizer = new authorizers.HttpJwtAuthorizer("Auth0Jwt", config.auth.issuerUrl, {
      jwtAudience: [config.auth.audience]
    });
    api.addRoutes({
      path: "/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration("ApiIntegration", handler),
      authorizer: jwtAuthorizer
    });

    const distribution = new cloudfront.Distribution(this, "WebDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(assets),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED
      },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: "/index.html", ttl: cdk.Duration.minutes(1) },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: "/index.html", ttl: cdk.Duration.minutes(1) }
      ]
    });

    new s3deploy.BucketDeployment(this, "DeployFrontend", {
      sources: [s3deploy.Source.asset(config.frontend.distPath)],
      destinationBucket: assets,
      distribution,
      distributionPaths: ["/*"],
      prune: false
    });

    new cdk.CfnOutput(this, "WebsiteUrl", { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
    new cdk.CfnOutput(this, "ProgressTableName", { value: progress.tableName });
  }
}
