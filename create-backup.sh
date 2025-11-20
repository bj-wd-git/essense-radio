#!/bin/bash

# Create backup zip with essential files only
BACKUP_NAME="essence-radio-backup-$(date +%Y%m%d-%H%M%S).zip"

echo "📦 Creating project backup: $BACKUP_NAME"

# Create zip excluding common build/dependency folders
zip -r "$BACKUP_NAME" . \
  -x "*.zip" \
  -x "node_modules/*" \
  -x "*/node_modules/*" \
  -x "dist/*" \
  -x "*/dist/*" \
  -x "build/*" \
  -x "*/build/*" \
  -x ".git/*" \
  -x "*.log" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.production" \
  -x "*.pem" \
  -x "*.key" \
  -x ".DS_Store" \
  -x "Thumbs.db" \
  -x ".vscode/*" \
  -x ".idea/*" \
  -x "coverage/*" \
  -x ".nyc_output/*" \
  -x "*.sqlite" \
  -x "*.db" \
  -x ".railway/*" \
  -x ".vercel/*" \
  -x ".fly/*"

echo "✅ Backup created: $BACKUP_NAME"
echo "📊 File size: $(du -h "$BACKUP_NAME" | cut -f1)"

