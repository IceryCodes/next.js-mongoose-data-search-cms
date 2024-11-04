import { ReactElement } from 'react';

interface CardProps {
  children: ReactElement;
  className?: string;
}

const Card = ({ children, className }: CardProps): ReactElement => (
  <div className={`rounded-xl bg-white p-6 flex flex-col gap-y-2${className ? ` ${className}` : ''}`}>{children}</div>
);

export default Card;
