import { ReactElement } from 'react';

import { Button, ButtonStyleType } from '../buttons/Button';

export interface SuggestedTagsProps {
  availableKeywords: string[];
  selectedKeywords: string[];
  onSelect: (keyword: string) => void;
}

const SuggestedTags = ({ availableKeywords, selectedKeywords, onSelect }: SuggestedTagsProps): ReactElement => (
  <div className="inline-flex gap-2 py-2">
    {availableKeywords.map((keyword) => (
      <div className="shrink-0" key={keyword}>
        <Button
          onClick={() => onSelect(keyword)}
          disabled={selectedKeywords.includes(keyword)}
          text={keyword}
          buttonStyle={ButtonStyleType.Disabled}
        />
      </div>
    ))}
    {availableKeywords.length === 0 && selectedKeywords.length > 0 && (
      <span className="text-sm text-gray-500 shrink-0">沒有更多相關的關鍵字</span>
    )}
  </div>
);

export default SuggestedTags;
