import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/badge';
import { H3 } from '@/components/ui/heading';

function FeatureCard({
  title,
  desc,
  icon,
  tags,
  colorVariant,
}: {
  title: string;
  desc: string;
  icon: ReactElement;
  tags: string[];
  colorVariant: 'primary' | 'rose' | 'orange' | 'green' | 'purple' | 'turquoise';
}) {
  return (
    <div className="bg-white dark:bg-gray-800/50 text-card-foreground pb-6 px-6 border rounded-2xl transition-transform transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center cursor-pointer group">
      <div className="flex items-center justify-center w-16 h-16 relative bottom-4 transition-transform duration-300 ease-out group-hover:scale-110">
        {icon}
      </div>
      <H3 className="text-xl font-heading mb-3 text-gray-700 dark:text-white">{title}</H3>
      <p className="text-muted-foreground font-medium text-sm leading-relaxed flex-1 mb-4">
        {desc}
      </p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {tags.map((tag, index) => (
          <Badge key={index} variant={colorVariant}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Core Stack',
    desc: 'React 19 + Vite + TypeScript perfectly integrated with strict linting and path aliases configured',
    image: '/images/3d-icons/3dicons-rocket-dynamic-color.png',
    alt: 'Core Stack',
    tags: ['React 19', 'TypeScript', 'Vite'],
    colorVariant: 'primary' as const,
  },
  {
    title: 'UI & Styling',
    desc: 'UI development with Tailwind CSS, shadcn/ui components, and Storybook for isolated testing',
    image: '/images/3d-icons/3dicons-color-palette-dynamic-color.png',
    alt: 'UI & Styling',
    tags: ['Tailwind CSS', 'shadcn/ui', 'Storybook'],
    colorVariant: 'rose' as const,
  },
  {
    title: 'State & Data',
    desc: 'Efficient state management with Zustand and powerful data fetching with TanStack Query',
    image: '/images/3d-icons/3dicons-folder-dynamic-color.png',
    alt: 'State & Data',
    tags: ['Zustand', 'TanStack Query', 'React Hook Form'],
    colorVariant: 'orange' as const,
  },
  {
    title: 'Testing & Quality',
    desc: 'Comprehensive testing with Vitest and Playwright, plus automated code quality with ESLint and Prettier',
    image: '/images/3d-icons/3dicons-lab-dynamic-color.png',
    alt: 'Testing & Quality',
    tags: ['Vitest', 'Playwright', 'ESLint'],
    colorVariant: 'green' as const,
  },
  {
    title: 'Development Workflow',
    desc: 'Streamlined Git workflow with automated hooks, conventional commits, and seamless CI/CD pipelines',
    image: '/images/3d-icons/3dicons-setting-dynamic-color.png',
    alt: 'Development Workflow',
    tags: ['GitHub Actions', 'Husky', 'Commitlint'],
    colorVariant: 'purple' as const,
  },
  {
    title: 'Containerized Dev',
    desc: 'Containerized development ensuring "works on my machine" works everywhere',
    image: '/images/3d-icons/3dicons-cube-dynamic-color.png',
    alt: 'Containerized Dev',
    tags: ['Dev Containers', 'Docker', 'VS Code Settings'],
    colorVariant: 'turquoise' as const,
  },
];
export function FeaturesSection() {
  return (
    <section className="relative py-20" id="features">
      <div className="container mx-auto max-w-screen-xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              desc={feature.desc}
              icon={<img src={feature.image} alt={feature.alt} />}
              tags={feature.tags}
              colorVariant={feature.colorVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
