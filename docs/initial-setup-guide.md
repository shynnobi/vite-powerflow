# Guide d'Installation Initiale & Intégration GitHub

Ce guide vous accompagne à travers les étapes de configuration initiale essentielles pour exploiter pleinement les fonctionnalités d'automatisation et d'intégration du starter Vite PowerFlow. Cela inclut les GitHub Actions, Dependabot, et le développement assisté par IA avec GitHub CLI.

## 1. Token d'Accès Personnel (PAT) GitHub

Plusieurs fonctionnalités nécessitent un Token d'Accès Personnel (PAT) GitHub pour interagir avec vos dépôts. Vous devrez configurer ce token à deux endroits : localement pour votre environnement de développement, et comme secret de dépôt pour les GitHub Actions.

### A. Création d'un PAT GitHub

1.  Allez dans vos [Paramètres développeur GitHub](https://github.com/settings/tokens?type=beta).
2.  Cliquez sur "Fine-grained tokens" puis "Generate new token".
3.  **Nom du token :** Donnez un nom descriptif à votre token (par ex., `vite-powerflow-dev`).
4.  **Expiration :** Choisissez une période d'expiration appropriée.
5.  **Accès au dépôt :**
    - Sélectionnez "Only select repositories" et choisissez le dépôt où vous utiliserez ce starter (ou votre projet nouvellement généré).
    - Si vous prévoyez d'utiliser ce token pour plusieurs projets basés sur ce starter, vous pouvez sélectionner les dépôts concernés ou tous les dépôts actuels et futurs (à utiliser avec prudence).
6.  **Permissions :** Sous "Repository permissions," accordez les scopes suivants :
    - **Actions :** Read and write (pour permettre aux workflows de s'exécuter, potentiellement d'approuver des PRs si configuré).
    - **Contents :** Read and write (pour les opérations CLI, la soumission de modifications).
    - **Issues :** Read and write (si vos workflows ou l'utilisation du CLI interagissent avec les issues).
    - **Metadata :** Read-only (standard, généralement par défaut).
    - **Pull requests :** Read and write (pour créer/fusionner des PRs via CLI ou workflows).
    - **Workflows :** Read and write (pour permettre au CLI de déclencher des workflows ou pour les commandes `gh workflow`).
    - _(Optionnel, pour une fonctionnalité IA/CLI complète incluant les gists)_ **Gists :** Read and write (si vous utilisez `gh gist` ou des fonctionnalités IA qui exploitent les gists).
    - _(Optionnel, pour l'accès à l'organisation si requis par l'IA/CLI)_ **Administration (Organisation) :** `read:org` si vos dépôts sont au sein d'une organisation et que le CLI/IA a besoin de lister des équipes ou des détails de l'organisation. Soyez prudent avec les permissions d'écriture ici.
7.  Cliquez sur "Generate token".
8.  **Important :** Copiez le token immédiatement. Vous ne pourrez plus le voir par la suite.

### B. `GH_TOKEN` Local pour l'Environnement de Développement (CLI & Outils IA)

Ce token permet aux outils comme GitHub CLI (`gh`) et aux assistants IA (comme Cursor) dans votre environnement local ou dev container d'interagir avec GitHub en votre nom.

**Méthode Recommandée : Authentification GitHub CLI**

La manière la plus simple est d'authentifier le GitHub CLI, qui stockera votre token de manière sécurisée :

1.  Installez GitHub CLI si ce n'est pas déjà fait : [https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)
2.  Exécutez : `gh auth login`
3.  Choisissez `GitHub.com` ou `GitHub Enterprise Server`.
4.  Préférez `HTTPS` comme protocole.
5.  Quand il vous est demandé "Authenticate Git with your GitHub credentials?", répondez `Y` (oui).
6.  Quand il vous est demandé "How would you like to authenticate?", choisissez "Paste an authentication token".
7.  Collez le PAT que vous avez créé à l'étape A.

Cela configurera `gh` et rendra souvent le token disponible pour d'autres outils qui s'intègrent avec lui.

**Alternative : Variable d'Environnement (Moins sécurisé pour les systèmes partagés)**

Vous pouvez le définir comme une variable d'environnement nommée `GH_TOKEN`:

```bash
# Exemple pour .zshrc ou .bashrc
export GH_TOKEN="VOTRE_PAT_ICI"
```

Rechargez votre shell (`source ~/.zshrc` ou `source ~/.bashrc`).

**Dev Container :** Si vous utilisez le Dev Container fourni, assurez-vous que votre `GH_TOKEN` local (de préférence défini via `gh auth login`) est accessible à l'intérieur du conteneur. Le `devcontainer.json` pourrait être configuré pour le transmettre, ou vous pourriez avoir besoin d'exécuter `gh auth login` une fois dans le terminal du conteneur.

### C. Secret `GH_TOKEN` du Dépôt pour GitHub Actions & Dependabot

Ce secret est utilisé par les workflows GitHub Actions (par ex., pour le CI, CD, auto-merge de Dependabot) pour effectuer des actions sur votre dépôt.

1.  Allez sur votre dépôt GitHub.
2.  Cliquez sur "Settings" > "Secrets and variables" > "Actions".
3.  Cliquez sur "New repository secret".
4.  **Nom :** `GH_TOKEN`
5.  **Secret :** Collez le PAT que vous avez créé à l'étape A (ou un différent avec les scopes nécessaires, principalement `repo` et `workflow`).
6.  Cliquez sur "Add secret".

## 2. Permissions des Workflows GitHub Actions

Pour les workflows, en particulier ceux qui modifient le contenu du dépôt, créent des PRs, ou les fusionnent (comme l'auto-merge de Dependabot), les GitHub Actions nécessitent des permissions appropriées.

1.  Allez sur votre dépôt GitHub.
2.  Cliquez sur "Settings" > "Actions" > "General".
3.  Sous "Workflow permissions":

    - **Recommandé pour la plupart des scénarios :** Sélectionnez "Read and write permissions". Cela permet aux actions de créer des branches, de commiter du code, de créer/fusionner des PRs, etc.
    - **Plus restrictif (avancé) :** Vous pouvez choisir "Read repository contents permission" et ensuite définir les permissions par workflow dans chaque fichier YAML de workflow si vous avez besoin d'un contrôle plus fin. Les workflows de ce starter sont généralement conçus en supposant des permissions de lecture/écriture au niveau du dépôt.

    Assurez-vous que "Allow GitHub Actions to create and approve pull requests" est coché si vous voulez que les workflows (comme l'auto-merge de Dependabot ou les "release drafters") puissent le faire.

## 3. Configuration de Dependabot (Révision)

Le fichier `dependabot.yml` dans `.github/` est pré-configuré pour aider à maintenir vos dépendances à jour.

- Il cible la branche `dev` par défaut (assurez-vous que cela correspond à votre branche de développement principale).
- Pour que l'auto-merge fonctionne, le secret `GH_TOKEN` (Section 1C) doit être configuré, et les permissions des workflows (Section 2) doivent autoriser la fusion.

Revoyez `/.github/dependabot.yml` et assurez-vous que `target-branch` et les autres paramètres correspondent à la stratégie de branchement de votre projet.

---

Ce guide devrait fournir une base solide pour l'automatisation de votre projet. Pour des détails plus spécifiques sur l'intégration de l'IA ou les Workflows GitHub, veuillez vous référer à :

- [`docs/ai-github-integration.md`](./ai-github-integration.md)
- [`docs/github-workflows.md`](./github-workflows.md)
