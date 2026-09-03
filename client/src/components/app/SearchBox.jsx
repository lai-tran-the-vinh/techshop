import React, { useState, useRef, useEffect } from 'react';
import {
  SearchIcon,
  TrendingUpIcon,
  ClockIcon,
  XIcon,
  ReceiptCent,
  ArrowLeft,
} from 'lucide-react';
import { List, Spin, Typography, Image } from 'antd';
import Products from '@/services/products';
import { useNavigate } from 'react-router-dom';
import Recomment from '@/services/recommend';
import { useAppContext } from '@/contexts';
import { set } from 'react-hook-form';
import { formatCurrency } from '@/helpers';

function SearchBox() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [recommentProducts, setRecommentProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  async function fetchSearchResult() {
    try {
      setLoading(true);
      const result = await Products.search(query);
      setResult(result);
      setFilteredResults(Array.isArray(result) ? result : []);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setFilteredResults([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (query.trim() !== '') {
      fetchSearchResult();
    } else {
      setFilteredResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
  };

  useEffect(() => {
    if (isFocused) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFocused]);

  const handleSearch = () => {
    if (query.trim() !== '') {
      setShowResults(false);
      setIsFocused(false);
      addToRecentSearches(query);
      navigate(`/search/${query}`);
    }
  };

  const handleItemClick = (item) => {
    setQuery(item.name);
    setShowResults(false);
    setIsFocused(false);
    navigate(`/search/${value}`);
  };

  const handleTrendingClick = (term) => {
    setQuery(term);

    inputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setQuery('');
    setFilteredResults([]);
    inputRef.current?.focus();
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setShowResults(true);
  };
  const addToRecentSearches = (term) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)];
    const limited = updated.slice(0, 5);
    setRecentSearches(limited);
    localStorage.setItem('recentSearches', JSON.stringify(limited));
  };
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    setVisibleCount(5);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (user) {
          const res = await Recomment.getRecommendationsByUser(user._id);
          setRecommentProducts(res);
        } else {
          const res = await Recomment.getRecommendationsPopular();
          setRecommentProducts(res);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [user]);

  return (
    <div className={`w-full relative ${isFocused ? 'max-lg:fixed max-lg:inset-0 max-lg:z-[100] max-lg:bg-gray-50 max-lg:flex max-lg:flex-col' : ''}`}>
      <div ref={containerRef} className={isFocused ? 'max-lg:flex-1 max-lg:flex max-lg:flex-col' : ''}>
        <div className={`relative w-full ${isFocused ? 'max-lg:bg-gradient-primary-to-secondary max-lg:px-3 max-lg:py-3 max-lg:flex max-lg:items-center max-lg:gap-3' : ''}`} onClick={handleFocus}>
          {isFocused && (
            <button 
              className="lg:hidden p-1 text-white! hover:text-gray-200 transition-colors shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowResults(false);
                setIsFocused(false);
                inputRef.current?.blur();
              }}
            >
              <ArrowLeft className="w-[28px] h-[28px]" />
            </button>
          )}
          <div className={`relative bg-white rounded-full flex items-center ${isFocused ? 'flex-1' : ''}`}>
            <div className="flex flex-1 min-w-0 items-center px-4 py-2 lg:py-4">
              {!isFocused && (
                <SearchIcon
                  className={`hidden lg:block w-5 h-5 lg:w-20 lg:h-20 transition-colors duration-300 ml-2 lg:ml-5 mr-4 lg:mr-10 text-gray-400`}
                />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm kiếm sản phẩm...."
                className={`flex-1 min-w-0 ${isFocused && 'pl-8'} text-sm md:text-base outline-none placeholder-gray-400 h-[35px]`}
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="w-20 h-20 text-gray-400" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center cursor-pointer bg-gradient-to-r bg-[#fee2e2] text-white rounded-full p-[6px] md:p-8 w-[35px] h-[35px] md:w-auto md:h-auto shrink-0"
              >
                <SearchIcon className="w-[80%] h-[80%] lg:w-20 lg:h-20 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {showResults && (
          <div className="absolute max-lg:relative max-lg:top-auto max-lg:mt-0 max-lg:shadow-none max-lg:border-none top-full mt-6 left-0 right-0 bg-white lg:rounded-xl lg:border border-gray-300 overflow-y-auto max-lg:flex-1 max-lg:h-[calc(100vh-64px)] z-50 animate-in slide-in-from-top-2 duration-300">
            {!query.trim() && (
              <div className="p-4 lg:p-6">
                {recommentProducts.length > 0 && (
                  <div className="mb-6 p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <TrendingUpIcon className="w-20 h-20 text-primary" />
                      Sản phẩm gợi ý cho bạn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recommentProducts.slice(0, 3).map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            navigate(`/product/${term._id}`);
                            setShowResults(false);
                            setIsFocused(false);
                          }}
                          className="flex cursor-pointer items-center gap-2 bg-gradient-to-r h-[60px] w-full lg:w-auto lg:min-w-[200px] p-4 rounded-md text-sm hover:from-orange-100 hover:to-red-100 transition-all duration-300 transform hover:scale-105"
                        >
                          <img
                            src={term?.variants[0]?.color[0]?.images[0]}
                            alt={term.name}
                            className="w-70 h-50 object-contain"
                          />
                          <div className="text-gray-700">{term.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="space-y-2">
                      {recentSearches.slice(0, 5).map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleTrendingClick(term)}
                          className="flex items-center h-[40px] gap-3 w-full text-left p-2 rounded-lg"
                        >
                          <ClockIcon className="w-20 h-20 text-gray-400" />
                          <span className="text-gray-700 ml-6">{term}</span>
                        </button>
                      ))}
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleClearRecentSearches}
                        className="cursor-pointer! font-medium! text-sm hover:underline"
                      >
                        Xóa lịch sử tìm kiếm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {loading && query.trim() && (
              <div className="flex min-h-200 items-center justify-center">
                <Spin size="default" />
              </div>
            )}

            {filteredResults.length > 0 && !loading && query.trim() !== '' && (
              <div className="p-4 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-4 px-2">
                  Tìm thấy {filteredResults.length} sản phẩm
                </div>

                {filteredResults.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-4 p-10 mb-4 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="w-50 h-50  flex items-center justify-center">
                      <img
                        src={item.variants[0]?.color[0]?.images[0]}
                        alt={item.name}
                        className="w-50 h-50 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                        {item.name}
                      </div>
                    </div>
                    <div className="text-primary font-semibold">
                      {item.variants[0]?.price.toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredResults.length === 0 && !loading && query.trim() && (
              <div className="p-8 text-center">
                <div className="w-200 h-150 flex items-center justify-center mx-auto">
                  <Image
                    preview={false}
                    src="https://fptshop.com.vn/img/empty_state.png?w=640&q=75"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 text-sm">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBox;
