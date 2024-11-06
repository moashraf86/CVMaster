// [1] Define type for PersonInfo
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  otherLink: string;
  phone: string;
  location: string;
}

// [2] Define type for summary
export interface Summary {
  summary: string;
}

// [3] Define type for Experience
export interface Experience {
  companyName: string;
  title: string;
  employmentType: string;
  location: string;
  locationType: string;
  currentlyWorking: boolean;
  startDate: Date;
  endDate: Date | undefined;
  description: string;
}
