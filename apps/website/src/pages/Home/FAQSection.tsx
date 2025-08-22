import { Paragraph } from '@/components/typography/Paragraph';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';

const faqData = [
  {
    question: 'What is Vite PowerFlow and who is it for?',
    answer:
      "Vite PowerFlow is a production-ready React starter that solves the harmony problem between development tools. It's perfect for solo developers tired of setup hell, small teams wanting a solid foundation, and large teams needing consistent environments for all developers.",
  },
  {
    question: 'How fast can I get started with Vite PowerFlow?',
    answer:
      "Ridiculously fast! With Docker and VS Code/Cursor installed, run 'npx @vite-powerflow/create my-app' and you'll be coding almost instantly. The Dev Container handles all setup automatically—no more waiting for dependencies to install or fighting with environment issues.",
  },
  {
    question: "How does Vite PowerFlow solve the 'works on my machine' problem?",
    answer:
      "Through Dev Containers that provide identical environments across all machines. Whether you're solo or in a team of 50, everyone gets the exact same Node version, dependencies, and system tools. New team members go from clone to productive coding in no time.",
  },
  {
    question: 'How does Vite PowerFlow ensure code quality?',
    answer:
      'Quality is built-in from day one with ESLint, Prettier, Vitest, and Playwright. Automatic testing, linting, and formatting run on every change. Husky pre-commit and pre-push hooks catch issues locally before they reach your repository, and CI checks validate everything remotely—so you always ship clean, tested code.',
  },
  {
    question: 'What makes Vite PowerFlow special for AI-assisted development?',
    answer:
      'Vite PowerFlow includes pre-configured .cursor/rules that enhance AI code assistance in Cursor IDE. These rules help the AI understand your project context, coding standards, and architectural decisions, making AI suggestions more accurate and aligned with best practices.',
  },
  {
    question: 'How do I use and customize the included CI/CD workflows?',
    answer:
      "Vite PowerFlow ships with preconfigured GitHub Actions workflows, Husky hooks, and recommended branch protection rules. Feel free to adapt, modify, or even delete any workflows, hooks, or protections to fit your team's needs. For details and examples, see the documentation: [See CI/CD Workflow Docs](#ci-cd-workflow-docs).",
  },
  {
    question: 'Is Vite PowerFlow suitable for production projects?',
    answer:
      'Absolutely! Vite PowerFlow is designed for production from the ground up. It includes testing, CI/CD setup, deployment configurations, and follows industry best practices. Start coding, ship to production with confidence.',
  },
];

export function FAQSection() {
  return (
    <Container id="faq">
      <div>
        <Heading as="h2" className="mb-6 text-center">
          Frequently Asked Questions 📚
        </Heading>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-5 md:px-6 dark:bg-gray-800/50 bg-white hover:dark:bg-gray-800 transition-colors"
              >
                <AccordionTrigger className="text-left py-3 md:py-4 hover:no-underline cursor-pointer">
                  <Paragraph size="lg" className="font-semibold leading-snug">
                    {faq.question}
                  </Paragraph>
                </AccordionTrigger>
                <AccordionContent className="pb-4 lg:pr-4">
                  <Paragraph>{faq.answer}</Paragraph>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Container>
  );
}
