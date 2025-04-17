"use client";
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('All Time'); // date filter still placeholder
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const articles = [
    { title: "Tech Company", category: "Tech", date: "2023-01-01" },
    { title: "Healthcare Facility", category: "Health", date: "2023-02-01" },
    { title: "Wall Street Trading Firm", category: "Finance", date: "2023-03-01" },
    { title: "Data Company", category: "Tech", date: "2023-04-01" },
    { title: "College", category: "Education", date: "2023-05-01" },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearchQuery = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || article.category === category;
    const matchesDateRange = dateRange === 'All Time' || article.date === dateRange;

    return matchesSearchQuery && matchesCategory && matchesDateRange;
  });

  return (
    <div className="home">
      {/* Search & Filter Row */}
      <div className="search-bar">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>

      {/* Articles */}
      <div className="cards">
        <div className="card">
          <h2>Case Studies</h2>
            
          <div className="articles-container">
            {filteredArticles.map((article, index) => (
              <div key={index} className="article">
                {article.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
      <button>
        <span className="text">Add Case Study</span>
      </button>
      </div>
    </div>
  );
}
