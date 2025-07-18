# GPG Tag Signing for Verified Releases on GitHub

This guide explains how to securely generate a GPG key, configure Git, and sign your tags so that they appear as **Verified** on GitHub.

> **Always perform all GPG operations (key generation, configuration, signing) on your local machine, never in a container or shared environment. This is the only secure and supported approach.**

---

## 0. Check if a GPG Key Already Exists (Recommended)

Before generating a new key, check if you already have a GPG key on your local machine:

```sh
gpg --list-secret-keys --keyid-format=long
```

- If you see a key listed for your email, you can use it directly (skip to step 2).
- If not, proceed to generate a new key as described below.

---

## 1. Generate a GPG Key on Your Local Machine (**Recommended**)

1. Open your terminal (on your Mac or main workstation, not in a container).
2. Run:

   ```sh
   gpg --full-generate-key
   ```

   - Choose RSA and RSA (default), 4096 bits, no expiration (or as you prefer).
   - Use the same email as your GitHub account.
   - Set a secure passphrase.

3. List your keys to get the key ID:
   ```sh
   gpg --list-secret-keys --keyid-format=long
   ```

**Never export or transfer your private key unless absolutely necessary.**

---

## 2. Add Your GPG Public Key to GitHub

1. Export your public key:
   ```sh
   gpg --armor --export your@email.com
   ```
2. Copy the output and add it to GitHub:
   - Go to **GitHub > Settings > SSH and GPG keys > New GPG key**
   - Paste your public key and save.

---

## 3. Configure Git to Use Your GPG Key

```sh
git config --global user.signingkey <YOUR_KEY_ID>
```

---

## 4. Sign and Push Tags from Your Local Machine (**Recommended**)

1. Delete old tags locally and on GitHub if needed:
   ```sh
   git tag -d v1.0.0
   git push origin :v1.0.0
   # Repeat for other tags
   ```
2. Recreate and sign tags on the correct commits:
   ```sh
   git tag -s v1.0.0 <sha> -m "v1.0.0"
   # Repeat for other tags
   ```
3. Push the signed tags:
   ```sh
   git push origin v1.0.0 v1.1.0 v1.2.0 v2.0.0
   ```

---

## 5. Troubleshooting

- If you see 'No secret key', your private key is missing on this machine.
- If you see 'Inappropriate ioctl for device', use a native terminal, not an embedded one.
- Always check that your key is added to GitHub and matches your Git config email.

---

**Result:**
All your tags will show the green 'Verified' badge on GitHub!
