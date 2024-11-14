import { ReactElement } from 'react';

interface TagProps {
  text: string;
  onClick?: () => void;
}

const Tag = ({ text, onClick }: TagProps): ReactElement => (
  <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded" onClick={onClick}>
    {text}
  </span>
);

export default Tag;
