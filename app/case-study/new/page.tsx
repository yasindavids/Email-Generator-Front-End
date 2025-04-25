'use client';

import Sidebar from '../../../components/Sidebar';

const NewCaseStudyPage = () => {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="case-study-content">
        <h1>New Case Study</h1>
        <div className="case-study-card">
          <p>Start typing to create a new case study...</p>
        </div>
      </div>
    </div>
  );
};

export default NewCaseStudyPage;
