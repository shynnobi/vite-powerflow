#!/usr/bin/env python3
import subprocess
import sys
import os


def get_commit_message(sha):
    result = subprocess.run([
        "git", "log", "--format=%s", "-n", "1", sha
    ], capture_output=True, text=True, check=True)
    return result.stdout.strip()

def update_commit_message(sha, new_message):
    filter_branch_cmd = f'''
    git filter-branch -f --msg-filter '
    if [ "$GIT_COMMIT" = "{sha}" ]; then
      echo "{new_message}"
    else
      cat
    fi
    ' -- --all
    '''
    return subprocess.call(filter_branch_cmd, shell=True)

def verify_commit_message(new_message):
    # Check that the new message is present in the history
    result = subprocess.run([
        "git", "log", "--format=%s", "--all"
    ], capture_output=True, text=True, check=True)
    return new_message in result.stdout

def find_new_commit_hash(new_message):
    # Find the new hash for the commit with the updated message
    result = subprocess.run([
        "git", "log", "--format=%h %s", "--all"
    ], capture_output=True, text=True, check=True)
    for line in result.stdout.splitlines():
        parts = line.split(' ', 1)
        if len(parts) == 2 and parts[1] == new_message:
            return parts[0]
    return None

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 interactive_commit_rewrite.py <commit-sha>")
        sys.exit(1)
    sha = sys.argv[1]
    old_message = get_commit_message(sha)
    print(f"Commit {sha} message:\n{old_message}\n")
    if len(old_message) <= 72:
        print("This commit message does not exceed 72 characters. No change needed.")
        sys.exit(0)
    print(f"Current message length: {len(old_message)} (> 72)")
    new_message = input("Enter a new commit message (<= 72 chars): ").strip()
    while len(new_message) > 72 or not new_message:
        print("Message must be 72 characters or less and not empty.")
        new_message = input("Enter a new commit message (<= 72 chars): ").strip()
    print(f"\nApplying change with git filter-branch...")
    ret = update_commit_message(sha, new_message)
    if ret != 0:
        print("Error: git filter-branch failed.")
        sys.exit(1)
    print("\nVerifying new commit message in history...")
    new_hash = find_new_commit_hash(new_message)
    if new_hash:
        print(f"Success! Commit message updated.")
        print(f"New message: {new_message}")
        print(f"New commit hash: {new_hash}")
        print("\nTo update the remote branch, run:")
        print("  git push --force-with-lease")
        print(f"\nUse this new hash for the next modification if needed.")
    else:
        print("Error: New commit message not found in history. Please check manually.")

if __name__ == "__main__":
    main()
