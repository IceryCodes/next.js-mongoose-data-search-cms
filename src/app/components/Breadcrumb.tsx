import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, ReactElement, useCallback } from 'react';
import { PageTypeMap } from './interface';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps): ReactElement => {
  const pathname = usePathname();

  if (!pathname) return <></>;

  const pathSegments = pathname.split('/').filter((segment) => segment);

  const convertLabel = useCallback((text: string): string => {
    return PageTypeMap[text.toUpperCase()] || text;
  }, []);

  return (
    <nav className="flex gap-x-2 text-gray-500">
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={path}>
            <Link href={path} className="hover:underline">
              {isLast ? pageName : convertLabel(segment.replace(/-/g, ' '))}
            </Link>
            {!isLast && <span>/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
