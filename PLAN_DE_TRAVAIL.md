# Plan de travail pour demain

## 1. Correction de la logique changeset/SHA dans l’extension

- Implémenter une détection basée sur le SHA du commit de création du changeset pour chaque package (ex: starter)
- À chaque nouveau commit, comparer le SHA du dernier commit modifiant le package avec celui du changeset pending
- Si un nouveau commit impacte le package après le changeset, afficher un warning :
  - "Le package X a été modifié après la création du dernier changeset pending. Veuillez mettre à jour le changeset existant ou en créer un nouveau avec le type de bump approprié (major, minor, patch)."
- Ne jamais deviner le type de bump automatiquement, laisser le choix à l’utilisateur

## 2. Correction des erreurs de type-check dans le package CLI

- Lancer pnpm validate:full pour détecter les erreurs de type-check sur le package CLI
- Corriger toutes les erreurs TypeScript détectées

## 3. Publication de la branche

- Publier la branche sur `dev` pour validation
- Puis merger sur `main` pour mettre à jour le projet principal

## 4. Refactorisation de l’extension pour la gestion multi-packages

- Adapter la logique de l’extension pour détecter et gérer les changesets et bumps sur tous les packages du monorepo (pas seulement CLI et starter)
- Permettre à l’utilisateur de choisir le type de bump (major, minor, patch) pour chaque package impacté
- Afficher un état/warning pour chaque package concerné si des commits sont ajoutés après un changeset pending
- Faciliter la création, la mise à jour ou la fusion de changesets pour plusieurs packages en une seule opération

---

**Priorité :**

1. Sécuriser la logique changeset/SHA pour éviter les oublis de bump
2. Corriger les erreurs de type dans le CLI
3. Publier et synchroniser la branche
