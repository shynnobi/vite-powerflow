import { CodeBlock } from './CodeBlock.js';

export default {
  title: 'Typography/CodeBlock',
  component: CodeBlock,
};

export const Default = () => (
  <CodeBlock>{`const greeting = "Hello, World!";\nconsole.log(greeting);`}</CodeBlock>
);
