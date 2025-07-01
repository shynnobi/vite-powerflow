import type { ReactElement } from 'react';
import { FiGithub } from 'react-icons/fi';
import {
  ArrowRight,
  Atom,
  BookOpenCheck,
  Box,
  CheckCircle2,
  Code,
  Database,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  GitBranch,
  Paintbrush,
  PlaySquare,
  Rocket,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Users,
  Zap,
} from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TECH_BADGES = [
  { name: 'React', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Vite', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'TypeScript', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { name: 'Vitest', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Playwright', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Storybook', color: 'bg-pink-100 text-pink-700 border-pink-200' },
];

const FEATURE_SECTIONS = [
  {
    title: 'Core Stack',
    description: 'Modern, fast, and type-safe foundation for your app.',
    badge: 'Foundation',
    features: [
      {
        icon: <Atom className="h-5 w-5 text-blue-600" />,
        name: 'React',
        description: 'UI library for building interactive web apps.',
      },
      {
        icon: <Zap className="h-5 w-5 text-blue-600" />,
        name: 'Vite',
        description: 'Lightning-fast build tool with instant HMR and optimized production builds.',
      },
      {
        icon: <FileText className="h-5 w-5 text-blue-600" />,
        name: 'TypeScript',
        description: 'Type-safe JavaScript for better code quality.',
      },
    ],
  },
  {
    title: 'UI & Styling',
    description: 'Rapid UI development with modern, accessible components.',
    badge: 'Design',
    features: [
      {
        icon: <Paintbrush className="h-5 w-5 text-blue-600" />,
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework for rapid UI development.',
      },
      {
        icon: <Box className="h-5 w-5 text-blue-600" />,
        name: 'shadcn/ui',
        description: 'Re-usable components built with Radix UI and Tailwind CSS.',
      },
      {
        icon: <BookOpenCheck className="h-5 w-5 text-blue-600" />,
        name: 'Storybook',
        description: 'Component playground for isolated development and testing.',
      },
    ],
  },
  {
    title: 'State & Data',
    description: 'Efficient state and data handling for scalable apps.',
    badge: 'Data',
    features: [
      {
        icon: <Database className="h-5 w-5 text-blue-600" />,
        name: 'Zustand',
        description: 'Lightweight state management library.',
      },
      {
        icon: <Settings2 className="h-5 w-5 text-blue-600" />,
        name: 'TanStack Query',
        description: 'Powerful data fetching and caching solution.',
      },
    ],
  },
  {
    title: 'Testing & Quality',
    description: 'Robust testing and code quality tools for reliable software.',
    badge: 'Quality',
    features: [
      {
        icon: <FlaskConical className="h-5 w-5 text-blue-600" />,
        name: 'Vitest',
        description: 'Fast unit and integration testing framework.',
      },
      {
        icon: <PlaySquare className="h-5 w-5 text-blue-600" />,
        name: 'Playwright',
        description: 'Modern end-to-end testing tool.',
      },
      {
        icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
        name: 'ESLint & Prettier',
        description: 'Code quality and formatting tools.',
      },
    ],
  },
  {
    title: 'Development Workflow',
    description: 'Automated, collaborative, and standardized development process.',
    badge: 'Workflow',
    features: [
      {
        icon: <GitBranch className="h-5 w-5 text-blue-600" />,
        name: 'Git Hooks',
        description: 'Automated validations with Husky and lint-staged.',
      },
      {
        icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
        name: 'GitHub Actions',
        description: 'Automated CI/CD for seamless integration and deployment.',
      },
    ],
  },
];

const HIGHLIGHTS = [
  {
    icon: <Rocket className="h-6 w-6 text-blue-600" />,
    title: 'Production Ready',
    description: 'Fully containerized with Docker for reproducible development environments.',
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: 'Quality Assured',
    description: 'Comprehensive testing suite with unit, integration, and E2E tests.',
  },
  {
    icon: <Code className="h-6 w-6 text-blue-600" />,
    title: 'AI-Powered',
    description: 'Optimized for Cursor AI with pre-configured rules and best practices.',
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'Team Friendly',
    description: 'Standardized workflows with automated code quality checks.',
  },
];

export default function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6">
        <ThemeToggle />
      </nav>

      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, commodi, voluptates a
          sit porro voluptate corporis quam dicta, provident alias asperiores rerum atque mollitia
          aliquid perspiciatis facere? Tenetur, est dicta?
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative h-full w-full bg-[#a7d3ff]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4096e12e_1px,transparent_1px),linear-gradient(to_bottom,#4096e12e_1px,transparent_1px)] bg-[size:30px_30px] "></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(125%_125%_at_30%_10%,rgba(70,99,255,0)_10%,rgba(50,152,237,1)_100%)]"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <Badge className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-all duration-300">
                <Sparkles className="w-8 h-8 mr-2" />
                React + Vite Starter Template
              </Badge>
            </div>

            <h1 className="mx-auto max-w-4xl font-heading text-5xl font-bold tracking-tight sm:text-7xl mb-6 font-lexend">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                Vite PowerFlow
              </span>
            </h1>

            {/* Tech badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {TECH_BADGES.map(tech => (
                <Badge key={tech.name} className={`${tech.color} border text-sm px-3 rounded-full`}>
                  {tech.name}
                </Badge>
              ))}
            </div>

            <p className="mx-auto max-w-3xl font-body text-lg leading-8 text-blue-950 font-bold sm:text-xl mb-12">
              Kickstart your app with React and Vite—fast setup, easy teamwork, and AI-powered
              features. All the tools you need for clean code, testing, and smooth deployment, ready
              out of the box.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="group bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
              >
                <Download className="mr-2 h-4 w-4" />
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              >
                <FiGithub className="mr-2 h-4 w-4" />
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-6 py-16 bg-gray-50">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(highlight => (
            <Card
              key={highlight.title}
              className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                    {highlight.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 font-lexend">{highlight.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 font-lexend">
            Everything you need to build fast
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A carefully curated collection of tools and libraries to accelerate your development
            workflow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_SECTIONS.map(section => (
            <Card
              key={section.title}
              className="group relative overflow-hidden border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className="mb-4 bg-gray-100 text-gray-700 border-gray-200">
                    {section.badge}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 font-lexend">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                </div>

                <div className="space-y-4">
                  {section.features.map(feature => (
                    <div key={feature.name} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                        {feature.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold leading-none mb-1 text-gray-900">{feature.name}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="mx-auto max-w-4xl px-6 py-24 bg-gray-50">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 font-lexend">Quick Start</h2>
              <p className="text-gray-600">Get up and running in minutes</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-6 rounded-lg bg-blue-50 border border-blue-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0 mt-1">
                  1
                </span>
                <div className="flex-1">
                  <p className="font-medium mb-2 text-gray-900">Generate your app</p>
                  <code className="block rounded-md bg-white px-3 py-2 font-mono text-sm border border-blue-200 text-blue-800">
                    npx create-vite-powerflow my-app
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-lg bg-gray-50 border border-gray-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white text-sm font-bold flex-shrink-0 mt-1">
                  2
                </span>
                <div className="flex-1">
                  <p className="font-medium mb-2 text-gray-900">Open in your editor</p>
                  <p className="text-sm text-gray-600">
                    Reopen in Container when prompted (Dev Container)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-lg bg-blue-50 border border-blue-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0 mt-1">
                  3
                </span>
                <div className="flex-1">
                  <p className="font-medium mb-2 text-gray-900">Start developing</p>
                  <code className="block rounded-md bg-white px-3 py-2 font-mono text-sm border border-blue-200 text-blue-800">
                    pnpm dev
                  </code>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Star className="w-4 h-4 mr-2" />
                Ready to code in minutes!
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI-Powered Development */}
      <section className="mx-auto max-w-7xl px-6 py-24 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 font-lexend">
            AI-Powered Development
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimized for Cursor AI Code Editor with pre-configured rules that enhance AI code
            assistance and generation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 font-lexend">
                <Code className="h-5 w-5 text-blue-600" />
                Pre-configured Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Code standards and conventions</li>
                <li>• Development methodology (TDD, atomic commits)</li>
                <li>• Documentation and versioning guidelines</li>
                <li>• GitHub CLI integration and PR conventions</li>
                <li>• Project architecture principles</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 font-lexend">
                <Terminal className="h-5 w-5 text-blue-600" />
                Enhanced Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Intelligent code suggestions</li>
                <li>• Automated PR descriptions</li>
                <li>• Context-aware refactoring</li>
                <li>• Best practices enforcement</li>
                <li>• Consistent coding patterns</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Built by Shynn · Front-end Developer & 3D Artist</span>
              <a
                href="https://github.com/shynnobi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="GitHub profile"
              >
                <FiGithub className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
            <Separator className="w-24 bg-gray-300" />
            <p className="text-xs text-gray-500 text-center">
              Licensed under MIT License. Open source and free to use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
