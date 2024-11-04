import { ReactElement } from 'react';

const Tag = ({ text }: { text: string }): ReactElement => (
  <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded">{text}</span>
);

export default Tag;
