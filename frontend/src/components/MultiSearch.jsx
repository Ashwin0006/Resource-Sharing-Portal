import { useState, useEffect, useRef } from "react";

export default function MultiSearch({ onSearch, placeholder = "Search by keywords..." }) {
  const [inputValue, setInputValue] = useState("");
  const [searchKeywords, setSearchKeywords] = useState([]);
  const timeoutRef = useRef(null);

  const addKeyword = (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword && !searchKeywords.includes(trimmedKeyword)) {
      setSearchKeywords([...searchKeywords, trimmedKeyword]);
      setInputValue("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setSearchKeywords(searchKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addKeyword(inputValue);
      }
    }
  };

  // Trigger search when keywords change with debounce
  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const searchQuery = searchKeywords.join(',');
      onSearch(searchQuery);
    }, 300); // 300ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchKeywords]);

  return (
    <div className="w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>

      {/* Search Keywords Chips */}
      {searchKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchKeywords.map((keyword, index) => (
            <div
              key={index}
              className="group bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-blue-200 transition-colors"
            >
              <span>{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                title="Remove keyword"
              >
                ×
              </button>
            </div>
          ))}
          {searchKeywords.length > 1 && (
            <button
              onClick={() => setSearchKeywords([])}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search Info */}
      {searchKeywords.length > 0 && (
        <div className="text-sm text-gray-600 mb-4">
          <div>Searching for: {searchKeywords.length} keyword{searchKeywords.length > 1 ? 's' : ''}</div>
          {searchKeywords.length > 1 && (
            <div className="text-blue-600 font-medium">
              💡 Resources must contain ALL keywords
            </div>
          )}
        </div>
      )}
    </div>
  );
}
