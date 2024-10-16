import { ReactElement } from 'react';

interface CardProps {
  children: ReactElement;
}

const Card = ({ children }: CardProps): ReactElement => (
  <div className="rounded-xl bg-white p-6 flex flex-col gap-y-2">{children}</div>
);

export default Card;
