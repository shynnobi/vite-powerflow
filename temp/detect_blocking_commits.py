#!/usr/bin/env python3
import subprocess

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
    blocking = [line for line in filtered if len(line) > 72]
    return filtered, blocking

def main():
    filtered, blocking = get_blocking_commits()
    for line in blocking:
        print(line)
    print("\n=== Summary ===")
    print(f"Total commits (excluding merges and Dependabot): {len(filtered)}")
    print(f"Blocking commits: {len(blocking)}")

if __name__ == "__main__":
    main()
