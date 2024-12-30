import { create } from "zustand";
import { PdfSettings, ResumeType } from "../types/types";

// fetch data from local storage and set it to the store
const localStorageData = JSON.parse(localStorage.getItem("resumeData") || "{}");

// Create a store with Zustand for managing resume data
export const useResume = create<ResumeType>((set) => ({
  step: 0,
  resumeData: {
    basics: localStorageData.basics || {
      name: "John Doe",
      title: "Software Developer",
      email: "youremail@domain.com",
      linkedin: "http://linkedin.com/in/johndoe",
      website: "http://johndoe.com",
      phone: "+010101010",
      location: "Cairo, Egypt",
    },
    summary: {
      sectionTitle: localStorageData.summary?.sectionTitle || "Summary",
      content:
        localStorageData.summary?.content ||
        "Software Developer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks.",
    },
    experience: localStorageData.experience || [
      {
        name: "Google",
        position: "Software Developer",
        dateRange: "Jan 2020 - Present",
        location: "Mountain View, CA",
        employmentType: "Full-time",
        website: "https://google.com",
        summary:
          "<ul><li><p>Collaborated with designers to translate design mockups and user stories into functional and responsive web pages.</p></li> <li><p>Ensured cross-browser compatibility and responsiveness across various devices for an optimal user experience.</p></li> <li><p>Utilized Storybook to showcase component variations, interactions, and usage examples, facilitating collaboration and maintainability.</p></li></ul>",
      },
    ],
    projects: localStorageData.projects || [
      {
        name: "Project Name",
        description: "Project Description",
        date: "Jan 2020 - Present",
        website: "",
        summary:
          "<ul><li><strong>Responsive Front-End Development</strong>: Designed and implemented a fully responsive web application using React, ensuring optimal performance across desktop, tablet, and mobile devices.</li><li><strong>Clean Architecture</strong>: Structured the codebase with reusable components, meaningful variable names, and concise documentation to maintain scalability and ease of collaboration.</li><li><strong>Modern Design Integration</strong>: Accurately translated UI/UX designs into interactive interfaces, focusing on accessibility, layout precision, and smooth user experience.</li></ul>",
        keywords: ["React", "TypeScript", "Tailwind CSS"],
      },
    ],
    education: localStorageData.education || [
      {
        name: "University of California, Berkeley",
        degree: "Bachelor of Science",
        studyField: "Electrical Engineering & Computer Sciences",
        date: "2015 - 2019",
        website: "https://berkeley.edu",
        summary:
          "<p>GPA: 4</p> <ul><li><strong>Relevant coursework:</strong> Data Structures, Algorithms, Machine Learning, Computer Networks, Operating Systems.<li></ul>",
      },
    ],
    skills: localStorageData.skills || [
      {
        name: "Languages",
        keyword: "",
        keywords: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
      },
    ],
    languages: localStorageData.languages || [
      {
        name: "Arabic",
        level: "Native or Bilingual",
      },
    ],
    certifications: localStorageData.certifications || [],
    awards: localStorageData.awards || [],
    volunteering: localStorageData.volunteering || [],
  },
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setData: (data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        ...(data as ResumeType["resumeData"]),
      },
    })),
}));

// Create a store for PDF settings
export const usePdfSettings = create<PdfSettings>((set) => ({
  pdfSettings: {
    fontSize: 14,
    fontFamily: "inter",
    scale: 1,
    showForm: false,
  },
  setValue: (key, value) =>
    set((state) => ({ pdfSettings: { ...state.pdfSettings, [key]: value } })),
}));
