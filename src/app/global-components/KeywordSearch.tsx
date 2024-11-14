import { ReactElement, useState } from 'react';

interface KeywordSearchProps {
  options: string[];
  value: string;
  onChange: (text: string) => void;
}

const KeywordSearch = ({ options, value, onChange }: KeywordSearchProps): ReactElement => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSearch = (input: string) => {
    onChange(input);

    // Split input by comma to get individual keywords
    const keywords = input.split(',').map((k) => k.trim());
    const lastKeyword = keywords[keywords.length - 1];

    if (lastKeyword) {
      const filtered = options.filter((option) => option.toLowerCase().includes(lastKeyword.toLowerCase()));
      setFilteredOptions(filtered);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (option: string) => {
    const keywords = value.split(',').map((k) => k.trim());
    keywords[keywords.length - 1] = option;
    const newValue = keywords.join(',');

    onChange(newValue);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="失眠,減重,睡眠檢測"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        className="border rounded px-4 py-2 w-full"
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-fit bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            {filteredOptions.map((option) => (
              <li key={option} className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelect(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeywordSearch;
