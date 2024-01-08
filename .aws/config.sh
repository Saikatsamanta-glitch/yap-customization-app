#!/usr/bin/env bash
export SERVICE_NAME=ed-bg-activities
export CONTAINER_PORT=8181
export DATABASE_NAME=event_discovery
export CPU=0
export MEMORY=10
export AWS_REGION=us-east-1
#export SENTRY_PROJECT_DSN=https://a5467f97b81b4363a4a2b4ca69a1f089@o448370.ingest.sentry.io/6569881
export NPM_VERSION=$(awk -F\" '/"version":/ {print $4}' package.json)
