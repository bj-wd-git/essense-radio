#!/bin/bash

# Script to push essense image to Docker Hub
# Usage: ./push-to-hub.sh YOUR_DOCKERHUB_USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./push-to-hub.sh YOUR_DOCKERHUB_USERNAME"
    echo "Example: ./push-to-hub.sh myusername"
    exit 1
fi

DOCKERHUB_USERNAME=$1
IMAGE_NAME="essense"
TAG="latest"
REPO_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "=== Pushing ${IMAGE_NAME}:${TAG} to Docker Hub ==="
echo "Repository: ${REPO_NAME}"
echo ""

# Step 1: Login to Docker Hub
echo "Step 1: Logging in to Docker Hub..."
docker login

if [ $? -ne 0 ]; then
    echo "Error: Docker login failed"
    exit 1
fi

# Step 2: Tag the image
echo ""
echo "Step 2: Tagging image..."
docker tag ${IMAGE_NAME}:${TAG} ${REPO_NAME}

if [ $? -ne 0 ]; then
    echo "Error: Failed to tag image"
    exit 1
fi

echo "✓ Image tagged as ${REPO_NAME}"

# Step 3: Push the image
echo ""
echo "Step 3: Pushing image to Docker Hub..."
docker push ${REPO_NAME}

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Successfully pushed ${REPO_NAME} to Docker Hub!"
    echo "You can now pull it with: docker pull ${REPO_NAME}"
else
    echo "Error: Failed to push image"
    exit 1
fi

