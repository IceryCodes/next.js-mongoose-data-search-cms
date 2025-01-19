import { ReactElement } from 'react';

import { Button, ButtonStyleType } from '../buttons/Button';

export interface SuggestedTagsProps {
  availableKeywords: string[];
  selectedKeywords: string[];
  onSelect: (keyword: string) => void;
}

const SuggestedTags = ({ availableKeywords, selectedKeywords, onSelect }: SuggestedTagsProps): ReactElement => (
  <div className="flex flex-wrap gap-2 ${className}">
    {availableKeywords.map((keyword) => (
      <Button
        key={keyword}
        onClick={() => onSelect(keyword)}
        disabled={selectedKeywords.includes(keyword)}
        text={keyword}
        buttonStyle={ButtonStyleType.Disabled}
        smallButton
      />
    ))}
    {availableKeywords.length === 0 && selectedKeywords.length > 0 && (
      <span className="text-sm text-gray-500">沒有更多相關的關鍵字</span>
    )}
  </div>
);

export default SuggestedTags;
