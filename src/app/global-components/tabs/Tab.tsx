import { ReactElement, useState } from 'react';

import { Button } from '../buttons/Button';

interface TabProps {
  tabs: ({ title: string; content: ReactElement } | undefined)[]; // An array of tab titles and their respective content
}

const Tab = ({ tabs }: TabProps): ReactElement => {
  if (tabs.length === 0) {
    throw new Error('At least one tab must be provided.');
  }

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <>
      {/* Tabs header */}
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab, index) =>
          !tab ? (
            <div key={index}></div>
          ) : (
            <Button
              key={index}
              element={<>{tab.title}</>}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-4 bg-transparent ${
                activeTab === index ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            />
          )
        )}
      </div>

      {/* Tab content */}
      <div>{tabs[activeTab] && tabs[activeTab].content}</div>
    </>
  );
};

export default Tab;
