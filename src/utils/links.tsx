import { ReactElement } from 'react';

import Link from 'next/link';

export enum LinkType {
  Phone = 0,
  Email = 1,
  Address = 2,
  Website = 3,
}

interface ConvertLinkProps {
  type: LinkType;
  text: string;
}

const ConvertLink = ({ type, text }: ConvertLinkProps): ReactElement | null => {
  let link: string = text;
  if (type === LinkType.Phone) link = `tel:${text}`;
  if (type === LinkType.Email) link = `mailto:${text}`;
  if (type === LinkType.Address) link = `https://www.google.com.tw/maps/place/${text}`;

  if (!text) return null;

  return (
    <Link href={link} className="hover:underline" target="_blank">
      {text}
    </Link>
  );
};

export default ConvertLink;
