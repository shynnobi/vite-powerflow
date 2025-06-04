#!/usr/bin/env python3
import subprocess
import sys
import re

def get_commits_with_skip_ci():
    """Get all commits that have [skip ci] in their title."""
    log_cmd = [
        'git', 'log', '--pretty=format:%H|%s', '--no-merges',
        '--invert-grep', '--grep=dependabot'
    ]
    log_output = subprocess.check_output(log_cmd, text=True)

    skipci_commits = []
    for line in log_output.splitlines():
        sha, title = line.split('|', 1)
        if '[skip ci]' in title or '[ci skip]' in title:
            skipci_commits.append((sha, title))

    return skipci_commits

def remove_skip_ci_tag(title):
    """Remove [skip ci] or [ci skip] from the title and clean up spaces."""
    return title.replace('[skip ci]', '').replace('[ci skip]', '').strip()

def rewrite_commit(commit_hash, new_message):
    """Rewrite a single commit with a new message."""
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
    print("🔍 Scanning for commits with [skip ci] in their titles...")
    commits = get_commits_with_skip_ci()

    if not commits:
        print("✅ No commits found with [skip ci] in their titles.")
        return

    print(f"\n📝 Found {len(commits)} commits to process:")
    for i, (sha, title) in enumerate(commits, 1):
        new_title = remove_skip_ci_tag(title)
        print(f"\n{i}. Processing commit {sha[:8]}:")
        print(f"   Old: {title}")
        print(f"   New: {new_title}")

    print("\n🔄 Starting batch rewrite of commits...")
    for sha, title in commits:
        new_title = remove_skip_ci_tag(title)
        try:
            rewrite_commit(sha, new_title)
            print(f"✅ Rewrote commit {sha[:8]}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error rewriting commit {sha[:8]}: {e}")
            sys.exit(1)

    print("\n🚀 All commits have been rewritten!")
    print("\n⚠️  Don't forget to force push your changes:")
    print("   git push --force-with-lease")

if __name__ == "__main__":
    main()
