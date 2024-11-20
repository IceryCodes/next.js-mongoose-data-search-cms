import { FieldValues, UseFormSetValue } from 'react-hook-form';

import Tag from './Tag';

interface TagGroupProps {
  tags: string[];
  fieldName: string;
  setValue: UseFormSetValue<FieldValues>;
}

export const TagGroup = ({ tags, fieldName, setValue }: TagGroupProps) => {
  return (
    <div
      className="flex items-center gap-x-2 overflow-x-auto whitespace-nowrap scrollbar-thin"
      style={{ maxWidth: '100%', scrollbarWidth: 'thin' }}
    >
      {tags.map(
        (tag: string) =>
          tag && (
            <div key={tag} className="cursor-pointer">
              <Tag
                key={tag}
                text={tag}
                onClick={() => {
                  setValue(
                    fieldName,
                    tags.filter((t) => t !== tag)
                  );
                }}
              />
            </div>
          )
      )}
    </div>
  );
};
