import { Fragment, ReactElement } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PageTypeMap } from '@/domains/interfaces';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps): ReactElement => {
  const pathname = usePathname();

  if (!pathname || pathname === '/') return <></>;

  const pathSegments = pathname.split('/').filter((segment) => segment);

  const convertLabel = (text: string): string => {
    return PageTypeMap[text.toUpperCase()] || text;
  };

  return (
    <nav>
      <ul className="flex gap-x-2 text-gray-500">
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <Fragment key={path}>
              <Link href={path} className="hover:underline">
                <li>{isLast ? pageName : convertLabel(segment.replace(/-/g, ' '))}</li>
              </Link>
              {!isLast && <span>/</span>}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
