'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCaseStudies, CaseStudy } from './data/caseStudies';
import Spinner from '../components/Spinner';

export default function Home() {
  const [localCaseStudies, setLocalCaseStudies] = useState<CaseStudy[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('All Time');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emailHistory, setEmailHistory] = useState([]);

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCaseStudies();
        setLocalCaseStudies(data);
      } catch (err) {
        setError("Failed to load case studies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter the case studies based on search and category
  const filteredCaseStudies = localCaseStudies.filter((item) => {
    const matchesSearchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="home">
      {/* Header and search controls remain the same */}
      <header>
        <h1>Outreach AI</h1>
      </header>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search case studies..."
          className="search-input comic-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="filter-dropdown comic-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Technology">Technology</option>
          <option value="Retail">Retail</option>
          <option value="Energy">Energy</option>
          <option value="Insurance">Insurance</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      {/* Case Studies */}
      <div className="cards">
        <div className="card">
          <h2>Case Studies</h2>
          <div className="case_studies-container overflow-y-scroll h-[370px]">
            {loading && (
              <div className="flex justify-center items-center h-[370px]">
                <Spinner />
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && filteredCaseStudies.length === 0 && (
              <p>No case studies found.</p>
            )}

            {filteredCaseStudies.map((study, index) => (
              <Link key={index} href={`/case-study/${study.file_name}`}>
                <div className="article">
                  <h3>{study.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Your existing buttons */}
      <div>
        <Link href="/view-email/">
          <button className="comic-button">View Email History </button>
        </Link>
      </div>
    </div>
  );
}
