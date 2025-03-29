# Guide d'installation de Storybook pour Vite-PowerFlow

Ce guide détaille les étapes pour configurer Storybook dans un projet basé sur le starter Vite-PowerFlow, en particulier dans un environnement Dev Container.

## Prérequis

- Un projet basé sur Vite-PowerFlow
- VS Code avec l'extension Dev Containers (si vous utilisez le Dev Container)
- Docker installé sur votre machine (si vous utilisez le Dev Container)

## Installation des dépendances

```bash
# Installation des dépendances Storybook
pnpm add -D @storybook/react@^8.6.10 @storybook/react-vite@^8.6.10 @storybook/blocks@^8.6.10
pnpm add -D @storybook/addon-essentials@^8.6.10 @storybook/addon-actions@^8.6.10
pnpm add -D @storybook/addon-onboarding@^8.6.10 @storybook/test@^8.6.10
pnpm add -D @chromatic-com/storybook@^3 @storybook/experimental-addon-test@^8.6.10
pnpm add -D storybook@^8.6.10 eslint-plugin-storybook@^0.12.0
```

## Configuration du dossier `.storybook`

Créez un dossier `.storybook` à la racine du projet et ajoutez les fichiers suivants :

### `main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/experimental-addon-test',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	typescript: {
		reactDocgen: 'react-docgen',
	},
};
export default config;
```

### `preview.tsx`

```typescript
import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
      },
    },
  },
  decorators: [
    Story => (
      <div className="flex items-center justify-center bg-background text-foreground w-full h-full p-4">
        <div className="w-full">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
```

### `vitest.setup.ts`

```typescript
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
```

## Configuration du package.json

Ajoutez ces scripts spécifiques dans votre `package.json` :

```json
"scripts": {
  "storybook:setup": "pnpm exec playwright install --with-deps chromium",
  "storybook:dev": "storybook dev -p 6006",
  "storybook": "pnpm storybook:setup && pnpm storybook:dev",
  "storybook:build": "storybook build",
  "lint:storybook": "eslint \"**/*.stories.@(ts|tsx|js|jsx|mdx)\" \".storybook/**/*\" --ext ts,tsx,js,jsx,cjs,mjs"
}
```

## Configuration d'ESLint pour Storybook

Ajoutez Storybook à votre configuration ESLint (dans `eslint.config.js`) :

```javascript
// Ajoutez ces imports
import storybook from 'eslint-plugin-storybook';

// Ajoutez cette configuration
{
  files: ['**/*.stories.@(ts|tsx|js|jsx|mdx)', '.storybook/**/*'],
  plugins: {
    storybook
  },
  rules: {
    ...storybook.configs.recommended.rules
  }
}
```

## Configuration du Dev Container

### 1. Le fichier `.devcontainer/devcontainer.json`

Assurez-vous que votre fichier `.devcontainer/devcontainer.json` contient les configurations suivantes :

```json
{
	"forwardPorts": [5173, 4000, 6006], // Le port 6006 est pour Storybook
	"postCreateCommand": "if [ -d .husky ]; then git config core.hooksPath .husky && chmod +x .husky/* 2>/dev/null || true; fi && echo '\n📒 To use Storybook:\n   1. Install dependencies: pnpm storybook:setup\n   2. Start Storybook: pnpm storybook:dev\n   Or in one command: pnpm storybook\n'"
}
```

### 2. Script de test pour l'installation de Storybook

Créez un fichier `scripts/test-storybook-setup.sh` pour tester l'installation de Storybook :

```bash
#!/bin/bash
echo "Testing on-demand installation of Storybook"
echo ""
echo "1. Checking if Playwright is already installed..."
if [ -d "/home/node/.cache/ms-playwright" ]; then
  echo "   ⚠️  Playwright is already installed, removing to simulate a new container..."
  rm -rf /home/node/.cache/ms-playwright
fi

echo ""
echo "2. Running installation command..."
echo "   This may take a few minutes..."
time pnpm storybook:setup

echo ""
echo "3. Checking result..."
if [ -d "/home/node/.cache/ms-playwright" ]; then
  echo "   ✅ Installation successful!"
else
  echo "   ❌ Installation failed."
fi

echo ""
echo "To launch Storybook, run: pnpm storybook:dev"
echo "For everything (installation + launch), run: pnpm storybook"
```

N'oubliez pas de rendre ce script exécutable :

```bash
chmod +x scripts/test-storybook-setup.sh
```

## Création d'un exemple de Story

Créez un exemple de fichier Story dans votre projet :

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: { type: 'select' },
			options: ['default', 'sm', 'lg', 'icon'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		children: 'Button',
		variant: 'default',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Button',
		variant: 'secondary',
	},
};
```

## Intégration avec Vitest

Pour tester vos Stories avec Vitest, vous pouvez utiliser le fichier de setup déjà configuré. Dans vos tests :

```typescript
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as stories from './Button.stories';

// Compose all stories
const { Primary } = composeStories(stories);

describe('Button component', () => {
  it('renders primary button', () => {
    render(<Primary />);
    expect(screen.getByText('Button')).toBeInTheDocument();
  });
});
```

## Utilisation de Storybook

### Dans un environnement de développement standard

1. Pour démarrer Storybook :

   ```bash
   pnpm storybook:dev
   ```

2. Pour installer les dépendances et démarrer Storybook en une commande :
   ```bash
   pnpm storybook
   ```

### Dans un Dev Container

1. Ouvrez votre projet dans un Dev Container
2. Une fois le conteneur construit, vous verrez un message vous indiquant comment utiliser Storybook
3. Pour installer les dépendances de Playwright (uniquement nécessaire la première fois) :
   ```bash
   pnpm storybook:setup
   ```
4. Pour démarrer Storybook :
   ```bash
   pnpm storybook:dev
   ```
5. Ou pour tout faire en une commande :
   ```bash
   pnpm storybook
   ```

## Notes importantes

1. **Installation à la demande** : Les dépendances de Playwright ne sont pas installées par défaut lors de la création du conteneur pour économiser de l'espace et du temps.

2. **Port 6006** : Storybook est configuré pour s'exécuter sur le port 6006, qui est déjà configuré dans le fichier `devcontainer.json` pour être transféré à l'hôte.

3. **Architecture** : Le Dev Container de Vite-PowerFlow est configuré pour fonctionner sur différentes architectures (x64 et arm64).

4. **Versionnement** : Les versions spécifiées dans ce guide sont compatibles avec React 19 et les autres dépendances du starter.

5. **Décorateurs** : Le décorateur par défaut est configuré pour fonctionner avec TailwindCSS et shadcn/ui.
