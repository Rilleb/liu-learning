import { useState } from 'react';

interface EnhancedTextboxProps {
  initialValue?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  onTextChange?: (text: string) => void;
}

export default function EnhancedTextbox({
  initialValue = '',
  placeholder = 'Enter your text...',
  rows = 4,
  maxLength,
  onTextChange,
}: EnhancedTextboxProps) {
  const [text, setText] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  const clearText = () => {
    setText('');
    if (onTextChange) {
      onTextChange('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
        {text && (
          <button
            onClick={clearText}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear text"
          >
            ×
          </button>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        {maxLength && (
          <span>
            {text.length}/{maxLength} characters
          </span>
        )}
        {!maxLength && <span>{text.length} characters</span>}
        {text && <span>Preview: {text.substring(0, 30)}...</span>}
      </div>
    </div>
  );
}