# This script lists all commits whose titles contain the '[skip ci]' tag.
# It helps identify commits to rewrite and remove the tag from their titles.

import subprocess

SKIP_CI_TAG = '[skip ci]'

# Get all commit hashes and titles (excluding merges and dependabot)
log_cmd = [
    'git', 'log', '--pretty=format:%H|%s', '--no-merges', '--invert-grep', '--grep=dependabot'
]
log_output = subprocess.check_output(log_cmd, text=True)

skipci_commits = []
total_commits = 0

for line in log_output.splitlines():
    sha, title = line.split('|', 1)
    total_commits += 1
    if SKIP_CI_TAG in title:
        skipci_commits.append((sha, title))

print(f"Total commits (excluding merges and Dependabot): {total_commits}")
print(f"Commits with '[skip ci]' in title: {len(skipci_commits)}")
if skipci_commits:
    print("\nCommits to rewrite (remove [skip ci] from title):")
    for sha, title in skipci_commits:
        print(f"{sha[:7]} {title}")
else:
    print("\nNo commits with [skip ci] in title found!")
