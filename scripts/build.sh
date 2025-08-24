#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Install dependencies
npm ci

# Build the application
npm run build

# Output success message
echo "Build completed successfully!"