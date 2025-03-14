# Tests Structure

This directory contains all test-related files for the project.

## Directory Structure

```
tests/
├── unit/           # Unit tests (Vitest)
│   ├── setup.ts    # Unit tests setup
│   └── *.test.tsx  # Unit test files
├── e2e/            # End-to-end tests (Playwright)
│   └── *.spec.ts   # E2E test files
└── README.md       # This file
```

## Test Types

### Unit Tests

- Located in `unit/`
- Uses Vitest and Testing Library
- Run with `pnpm test` or `pnpm test:watch`
- Coverage reports in `coverage/unit/`

### E2E Tests

- Located in `e2e/`
- Uses Playwright
- Run with `pnpm test:e2e`
- Results in `test-results/e2e/`
- UI mode available with `pnpm test:e2e:ui`

## Configuration Files

- Unit Tests: `vite.config.ts`
- E2E Tests: `playwright.config.ts`

## Best Practices

1. Keep test files close to their implementation
2. Use `.test.tsx` for unit tests
3. Use `.spec.ts` for E2E tests
4. Write meaningful test descriptions
5. Follow AAA pattern (Arrange, Act, Assert)

# Tests Structure

Ce dossier contient tous les tests du projet, organisés par type :

## Types de Tests

### Tests Unitaires (`/unit`)

- Tests individuels des composants et fonctions
- Extension : `.test.tsx`
- Utilise : Vitest + Testing Library
- Focus : Comportement isolé des composants

### Tests d'Intégration (`/integration`)

- Tests des interactions entre composants
- Extension : `.integration.test.tsx`
- Utilise : Vitest + Testing Library + MSW (pour le mock des API)
- Focus : Flux complets et interactions entre composants
- Exemples de cas :
  - Formulaires complexes
  - Flux de navigation
  - Interactions avec le state global
  - Intégration avec les API (mockées)

### Tests E2E (`/e2e`)

- Tests de bout en bout
- Extension : `.spec.ts`
- Utilise : Playwright
- Focus : Parcours utilisateur complets

## Configuration

### Tests Unitaires et d'Intégration

```bash
pnpm test
```

```bash
pnpm test:watch
```

```bash
pnpm test:coverage
```

### Tests E2E

```bash
pnpm test:e2e
```

```bash
pnpm test:e2e:ui
```

## Bonnes Pratiques

### Tests Unitaires

- Un test par comportement
- Isolation maximale
- Mocks pour les dépendances

### Tests d'Intégration

- Tests des flux complets
- Utilisation de MSW pour mocker les API
- Focus sur les interactions utilisateur
- Vérification des états intermédiaires

### Tests E2E

- Scénarios utilisateur complets
- Tests sur plusieurs pages
- Vérification des redirections
- Tests des flux critiques

## Structure des Fichiers de Test

```
tests/
├── unit/               # Tests unitaires
│   ├── components/    # Tests des composants
│   ├── hooks/        # Tests des hooks
│   └── utils/        # Tests des utilitaires
├── integration/       # Tests d'intégration
│   ├── flows/        # Tests des flux complets
│   └── features/     # Tests des fonctionnalités
└── e2e/              # Tests end-to-end
    └── specs/        # Spécifications E2E
```

## Outils et Dépendances

- **Vitest** : Framework de test
- **Testing Library** : Utilitaires de test React
- **MSW** : Mock des appels API
- **Playwright** : Tests E2E
- **jest-dom** : Assertions DOM supplémentaires
