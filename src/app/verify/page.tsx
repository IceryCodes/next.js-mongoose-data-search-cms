import { ReactElement } from 'react';

import VerifyContent from './components/VerifyContent';

const Page = (): ReactElement => (
  <div className={`mt-52 md:mt-0 md:h-content flex items-center justify-center`}>
    <VerifyContent />
  </div>
);

export default Page;
