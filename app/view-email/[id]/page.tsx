'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for dynamic params in Next.js 13+ app directory
import HistorySidebar from '@/components/HistorySidebar';
import { Copy } from 'lucide-react';
import { Pencil } from 'lucide-react'; // Importing the Pencil icon for editing

const ViewEmailPage = () => {
  const { id } = useParams();
  const [emailData, setEmailData] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false); // State to track if the component has mounted
  const [changeRequest, setChangeRequest] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    // Mark the component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (id) {
        // If there's an ID, fetch and display the email data
        const storedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
        const decodedId = decodeURIComponent(Array.isArray(id) ? id[0] : id);

        const matchedEmail = storedEmails.find((email: any) => email.id === decodedId);
        setEmailData(matchedEmail || null);
      } else {
        // If no ID, show the default placeholder state
        setEmailData(null);
      }
    }
  }, [isMounted, id]);

  const handleSubmit = async () => {
    if (!emailData || !changeRequest.trim()) return;

    // Set loading to true when submission starts
    setLoading(true);

    try {
      console.log("Sending request with:", {
        email: emailData,
        changes: changeRequest,
      });

      const response = await fetch('http://localhost:8000/tweak-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailData.email,
          changes: changeRequest,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        const updatedEmail = {
          ...emailData,
          email: data.modified_email.body, // <-- Use .body here
        };

        // Update the state with the new email
        setEmailData(updatedEmail);
        setChangeRequest('');

        const storedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
        const updatedEmails = storedEmails.map((email: any) =>
          email.id === emailData.id ? updatedEmail : email
        );
        localStorage.setItem('generatedEmails', JSON.stringify(updatedEmails));
      } else {
        console.error('Error:', data.detail);
      }
    } catch (error) {
      console.error('Failed to refine email:', error);
    } finally {
      // Set loading to false once the process is complete
      setLoading(false);
    }
  };


  return (
    <div className="page-container">
      <HistorySidebar />
      <div className="case-study-content">
        {emailData ? (
          <div className="case-study-card relative">
            {/* Top-right Copy button */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(emailData.email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000); // hide after 2s
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setEditedEmail(emailData.email);
                  setIsEditing(true);
                }}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
                title="Edit email"
              >
                <Pencil className="w-5 h-5" />
              </button>

              {copied && (
                <span className="text-sm text-green-600 animate-fade-in-out">Copied!</span>
              )}
            </div>


            <h1 className="text-2xl font-bold mb-4">Your Generated Email</h1>
            <p className="text-gray-500 mb-4">
              <span className="font-bold">Company Name: </span>{emailData.company_name}
            </p>
            <p className="text-gray-500 mb-4">
              <span className="font-bold">Company URL: </span>
              {emailData.company_url && (
                <a
                  href={
                    emailData.company_url.includes("://")
                      ? emailData.company_url.replace("localhost:3000/view-email/", "")
                      : "https://" + emailData.company_url.replace("localhost:3000/view-email/", "")
                  }
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here
                </a>
              )}
            </p>
            <p className="text-gray-500 mb-4">
              <span className="font-bold">Email: </span>
            </p>
            {loading ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6">Updating Email...</h2>
                <div className="typewriter2 mx-auto relative left-2">
                  <div className="slide">
                    <i></i>
                  </div>
                  <div className="paper"></div>
                  <div className="keyboard"></div>
                </div>
              </div>
            ) : isEditing ? (
              <div className="flex flex-col space-y-2">
                <textarea
                  className="whitespace-pre-wrap bg-white p-5 rounded shadow w-full h-100 resize-none"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
                <div className="flex justify-end space-x-2 gap-2">
                  <button
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-button"
                    onClick={() => {
                      const updatedEmail = { ...emailData, email: editedEmail };
                      setEmailData(updatedEmail);
                      setIsEditing(false);

                      const storedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
                      const updatedEmails = storedEmails.map((email: any) =>
                        email.id === emailData.id ? updatedEmail : email
                      );
                      localStorage.setItem('generatedEmails', JSON.stringify(updatedEmails));
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap bg-white p-4 rounded shadow">
                {emailData.email}
              </p>
            )}

          </div>

        ) : (
          <div className="p-4 text-gray-500">
            {id ? "Email not found" : "Select an email to view from the sidebar"}
          </div>
        )}

        {/* Search bar placed under the email card */}
        <div className="search-bar">
          <div className="search-controls">
            <input
              type="text"
              id="searchRequest"
              placeholder="Ask chatbot to edit..."
              className="search-input"
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmailPage;


