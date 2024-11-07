import { ReactElement } from 'react';

interface liContentRenderProps {
  label: string;
  value: ReactElement | null;
}

export const liContentRender = ({ label, value }: liContentRenderProps): ReactElement => (
  <>
    {!!value && (
      <li>
        <h3>
          <div className="flex gap-x-2 items-center">
            <span className="whitespace-nowrap">{label}: </span>
            <span className="break-words">{value}</span>
          </div>
        </h3>
      </li>
    )}
  </>
);
