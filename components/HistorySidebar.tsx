'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type EmailData = {
  id: string;
  email: string;
  file_name: string;
  summary: string;
  industry: string;
  location: string;
  link: string;
  subject_lines: string[];
  ctas: string[];
  company_name: string;
  company_url: string;
};

const HistorySidebar: React.FC = () => {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('generatedEmails');
    if (stored) {
      setEmails(JSON.parse(stored));
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    console.log('Emails updated:', emails);
  }, [emails]);

  return (
    <div className="sidebar overflow-y-scroll">
      <Link href="/" passHref>
        <h2 className="sidebar-heading">Home</h2>
      </Link>
      <p> Email Recipient</p>
      <div className="case_studies-container">
        {loading && (
          <div className="flex justify-center items-center h-[370px]">
            <div className="loader" /> {/* You can replace this with a real <Spinner /> */}
          </div>
        )}
        {emails.map((email, index) => (
          <Link
            key={index}
            href={`/view-email/${email.id}`}  // Change to dynamic route
            className="sidebar-link"
          >
            { email.company_name}
            
          </Link>
        ))}
      </div>

      <Link href="/" className="add-link">
        <div className="add-button">+</div>
      </Link>
    </div>
  );
};

export default HistorySidebar;
