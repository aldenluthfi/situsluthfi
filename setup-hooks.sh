#!/bin/bash

# Make sure we're in the project root
cd "$(dirname "$0")"

# Create .husky directory if it doesn't exist
mkdir -p .husky

# Make the pre-commit hook executable
chmod +x .husky/pre-commit

echo "✅ Git hooks setup complete!"
echo "ESLint will now run automatically on every commit."
