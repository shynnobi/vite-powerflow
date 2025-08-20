import type { ReactElement } from 'react';

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: ReactElement }) {
  return (
    <div className="bg-card text-card-foreground py-8 px-6 border rounded-2xl transition-transform transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center h-64">
      <div className="flex items-center justify-center w-16 h-16 mb-6">{icon}</div>
      <h3 className="text-xl font-heading font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground font-medium text-sm leading-relaxed flex-1">{desc}</p>
    </div>
  );
}

const features = [
  {
    title: 'Core Stack',
    desc: 'Modern React stack with Vite for lightning-fast builds and TypeScript for type safety',
    image: '/images/3dicons-rocket-dynamic-color.png',
    alt: 'Core Stack',
  },
  {
    title: 'UI & Styling',
    desc: 'Professional UI development with Tailwind CSS, shadcn/ui components, and Storybook for isolated testing',
    image: '/images/3dicons-color-palette-dynamic-color.png',
    alt: 'UI & Styling',
  },
  {
    title: 'State & Data',
    desc: 'Efficient state management with Zustand and powerful data fetching with TanStack Query',
    image: '/images/3dicons-folder-dynamic-color.png',
    alt: 'State & Data',
  },
  {
    title: 'Testing & Quality',
    desc: 'Comprehensive testing with Vitest and Playwright, plus automated code quality with ESLint and Prettier',
    image: '/images/3dicons-lab-dynamic-color.png',
    alt: 'Testing & Quality',
  },
  {
    title: 'Development Workflow',
    desc: 'Streamlined Git workflow with automated hooks, conventional commits, and seamless CI/CD pipelines',
    image: '/images/3dicons-setting-dynamic-color.png',
    alt: 'Development Workflow',
  },
  {
    title: 'Containerized Dev',
    desc: 'Fully containerized development environment ensuring identical setups across all machines and operating systems',

    image: '/images/3dicons-cube-dynamic-color.png',
    alt: 'Containerized Dev',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-20" id="features">
      <div className="container mx-auto max-w-screen-xl px-6">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to start</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Packed with features to boost your productivity and ensure code quality.
          </p>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              desc={feature.desc}
              icon={<img src={feature.image} alt={feature.alt} className="w-16 h-16" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
