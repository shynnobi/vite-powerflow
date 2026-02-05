import { Blockquote } from './Blockquote.js';

export default {
  title: 'Typography/Blockquote',
  component: Blockquote,
};

export const Default = () => (
  <Blockquote>
    "The best way to predict the future is to invent it."
    <br />— Alan Kay
  </Blockquote>
);
