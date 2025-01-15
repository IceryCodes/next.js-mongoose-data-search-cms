import { ReactElement } from 'react';

import { Button } from '../buttons/Button';

export interface SelectedTagsProps {
  selectedKeywords: string[];
  onRemove: (keywordId: string) => void;
}

const SelectedTags = ({ selectedKeywords, onRemove }: SelectedTagsProps): ReactElement => (
  <div className="inline-flex gap-2 py-2">
    {selectedKeywords.map((keyword) => (
      <div className="shrink-0" key={keyword}>
        <Button onClick={() => onRemove(keyword)} text={keyword} />
      </div>
    ))}
  </div>
);

export default SelectedTags;
