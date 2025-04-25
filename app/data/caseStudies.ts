export type CaseStudy = {
  title: string;
  category: string;
  date: string;
  file_name: string;
  location: string;
  solution_summary: string;
  casestudy_link: string;
};

// Function to fetch and return case studies
export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/metadata");

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }

    const metadata = await response.json();

    return metadata.map((item: any) => ({
      title: item.file_name.replace('.docx', ''),
      category: item.industry,
      date: new Date().toISOString().split('T')[0], // Placeholder date
      file_name: item.file_name,
      location: item.location,
      solution_summary: item.solution_summary,
      casestudy_link: item.casestudy_link,
    }));
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}
