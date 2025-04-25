export type CaseStudyMetadata = {
    file_name: string;
    industry: string;
    location: string;
    solution_summary: string;
    casestudy_link: string;
    doc_type: string;
    score: number;
  };
  
export type EmailType = {
  subject: string
  body: string
}

  export type SearchResponse = CaseStudyMetadata[];
  