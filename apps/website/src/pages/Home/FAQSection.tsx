import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'What is Vite PowerFlow and who is it for?',
    answer:
      "Vite PowerFlow is a production-ready React starter that solves the harmony problem between development tools. It's perfect for solo developers tired of setup hell, small teams wanting a solid foundation, and large teams needing consistent environments for all developers.",
  },
  {
    question: "How does Vite PowerFlow solve the 'works on my machine' problem?",
    answer:
      "Through Dev Containers that provide identical environments across all machines. Whether you're solo or in a team of 50, everyone gets the exact same Node version, dependencies, and system tools. New team members go from clone to productive coding in 10 minutes.",
  },
  {
    question: 'Can I customize the configuration or am I locked in?',
    answer:
      "Zero lock-in! Don't like our TypeScript config? Replace it. Prefer Jest over Vitest? Swap it out. Want different linting rules? Modify them. The foundation stays solid, but every choice is yours to change. It's MIT licensed and fully transparent.",
  },
  {
    question: "What's included in the starter template?",
    answer:
      'React 18 + TypeScript with strict config, Vite build system, Tailwind CSS + shadcn/ui, complete testing stack (Vitest + Playwright), ESLint + Prettier + Husky working in harmony, Dev Containers, GitHub Actions CI/CD, Storybook, and AI development rules for Cursor.',
  },
  {
    question: 'Do I need Docker experience to use Dev Containers?',
    answer:
      "Not at all! The Dev Container setup is completely automated. Just run the command, accept 'Reopen in Container' when prompted, and everything installs automatically. The container builds with the exact Node version, dependencies, and development tools you need.",
  },
  {
    question: 'How does Vite PowerFlow ensure code quality?',
    answer:
      'Built-in testing, linting, and formatting run automatically. Pre-commit hooks catch issues before they reach your repository, so you always ship clean, tested code. Our validation scripts ensure consistency between local development and production environments.',
  },
];

export function FAQSection() {
  return (
    <section className="relative py-20" id="faq">
      <div className="container mx-auto max-w-screen-xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 flex items-center justify-center gap-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg font-medium max-w-2xl mx-auto text-gray-500 dark:text-white">
            Everything you need to know about Vite PowerFlow and how it streamlines your project
            setup
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-white dark:bg-gray-800/50 hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg py-4 hover:no-underline font-bold cursor-pointer text-gray-700 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="dark:text-white pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
