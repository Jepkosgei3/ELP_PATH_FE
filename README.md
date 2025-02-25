# Deploying Frontend to Amazon ECS using GitHub Actions

## Overview
This repository contains a GitHub Actions workflow to automate the deployment of the frontend application to Amazon ECS (Elastic Container Service). The workflow builds the frontend Docker image, pushes it to Amazon ECR (Elastic Container Registry), and triggers a new deployment in ECS.

## Prerequisites
Before running this workflow, ensure you have the following:
- An **Amazon ECS Cluster** with a service configured for the frontend.
- An **Amazon ECR repository** for storing the frontend Docker image.
- AWS credentials stored as GitHub secrets.
- Docker installed locally for testing (optional).

## AWS Resources Used
- **Amazon ECS (Fargate/EC2)** for container orchestration.
- **Amazon ECR** for storing container images.
- **AWS IAM** for permissions and authentication.
- **AWS CLI** for managing services.

## Setting up GitHub Secrets
Add the following secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID` - AWS access key ID.
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key.
- `FRONTEND_REPO_URI` - Amazon ECR repository URI for the frontend.

## GitHub Actions Workflow
This workflow is triggered on a push to the `main` branch. It performs the following steps:
1. **Checkout Code**: Retrieves the latest code from the repository.
2. **Configure AWS Credentials**: Authenticates AWS using GitHub Secrets.
3. **Login to Amazon ECR**: Authenticates with ECR to push the image.
4. **Build and Push Docker Image**: Builds and pushes the frontend image to ECR.
5. **Deploy ECS Service Update**: Forces a new deployment in ECS.

## Workflow YAML File
```yaml
name: Deploy to Amazon ECS

on:
  push:
    branches: [ "main" ]

env:
  AWS_REGION: us-west-2                   # AWS region

permissions:
  contents: read

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: elpfe
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and Push Frontend
        run: |
          docker build -t angular-app .
          docker tag angular-app:latest ${{ secrets.FRONTEND_REPO_URI }}:latest
          docker push ${{ secrets.FRONTEND_REPO_URI }}:latest

      - name: Update ECS Service with New Images
        run: |
          aws ecs update-service \
          --cluster my-cluster \
          --service frontend-service \
          --force-new-deployment
```

## Running the Workflow
Once the GitHub Actions workflow is set up, every push to the `main` branch will trigger a deployment. Monitor the workflow under **GitHub Actions** in your repository.

## Verification
After deployment, verify that the new frontend version is running:
1. Check the ECS service logs in the AWS Console.
2. Ensure the frontend is accessible via the configured load balancer or service endpoint.

## Troubleshooting
- If the deployment fails, check the GitHub Actions logs for errors.
- Ensure the ECS service and task definitions are correctly configured.
- Verify that the ECR repository URI is correct.

## Conclusion
This GitHub Actions workflow automates the process of deploying the frontend application to ECS, reducing manual effort and ensuring smooth updates.

