/* /gen-email/page.tsx */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const GenerateEmailPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [uiData, setUiData] = useState<any | null>(null);
    const [emailData, setEmailData] = useState<any | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const fileName = searchParams.get('file_name');
    const summary = searchParams.get('summary');
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const link = searchParams.get('link');

    const generateEmail = async (additionalInfo = '', signal?: AbortSignal) => {
        setError('');
        setEmail('');
        setUiData(null);
        setEmailData(null);
        setIsSaved(false);

        if (!fileName || !summary || !industry || !location || !link) {
            setError("Missing one or more required query parameters.");

            return;
        }

        try {
            const response = await fetch("http://localhost:8000/generate-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: fileName,
                    summary,
                    industry,
                    location,
                    link,
                    additional_info: additionalInfo,
                }),
                signal,
            });

            if (!response.ok) throw new Error("Email generation failed");

            const data = await response.json();
            setEmail(data.email || '');
            setUiData(data.uiData || null);

            const newEmailData = {
                id: new Date().toISOString(),
                email: data.email,
                subject_lines: data.uiData?.subject_lines || [],
                ctas: data.uiData?.ctas || [],
                company_name: data.company_name || '',
                company_url: data.company_url || '',
                file_name: fileName,
                summary,
                industry,
                location,
                link,
            };

            setEmailData(newEmailData);

            const storedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
            storedEmails.push(newEmailData);
            localStorage.setItem('generatedEmails', JSON.stringify(storedEmails));
            setIsSaved(true);


            router.push(`/view-email/${newEmailData.id}`);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('Email generation aborted');
            } else {
                setError(err instanceof Error ? err.message : "Unknown error");
            }
        } finally {

        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true); // Ensure loading is true on mount
        generateEmail('', signal); // Start generating email

        return () => {
            controller.abort(); // Abort fetch on unmount or dependency change

            setEmail('');
            setUiData(null);
            setEmailData(null);
            setIsSaved(false);
        };
    }, [fileName, summary, industry, location, link]);

    const handleRegenerate = () => {
        generateEmail(inputValue);
    };

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(email);
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl px-4">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-6">Generating Email...</h1>

                {loading && (
                    <div className="typewriter mx-auto">
                        <div className="slide">
                            <i></i>
                        </div>
                        <div className="paper"></div>
                        <div className="keyboard"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 p-4 rounded-md mt-6">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);
    
};

export default GenerateEmailPage;

