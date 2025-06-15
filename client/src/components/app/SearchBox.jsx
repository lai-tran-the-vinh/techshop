import { useAppContext } from "@contexts";
import { useNavigate } from "react-router-dom";
import { Input, List, Flex, Typography } from "antd";
import React, { useState, useRef, useEffect } from "react";

const dataSource = [
  "Apple",
  "Banana",
  "Orange",
  "Grapes",
  "Mango",
  "Iphone 16",
  "Pineapple",
];

function SearchBox() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { query, setQuery } = useAppContext();
  const [showResults, setShowResults] = useState(false);

  const filteredResults = dataSource.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (query.trim() !== "") {
      setShowResults(true);
    }
  };

  function onSearch() {
    if (query.trim() !== "") {
      setShowResults(false);
      navigate(`/search/${query}`);
    }
  }

  function handleItemClick(event) {
    const value = event.target.textContent;
    setQuery(value);
    setShowResults(false);
    navigate(`/search/${value}`);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.trim() !== "") {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <Flex
      ref={containerRef}
      gap={10}
      style={{ width: 300, position: "relative" }}
    >
      <Input.Search
        value={query}
        onSearch={onSearch}
        onFocus={handleFocus}
        onChange={handleChange}
        className="font-roboto!"
        placeholder="Tìm kiếm sản phẩm..."
      />

      {showResults && (
        <Flex
          justify="center"
          className="absolute! bg-white! rounded-md! max-h-200! p-6! border! border-gray-300! top-full! mt-6! left-0! right-0! z-1000! overflow-auto!"
        >
          {filteredResults.length > 0 ? (
            <List
              size="small"
              className="w-full! font-roboto!  cursor-pointer! rounded-sm!"
              dataSource={filteredResults}
              renderItem={(item) => (
                <List.Item
                  onClick={handleItemClick}
                  className="w-full! border-none! rounded-sm! hover:bg-gray-100!"
                >
                  {item}
                </List.Item>
              )}
            />
          ) : (
            <Flex align="center" justify="center" className="min-h-100!">
              <Typography.Text className="font-roboto!">
                Không tìm thấy sản phẩm nào
              </Typography.Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default SearchBox;
