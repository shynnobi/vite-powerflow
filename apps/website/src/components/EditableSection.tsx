import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function EditableSection() {
  const [body, setBody] = useState('');

  useEffect(() => {
    fetch('/content/homepage.md')
      .then(res => res.text())
      .then(md => {
        // Simple frontmatter removal (compatible browser)
        const content = md.replace(/^---[\s\S]*?---\s*/, '');
        setBody(content.trim());
      });
  }, []);

  return (
    <section className="my-8 p-4 border rounded bg-white/80 dark:bg-black/40 shadow">
      <ReactMarkdown>{body}</ReactMarkdown>
    </section>
  );
}
