import type { ReactElement } from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  SiReact,
  SiStorybook,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVitest,
} from 'react-icons/si';

function TechIcon({ icon, name }: { icon: ReactElement; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
      {icon}
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section className="py-20 bg-secondary/50" id="tech-stack">
      <div className="container mx-auto max-w-screen-lg px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Powered by a Modern Tech Stack</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-10 gap-x-6">
          <TechIcon icon={<SiReact size={32} />} name="React" />
          <TechIcon icon={<SiVite size={32} />} name="Vite" />
          <TechIcon icon={<SiTypescript size={32} />} name="TypeScript" />
          <TechIcon icon={<SiTailwindcss size={32} />} name="Tailwind CSS" />
          <TechIcon icon={<SiVitest size={32} />} name="Vitest" />
          <TechIcon icon={<SiStorybook size={32} />} name="Storybook" />
          <TechIcon icon={<FaGithub size={32} />} name="GitHub" />
          <TechIcon icon={<SiVercel size={32} />} name="Vercel" />
        </div>
      </div>
    </section>
  );
}
