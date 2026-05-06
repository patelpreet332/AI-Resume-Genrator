import { ResumeInput } from "../types/resume";

export const buildPrompt = (data: ResumeInput) => {
  let experienceSection = "";
  
  if (data.isFresher) {
    experienceSection = "The candidate is a FRESHER. Focus on their potential, projects, and skills. Do not invent work history, but emphasize their readiness for the target role.";
  } else if (data.experienceList && data.experienceList.length > 0) {
    experienceSection = "Professional Experience:\n" + data.experienceList.map(exp => 
      `- ${exp.role} at ${exp.company} (${exp.years})`
    ).join("\n");
  } else {
    experienceSection = "The candidate has not provided any professional experience. Focus on their skills and education.";
  }

  let educationSection = "";
  if (data.educationList && data.educationList.length > 0) {
    educationSection = "Education:\n" + data.educationList.map(edu => 
      `- ${edu.type}: ${edu.institution} (${edu.years})`
    ).join("\n");
  } else {
    educationSection = "The candidate has not provided any education details. Leave the education section empty.";
  }

  let projectSection = "";
  if (data.projectList && data.projectList.length > 0) {
    projectSection = "Key Projects:\n" + data.projectList.map(proj => 
      `- ${proj.title} (Link: ${proj.link || 'N/A'}): ${proj.description}`
    ).join("\n");
  }

  return `
    Architect a premium, professional resume for the following candidate:
    
    Name: ${data.name}
    Email: ${data.email}
    Mobile: ${data.mobile}
    Address: ${data.address}
    Socials: ${data.socialLinks}
    
    Target Role: ${data.targetRole}
    Top Skills: ${data.skills.join(", ")}
    
    ${experienceSection}
    
    ${projectSection}
    
    ${educationSection}
    
    Additional Achievements:
    ${data.achievements}
    
    Please provide the resume in the following JSON format:
    {
      "summary": "Professional executive summary",
      "skills": ["Skill 1", "Skill 2", ...],
      "experience": [{"title": "Job Title", "company": "Company Name", "years": "Duration", "description": ["Action-oriented bullet 1", "Action-oriented bullet 2"]}],
      "projects": [{"title": "Project Name", "link": "url", "description": ["Bullet 1", "Bullet 2"]}],
      "education": [{"institution": "Name", "years": "Date", "degree": "Role/Degree"}],
      "achievements": ["Achievement 1", ...]
    }
    
    Ensure the "experience" and "projects" bullets are action-oriented and quantitative. If the candidate is a fresher, focus heavily on the "projects" section. If no experience or education is provided at all, return an empty array for those sections.
  `;
};
