import { create } from "zustand";
import { ResumeType } from "../types/types";

// Create a store with zustand
export const useResume = create<ResumeType>((set) => ({
  step: 0,
  resumeData: {
    basics: {
      name: "John Doe",
      title: "Software Developer",
      email: "youremail@domain.com",
      linkedin: "http://linkedin.com/in/johndoe",
      website: "http://johndoe.com",
      phone: "+010101010",
      location: "Cairo, Egypt",
    },
    summary: {
      content:
        "Software Developer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks.",
    },
    experience: [
      {
        name: "Google",
        position: "Software Developer",
        dateRange: "Jan 2020 - Present",
        location: "Mountain View, CA",
        employmentType: "Full-time",
        website: "https://google.com",
        summary:
          "• Collaborated with designers to translate design mockups and user stories into functional and responsive web pages. \n • Ensured cross-browser compatibility and responsiveness across various devices for an optimal user experience. \n • Utilized Storybook to showcase component variations, interactions, and usage examples, facilitating collaboration and maintainability.",
      },
    ],
    projects: [
      {
        name: "Project Name",
        description: "Project Description",
        date: "Jan 2020 - Present",
        website: "https://example.com",
        summary:
          "• Modern Blog Platform: A web app for creating, managing, and reading blog posts. \n • User Authentication: Google login for full access; guest mode with limited features. \n • Dynamic Data Handling: Efficient data fetching and updates using react-query. \n • Custom Rich Text Editor: Built with react-md-editor for an enhanced writing experience. \n • Post Engagement: Users can bookmark posts and participate in the comments section.",
        keyword: "",
        keywords: ["React", "Node.js", "MongoDB"],
      },
    ],
    education: [
      {
        name: "School Name",
        degree: "Bachelor's",
        studyField: "Computer Science",
        date: "Jan 2020 - Jan 2024",
        website: "https://example.com",
        summary: "",
      },
    ],
    skills: [
      {
        name: "Languages",
        keyword: "",
        keywords: ["React", "Node.js", "MongoDB"],
      },
    ],
    languages: [
      {
        name: "English",
        level: "Conversational",
      },
    ],
    certifications: [],
    awards: [],
    volunteering: [],
  },
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setValue: (key, value) =>
    set((state) => ({ resumeData: { ...state.resumeData, [key]: value } })),
  setData: (data) =>
    set((state) => ({ resumeData: { ...state.resumeData, ...data } })),
}));
