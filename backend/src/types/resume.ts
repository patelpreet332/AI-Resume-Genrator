export interface EducationEntry {
  type: string;
  institution: string;
  years: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  years: string;
}

export interface ProjectEntry {
  title: string;
  link: string;
  description: string;
}

export interface ResumeInput {
  name: string;
  email: string;
  mobile: string;
  address: string;
  socialLinks: string;
  targetRole: string;
  skills: string[];
  isFresher: boolean;
  experienceList: ExperienceEntry[];
  educationList: EducationEntry[];
  projectList: ProjectEntry[];
  achievements: string;
}
