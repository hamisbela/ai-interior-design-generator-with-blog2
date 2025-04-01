import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  compact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  containerClassName = '',
  inputClassName = '',
  buttonClassName = '',
  placeholder = 'Search blog posts...',
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // When expanded and in compact mode, focus the input
    if (isExpanded && compact && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleExpand = () => {
    if (compact) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${containerClassName} flex items-center ${compact && !isExpanded ? 'w-auto' : 'w-full'}`}
    >
      {(isExpanded || !compact) && (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`${inputClassName} border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow`}
          aria-label="Search"
        />
      )}
      <button
        type={isExpanded || !compact ? 'submit' : 'button'}
        onClick={isExpanded || !compact ? undefined : toggleExpand}
        className={`${buttonClassName} ${
          isExpanded || !compact
            ? 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-md'
        } flex items-center justify-center transition-colors duration-300`}
        aria-label="Search"
      >
        <Search size={20} />
        {!compact && <span className="ml-2">Search</span>}
      </button>
    </form>
  );
};

export default SearchBar;