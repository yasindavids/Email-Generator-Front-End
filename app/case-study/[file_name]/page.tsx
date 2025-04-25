/*case-study/%5Bfile_name%5D/page.tsx */
'use client';

/*Imports */
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';
import { fetchCaseStudies, CaseStudy } from '../../data/caseStudies';
import ReactMarkdown from 'react-markdown';
import Spinner from '../../../components/Spinner';

const CaseStudyPage = () => {
  const params = useParams();
  const rawFileName = params.file_name as string;
  const filename = decodeURIComponent(rawFileName).replace('.docx', '');

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCaseStudies();
        const foundCaseStudy = data.find(cs => cs.file_name.replace('.docx', '') === filename);

        if (!foundCaseStudy) {
          setError("Case study not found.");
        } else {
          setCaseStudy(foundCaseStudy);
        }
      } catch (err) {
        console.error("Error fetching case study:", err);
        setError("Failed to load case study.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filename]);

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="case-study-content">
          <h1>Case Study Summary</h1>
          <div className="flex justify-center items-center h-[370px]">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="case-study-content">
          <h1>Case Study Summary</h1>
          <div>{error}</div>
          <Link href="/">
            <button className="comic-button">Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="case-study-content">
          <h1>Case Study Summary</h1>
          <div>Case study not found.</div>
          <Link href="/">
            <button className="comic-button">Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="case-study-content">
        <h1>Case Study Summary</h1>

        <div className="case-study-card">
          <h2>{caseStudy.title}</h2>
          <p>{caseStudy.casestudy_link}</p>
          <p>{caseStudy.category}</p>
          <p>{caseStudy.location}</p>
          <div className="case-study-summary">
            <ReactMarkdown>{caseStudy.solution_summary}</ReactMarkdown>
          </div>

          {caseStudy.casestudy_link && caseStudy.casestudy_link !== "None" && (
            <a href={caseStudy.casestudy_link} target="_blank" rel="noopener noreferrer">
              View Original Case Study
            </a>
          )}
        </div>

        <Link
          href={{
            pathname: '/gen-email',
            query: {
              file_name: caseStudy.title,
              industry: caseStudy.category,
              location: caseStudy.location,
              link: caseStudy.casestudy_link,
              summary: caseStudy.solution_summary

            },
          }}
        >
          <button className="comic-button sidebar-open">
            Generate Email
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CaseStudyPage;

