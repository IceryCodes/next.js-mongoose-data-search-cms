import { ReactElement, useCallback, useMemo } from 'react';

import SelectedTags from './SelectedTags';
import SuggestedTags from './SuggestedTags';

export interface KeywordSelectionProps {
  keywords: string[];
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  className?: string;
}

const KeywordSelector = ({
  keywords,
  selectedKeywords,
  onKeywordsChange,
  className = '',
}: KeywordSelectionProps): ReactElement => {
  const selectedKeywordObjects = useMemo(() => {
    return keywords.filter((keyword) => selectedKeywords.includes(keyword));
  }, [keywords, selectedKeywords]);

  const availableKeywords = useMemo(() => {
    if (selectedKeywords.length === 0) {
      return keywords;
    }

    return keywords.filter((keyword) => !selectedKeywords.includes(keyword));
  }, [keywords, selectedKeywords]);

  const handleSelect = useCallback(
    (keyword: string) => {
      onKeywordsChange([...selectedKeywords, keyword]);
    },
    [selectedKeywords, onKeywordsChange]
  );

  const handleRemove = useCallback(
    (selectedKeyword: string) => {
      onKeywordsChange(selectedKeywords.filter((keyword) => keyword !== selectedKeyword));
    },
    [selectedKeywords, onKeywordsChange]
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col w-full">
        {!!selectedKeywordObjects.length && (
          <div className="w-full overflow-x-auto">
            <div className="flex flex-nowrap min-w-max">
              <SelectedTags selectedKeywords={selectedKeywordObjects} onRemove={handleRemove} />
            </div>
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <div className="flex flex-nowrap min-w-max">
            <SuggestedTags
              availableKeywords={availableKeywords}
              selectedKeywords={selectedKeywords}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordSelector;
