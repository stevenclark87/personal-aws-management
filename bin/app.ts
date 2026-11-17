#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { StaticApiGameStack, type StaticApiGameConfig } from "../lib/static-api-game.js";

const configPath = process.env.APP_CONFIG;
if (!configPath) {
  throw new Error("Set APP_CONFIG to a reviewed static-api-game/v1 JSON configuration file.");
}

const config = JSON.parse(readFileSync(resolve(configPath), "utf8")) as StaticApiGameConfig;
if (config.contractVersion !== "1.0.0") {
  throw new Error(`Unsupported foundation contract: ${config.contractVersion}`);
}

const app = new cdk.App();
new StaticApiGameStack(app, `${config.app.slug}-${config.app.environment}`, {
  config,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: config.app.region
  },
  description: "Static API Game Foundation v1. Deploy only after an approved change record."
});
