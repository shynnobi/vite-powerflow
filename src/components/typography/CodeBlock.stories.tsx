import { CodeBlock } from './CodeBlock';

export default {
  title: 'Typography/CodeBlock',
  component: CodeBlock,
};

export const Default = () => (
  <CodeBlock>{`const greeting = "Hello, World!";\nconsole.log(greeting);`}</CodeBlock>
);
