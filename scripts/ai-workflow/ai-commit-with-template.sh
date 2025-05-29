#!/bin/bash

# AI Commit Script: Use a file containing the commit message (title + optional body)
# Usage: ./scripts/ai-workflow/ai-commit-with-template.sh <commit_message_file>

set -e

if [ $# -ne 1 ]; then
  echo "Usage: $0 <commit_message_file>"
  exit 1
fi

COMMIT_MSG_FILE="$1"

if [ ! -f "$COMMIT_MSG_FILE" ]; then
  echo "Error: Commit message file '$COMMIT_MSG_FILE' does not exist."
  exit 2
fi

# Validate commit message with commitlint before committing
npx commitlint --edit "$COMMIT_MSG_FILE"
if [ $? -ne 0 ]; then
  echo "❌ Commit message does not meet commitlint rules. Aborting commit."
  exit 1
fi

# Commit using the provided message file
git commit -F "$COMMIT_MSG_FILE"

# Clean up the file
rm "$COMMIT_MSG_FILE"
