'use client';

import HistorySidebar from '@/components/HistorySidebar';

const ViewEmailPage = () => {
  return (
    <div className="page-container">
      <HistorySidebar />
      <div className="case-study-content">
        <h1>
          Select an email to view from the sidebar.
        </h1>
      </div>
    </div>
  );
};

export default ViewEmailPage;