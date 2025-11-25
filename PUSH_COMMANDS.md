# Push Image to Docker Hub

## Quick Commands (replace YOUR_USERNAME with your Docker Hub username):

```bash
# 1. Login to Docker Hub
docker login

# 2. Tag the image
docker tag essense:latest YOUR_USERNAME/essense:latest

# 3. Push the image
docker push YOUR_USERNAME/essense:latest
```

## Or use the script:

```bash
./push-to-hub.sh YOUR_USERNAME
```

## After pushing, you can pull it anywhere with:

```bash
docker pull YOUR_USERNAME/essense:latest
```

