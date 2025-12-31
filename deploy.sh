#!/bin/bash

# Build script for S3/CloudFront deployment
# Usage: ./deploy.sh [bucket-name] [cloudfront-distribution-id]

set -e

echo "Building React application..."
npm run build

if [ -z "$1" ]; then
    echo "Error: S3 bucket name is required"
    echo "Usage: ./deploy.sh <bucket-name> [cloudfront-distribution-id]"
    exit 1
fi

BUCKET_NAME=$1
DISTRIBUTION_ID=$2

echo "Uploading to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ s3://$BUCKET_NAME --delete

if [ -n "$DISTRIBUTION_ID" ]; then
    echo "Invalidating CloudFront distribution: $DISTRIBUTION_ID"
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo "Deployment complete!"

