import { ComponentProps } from 'react';

import { Heading } from './Heading';

export default {
  title: 'Typography/Heading',
  component: Heading,
  argTypes: {
    as: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      defaultValue: 'h1',
      description: 'HTML tag to render (h1-h6). Use for semantic/SEO structure.',
    },
    size: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      description: 'Visual style (font size/line height) to apply, independent of the HTML tag.',
    },
    children: { control: 'text', defaultValue: 'Heading text' },
  },
};

export const Default = (args: ComponentProps<typeof Heading>) => <Heading {...args} />;

Default.args = {
  as: 'h1',
  size: 'h1',
  children: 'Heading 1 (h1)',
};

export const AllSizes = () => (
  <div className="flex flex-col gap-6">
    <Heading as="h1" size="h1">
      h1. Example of a title
    </Heading>

    <Heading as="h2" size="h2">
      h2. Example of a title
    </Heading>

    <Heading as="h3" size="h3">
      h3. Example of a title
    </Heading>

    <Heading as="h4" size="h4">
      h4. Example of a title
    </Heading>

    <Heading as="h5" size="h5">
      h5. Example of a title
    </Heading>

    <Heading as="h6" size="h6">
      h6. Example of a title
    </Heading>
  </div>
);
