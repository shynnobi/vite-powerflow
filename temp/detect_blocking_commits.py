#!/usr/bin/env python3
import subprocess
import os

def is_automated_commit(line: str) -> bool:
    lower = line.lower()
    return (
        'dependabot' in lower or
        line.startswith('Merge ') or
        line.startswith('Revert "Merge') or
        'merge' in lower
    )

def get_blocking_commits():
    result = subprocess.run(
        ["git", "log", "--pretty=format:%h %s"],
        capture_output=True,
        text=True,
        check=True
    )
    lines = result.stdout.splitlines()
    filtered = [line for line in lines if not is_automated_commit(line)]
    blocking = []
    for line in filtered:
        parts = line.split(' ', 1)
        if len(parts) == 2 and len(parts[1]) > 72:
            blocking.append(line)
    return filtered, blocking

def main():
    filtered, blocking = get_blocking_commits()
    for line in blocking:
        print(line)
    print("\n=== Summary ===")
    print(f"Total commits (excluding merges and Dependabot): {len(filtered)}")
    print(f"Blocking commits: {len(blocking)}")

    # Export to file
    os.makedirs('temp', exist_ok=True)
    with open('temp/blocking_commits.txt', 'w') as f:
        for line in blocking:
            f.write(line + '\n')
        f.write(f"\n=== Summary ===\n")
        f.write(f"Total commits (excluding merges and Dependabot): {len(filtered)}\n")
        f.write(f"Blocking commits: {len(blocking)}\n")

if __name__ == "__main__":
    main()
