import ReactMarkdown from 'react-markdown';

import homepageMd from '../../content/homepage.md?raw';

export function EditableSection() {
  // Remove frontmatter if present
  const content = homepageMd.replace(/^---[\s\S]*?---\s*/, '').trim();

  return (
    <section className="my-8 p-4 border rounded bg-white/80 dark:bg-black/40 shadow">
      <ReactMarkdown>{content}</ReactMarkdown>
    </section>
  );
}
