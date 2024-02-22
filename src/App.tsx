import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  isbn?: string[];
  number_of_pages_median?: number;
}

interface SearchResult {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Book[];
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [sortByRelevance, setSortByRelevance] = useState<boolean>(true);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  const handleSearch = async (searchTerm: string) => {
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${searchTerm}`
      );
      setSearchResults(response.data.docs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleSortByRelevance = () => {
    setSortByRelevance(true);
  };

  const handleSortByYear = () => {
    setSortByRelevance(false);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortByRelevance) {
      return 0;
    } else {
      return a.first_publish_year - b.first_publish_year;
    }
  });

  return (
    <div className="app">
      <h1>Billy's Big Book Emporium</h1>
      <div className="sort-buttons">
        <button
          className={`sort-button ${sortByRelevance ? 'active' : ''}`}
          onClick={handleSortByRelevance}
        >
          Sort by Relevance
        </button>
        <button
          className={`sort-button ${!sortByRelevance ? 'active' : ''}`}
          onClick={handleSortByYear}
        >
          Sort by Year
        </button>
      </div>
      <label htmlFor="search">Type to Search:</label>
      <div className="search-container">
        <input
          id="search"
          type="text"
          placeholder="Enter your search query..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="results-container">
        {sortedResults.map((book, index) => (
          <div key={index} className="result">
            <h3>{book.title}</h3>
            <p>Author(s): {book.author_name.join(', ')}</p>
            <p>Year published: {book.first_publish_year}</p>
            {book.isbn && <p>ISBN: {book.isbn[0]}</p>}
            {book.number_of_pages_median && <p>Number of pages: {book.number_of_pages_median}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;










