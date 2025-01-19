import { ReactElement } from 'react';

import { Button } from '../buttons/Button';

export interface SelectedTagsProps {
  selectedKeywords: string[];
  onRemove: (keywordId: string) => void;
}

const SelectedTags = ({ selectedKeywords, onRemove }: SelectedTagsProps): ReactElement => (
  <div className="flex flex-wrap gap-2">
    {selectedKeywords.map((keyword) => (
      <Button key={keyword} onClick={() => onRemove(keyword)} text={keyword} smallButton />
    ))}
  </div>
);

export default SelectedTags;
