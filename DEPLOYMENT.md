# Deployment Guide - AWS S3 + CloudFront

This guide walks you through deploying the DarkML React frontend to AWS S3 and CloudFront.

## Prerequisites

- AWS CLI installed and configured
- AWS account with appropriate permissions
- Domain name (optional, for Route 53)

## Step 1: Build the Application

```bash
npm install
npm run build
```

This creates a `dist/` directory with production-ready files.

## Step 2: Create S3 Bucket

1. **Create bucket:**
   ```bash
   aws s3 mb s3://darkml-frontend --region us-east-1
   ```

2. **Enable static website hosting:**
   ```bash
   aws s3 website s3://darkml-frontend \
     --index-document index.html \
     --error-document index.html
   ```

3. **Set bucket policy for public read access:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::darkml-frontend/*"
       }
     ]
   }
   ```
   Save as `bucket-policy.json` and apply:
   ```bash
   aws s3api put-bucket-policy --bucket darkml-frontend --policy file://bucket-policy.json
   ```

## Step 3: Upload to S3

```bash
aws s3 sync dist/ s3://darkml-frontend --delete
```

Or use the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh darkml-frontend
```

## Step 4: Create CloudFront Distribution

1. **Via AWS Console:**
   - Go to CloudFront
   - Create Distribution
   - Origin: Select your S3 bucket
   - Default root object: `index.html`
   - Error pages:
     - 404 → `/index.html` (200)
     - 403 → `/index.html` (200)
   - Enable compression
   - Set viewer protocol policy to "Redirect HTTP to HTTPS"

2. **Via AWS CLI:**
   ```bash
   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
   ```

## Step 5: Configure Route 53 (Optional)

1. Create hosted zone for your domain
2. Create alias record:
   - Type: A (or AAAA for IPv6)
   - Alias: Yes
   - Alias target: Your CloudFront distribution
   - Routing policy: Simple

## Step 6: AWS WAF (Optional)

1. Create WAF Web ACL
2. Add rules (SQL injection, XSS, etc.)
3. Associate with CloudFront distribution

## Step 7: Environment Variables

For production, ensure your `.env` file has:
```
VITE_API_BASE_URL=http://3.226.252.253:8000
```

Or set it during build:
```bash
VITE_API_BASE_URL=http://3.226.252.253:8000 npm run build
```

## Continuous Deployment

For CI/CD, you can use GitHub Actions, AWS CodePipeline, or similar:

```yaml
# Example GitHub Actions workflow
name: Deploy to S3
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v1
      - run: aws s3 sync dist/ s3://darkml-frontend --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

## Troubleshooting

### SPA Routing Issues
- Ensure CloudFront error pages are configured (404/403 → index.html)
- Check S3 bucket static website hosting is enabled

### CORS Issues
- Configure CORS on your backend API
- Ensure API base URL is correct in environment variables

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

