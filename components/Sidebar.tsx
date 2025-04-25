'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCaseStudies, CaseStudy } from '../app/data/caseStudies';
import Spinner from '../components/Spinner';

const Sidebar: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const data = await fetchCaseStudies();
        setCaseStudies(data);
      } catch (error) {
        console.error('Failed to load case studies', error);
      } finally {
        setLoading(false); // <- Add this line!
      }
    };

    loadCaseStudies();
  }, []);

  return (
    <div className="sidebar overflow-y-scroll">
      <Link href="/" passHref>
        <h2 className="sidebar-heading">Home</h2>
      </Link>
      <p>Case Studies</p>
      <div className="case_studies-container">
        {loading && (
          <div className="flex justify-center items-center h-[370px]">
            <Spinner />
          </div>
        )}
        {caseStudies.map((article, index) => (
          <Link key={index} href={`/case-study/${article.file_name}`} className="sidebar-link">
            {article.title}
          </Link>
        ))}
      </div>

      <Link href="/case-study/new" className="add-link">
        <div className="add-button">+</div>
      </Link>
    </div>
  );
};

export default Sidebar;


