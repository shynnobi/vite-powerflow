#!/usr/bin/env python3
import subprocess
import sys
import os
import re

def get_full_sha(short_sha):
    result = subprocess.run([
        "git", "rev-parse", short_sha
    ], capture_output=True, text=True, check=True)
    return result.stdout.strip()

def get_commit_message(commit_hash):
    result = subprocess.run(
        ["git", "log", "-1", "--pretty=format:%s", commit_hash],
        capture_output=True,
        text=True,
        check=True
    )
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

def rewrite_commit(commit_hash, new_message):
    print(f"\nNew commit message will be: {new_message}")

    # Use filter-branch to rewrite the commit, passing the message directly
    filter_cmd = f'''
    if [ "$GIT_COMMIT" = "{commit_hash}" ]; then
        echo "{new_message}"
    else
        cat
    fi
    '''

    subprocess.run(
        ["git", "filter-branch", "-f", "--msg-filter", filter_cmd,
         f"{commit_hash}^..HEAD"],
        check=True
    )

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 interactive_commit_rewrite.py <commit_hash> \"<new message>\"")
        sys.exit(1)

    short_sha = sys.argv[1]
    new_message = sys.argv[2]

    # Get full SHA
    try:
        commit_hash = get_full_sha(short_sha)
        current_message = get_commit_message(commit_hash)
        print(f"Commit {commit_hash} message:")
        print(current_message)
        print(f"\nCurrent message length: {len(current_message)} (> 72)")

        print("\nApplying change with git filter-branch...")
        rewrite_commit(commit_hash, new_message)
        print("\nCommit message updated successfully!")

        # Push changes
        print("\nPushing changes with --force-with-lease...")
        subprocess.run(["git", "push", "--force-with-lease"], check=True)
        print("\nChanges pushed successfully!")

    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
