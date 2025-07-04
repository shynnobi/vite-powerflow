import { ComponentProps } from 'react';

import { List } from './List.js';
import { ListItem } from './ListItem.js';

export default {
  title: 'Typography/List',
  component: List,
  argTypes: {
    type: {
      options: ['unordered', 'ordered'],
      control: { type: 'select' },
      defaultValue: 'unordered',
      description: 'List type: unordered (ul) or ordered (ol)',
    },
  },
};

export const Default = (args: ComponentProps<typeof List>) => (
  <List {...args}>
    <ListItem>First item</ListItem>
    <ListItem>Second item</ListItem>
    <ListItem>Third item</ListItem>
  </List>
);

export const Unordered = () => (
  <List type="unordered">
    <ListItem>First item</ListItem>
    <ListItem>Second item</ListItem>
    <ListItem>Third item</ListItem>
  </List>
);

export const Ordered = () => (
  <List type="ordered">
    <ListItem>First item</ListItem>
    <ListItem>Second item</ListItem>
    <ListItem>Third item</ListItem>
  </List>
);
