# Guide de contribution

Ce projet utilise un workflow de vérification avant commit pour assurer le respect des bonnes pratiques et des conventions de code.

## Prérequis

- Node.js (version 18 ou supérieure)
- Yarn

## Installation

```bash
yarn install
```

## Workflow de développement

### Hooks Git

Ce projet utilise [Husky](https://typicode.github.io/husky/) pour exécuter des hooks Git :

- **pre-commit** : Vérifie le formatage, le linting et les types des fichiers modifiés avec lint-staged
- **commit-msg** : Vérifie que les messages de commit respectent les conventions

### Conventions de commit

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) pour formater les messages de commit. Chaque message de commit doit avoir la structure suivante :

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types de commit autorisés :

- **build** : Changements qui affectent le système de build ou les dépendances externes
- **chore** : Autres changements qui ne modifient pas les fichiers src ou test
- **ci** : Changements dans les fichiers et scripts de configuration CI
- **docs** : Modifications de la documentation uniquement
- **feat** : Ajout d'une nouvelle fonctionnalité
- **fix** : Correction d'un bug
- **perf** : Amélioration des performances
- **refactor** : Modification du code qui ne corrige pas un bug et n'ajoute pas de fonctionnalité
- **revert** : Annulation d'un commit précédent
- **style** : Changements qui n'affectent pas le sens du code (espaces, formatage, etc.)
- **test** : Ajout ou correction de tests

Exemples :

```
feat(auth): ajouter la connexion avec Google
fix(api): corriger le problème de timeout dans les requêtes
docs: mettre à jour la documentation d'installation
```

### Formatage du code

Nous utilisons [Prettier](https://prettier.io/) pour formater le code. Vous pouvez formater manuellement le code avec :

```bash
yarn format
```

### Linting

Nous utilisons [ESLint](https://eslint.org/) pour le linting. Vous pouvez exécuter le linting manuellement avec :

```bash
yarn lint
```

Pour corriger automatiquement les problèmes de linting :

```bash
yarn lint:fix
```

### Vérification des types

Nous utilisons TypeScript pour la vérification des types. Vous pouvez vérifier les types manuellement avec :

```bash
yarn type-check
```

Cette vérification est également exécutée automatiquement avant chaque commit sur les fichiers modifiés.

## CI/CD

Ce projet utilise GitHub Actions pour exécuter les vérifications sur les pull requests et les pushes sur la branche principale. Le workflow vérifie :

1. Le linting et le formatage du code
2. La vérification des types TypeScript
3. Les messages de commit (pour les pull requests)
4. La compilation du projet

Toutes ces vérifications doivent passer pour que la pull request puisse être fusionnée.
