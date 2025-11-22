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
          className="flex-1 p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg border border-pink-400/50"
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
              className="group bg-pink-500/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-pink-500/30 transition-colors border border-pink-400/50"
            >
              <span>{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="text-pink-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                title="Remove keyword"
              >
                ×
              </button>
            </div>
          ))}
          {searchKeywords.length > 1 && (
            <button
              onClick={() => setSearchKeywords([])}
              className="text-orange-300 hover:text-yellow-300 text-sm underline transition-colors duration-200"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search Info */}
      {searchKeywords.length > 0 && (
        <div className="text-sm text-white mb-4">
          <div>Searching for: {searchKeywords.length} keyword{searchKeywords.length > 1 ? 's' : ''}</div>
          {/* {searchKeywords.length > 1 && (
            <div className="text-yellow-300 font-medium">
              Resources must contain ALL keywords
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
