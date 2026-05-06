import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, FileText, User, Briefcase, Award, Loader2, Sparkles, 
  Download, FileJson, Upload, X, Mail, Phone, MapPin, 
  Globe, ChevronRight, ChevronLeft, Target, Star, GraduationCap,
  Linkedin, Github, Facebook, Twitter, Plus, Trash2, Link, ChevronDown, AlertCircle, History,
  UserCheck, Terminal
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

interface ResumeData {
  summary: string;
  skills: string[];
  experience: Array<{ title: string, company: string, years: string, description: string[] }>;
  projects: Array<{ title: string, link?: string, description: string[] }>;
  education: Array<{ institution: string, years: string, degree: string }>;
  achievements?: string[];
}

interface SocialLink { platform: string; url: string; }
interface EducationEntry { type: string; institution: string; years: string; }
interface ExperienceEntry { company: string; role: string; years: string; }
interface ProjectEntry { title: string; link: string; description: string; }

const PLATFORMS = [
  { name: 'LinkedIn', icon: <Linkedin size={14} /> },
  { name: 'GitHub', icon: <Github size={14} /> },
  { name: 'Facebook', icon: <Facebook size={14} /> },
  { name: 'Twitter', icon: <Twitter size={14} /> },
  { name: 'Portfolio', icon: <Globe size={14} /> },
  { name: 'Other', icon: <Link size={14} /> }
];

const EDUCATION_TYPES = ['College', 'School', 'University', 'Course', 'Certification', 'Other'];
const COUNTRY_CODES = [
  { code: '+91', name: 'India' }, { code: '+1', name: 'USA' }, 
  { code: '+44', name: 'UK' }, { code: '+61', name: 'Australia' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: 'LinkedIn', url: '' }]);
  const [educationList, setEducationList] = useState<EducationEntry[]>([{ type: 'College', institution: '', years: '' }]);
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([{ company: '', role: '', years: '' }]);
  const [projectList, setProjectList] = useState<ProjectEntry[]>([{ title: '', link: '', description: '' }]);
  const [isFresher, setIsFresher] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', countryCode: '+91', mobile: '', address: '',
    skills: '', targetRole: '', achievements: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Persistence with Try-Catch safety
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resume_architect_data');
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(prev => ({ ...prev, ...parsed.formData }));
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.educationList) setEducationList(parsed.educationList);
        if (parsed.experienceList) setExperienceList(parsed.experienceList);
        if (parsed.isFresher !== undefined) setIsFresher(parsed.isFresher);
      }
    } catch (e) {
      console.error("Failed to load persistence:", e);
    }
  }, []);

  // Save Persistence
  useEffect(() => {
    const data = { formData, socialLinks, educationList, experienceList, isFresher };
    localStorage.setItem('resume_architect_data', JSON.stringify(data));
  }, [formData, socialLinks, educationList, experienceList, isFresher]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };
  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: 'LinkedIn', url: '' }]);
  const removeSocialLink = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index));

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    const newList = [...educationList];
    newList[index][field] = value;
    setEducationList(newList);
  };
  const addEducation = () => setEducationList([...educationList, { type: 'College', institution: '', years: '' }]);
  const removeEducation = (index: number) => setEducationList(educationList.filter((_, i) => i !== index));

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    const newList = [...experienceList];
    newList[index][field] = value;
    setExperienceList(newList);
  };
  const addExperience = () => setExperienceList([...experienceList, { company: '', role: '', years: '' }]);
  const removeExperience = (index: number) => setExperienceList(experienceList.filter((_, i) => i !== index));

  const handleProjectChange = (index: number, field: keyof ProjectEntry, value: string) => {
    const newList = [...projectList];
    newList[index][field] = value;
    setProjectList(newList);
  };
  const addProject = () => setProjectList([...projectList, { title: '', link: '', description: '' }]);
  const removeProject = (index: number) => setProjectList(projectList.filter((_, i) => i !== index));

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.address) {
        setError('Please fill all mandatory fields (*) before proceeding.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.targetRole || !formData.skills) {
        setError('Please fill all mandatory fields (*) before proceeding.');
        return;
      }
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getPlatformIcon = (platform: string, size: number = 16, isResume: boolean = false) => {
    const isDark = !isResume;
    const resumeIconColor = "#5d175d"; // Professional deep purple/magenta from example
    switch (platform) {
      case 'LinkedIn': return <Linkedin size={size} color={isResume ? resumeIconColor : "#0A66C2"} />;
      case 'GitHub': return <Github size={size} color={isDark ? "#ffffff" : resumeIconColor} />;
      case 'Facebook': return <Facebook size={size} color={isResume ? resumeIconColor : "#1877F2"} />;
      case 'Twitter': return <Twitter size={size} color={isResume ? resumeIconColor : "#1DA1F2"} />;
      default: return <Globe size={size} color={isResume ? resumeIconColor : "#6366f1"} />;
    }
  };

  const formatSocialUrl = (url: string, platform: string) => {
    if (!url) return '';
    const clean = url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    return clean;
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.formData) setFormData(prev => ({ ...prev, ...parsed.formData }));
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.educationList) setEducationList(parsed.educationList);
        if (parsed.experienceList) setExperienceList(parsed.experienceList);
        if (parsed.isFresher !== undefined) setIsFresher(parsed.isFresher);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep !== 7 || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/generate-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mobile: `${formData.countryCode} ${formData.mobile}`,
          socialLinks: socialLinks.filter(l => l.url).map(l => `${l.platform}: ${l.url}`).join(', '),
          isFresher,
          experienceList: isFresher ? [] : experienceList.filter(exp => exp.company.trim() || exp.role.trim()),
          projectList: projectList.filter(p => p.title.trim()),
          educationList: educationList.filter(e => e.institution),
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        }),
      });
      const result = await response.json();
      
      if (result.data && result.data.raw) {
        let rawContent = result.data.raw;
        rawContent = rawContent.replace(/```json\n?/, '').replace(/\n?```/, '');
        const parsedResume = JSON.parse(rawContent);
        setResume(parsedResume);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error);
      setError('Architect failed to generate resume. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      // Improved capturing options for full-page export
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Explicitly target the resume elements in the clone to remove scroll/height limits
          const paper = clonedDoc.querySelector('.resume-paper');
          const wrapper = clonedDoc.querySelector('.resume-paper-wrapper');
          
          if (paper) {
            (paper as HTMLElement).style.height = 'auto';
            (paper as HTMLElement).style.overflow = 'visible';
          }
          if (wrapper) {
            (wrapper as HTMLElement).style.maxHeight = 'none';
            (wrapper as HTMLElement).style.overflow = 'visible';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "resume.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="app-container">
      <main className="main-layout">
        <section className="left-side">
          <header className="header-left">
            <h1>AI Resume Architect</h1>
            <p>Premium multi-step resume builder</p>
          </header>

          <div className="glass-card form-container">
            <div className="stepper">
              {[1, 2, 3, 4, 5, 6, 7].map(step => (
                <div key={step} className={`step-item ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                  <div className="step-number">{currentStep > step ? '✓' : step}</div>
                </div>
              ))}
            </div>

            {error && (
              <div className="form-error-bar">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form id="resume-form" onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="step-content animate-in">
                  <div className="form-header"><User size={26} className="icon-blue" /><div><h2>Contact Information</h2></div></div>
                  <div className="input-grid">
                    <div className="input-group"><label className="rich-label"><span><User size={16} /> Full Name <span className="required-star">*</span></span></label><input type="text" name="name" placeholder="Urielle Morse" value={formData.name} onChange={handleInputChange} /></div>
                    <div className="input-group"><label className="rich-label"><span><Mail size={16} /> Email Address <span className="required-star">*</span></span></label><input type="email" name="email" placeholder="ritusyzy@mailinator.com" value={formData.email} onChange={handleInputChange} /></div>
                    <div className="input-group"><label className="rich-label"><span><Phone size={16} /> Mobile Number</span></label><div className="mobile-input-group dark-box"><div className="country-selector" onClick={(e) => e.stopPropagation()}><div className={`custom-select mini-select ${openDropdown === 'country' ? 'open' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}><span>{formData.countryCode}</span><ChevronDown size={14} /></div>{openDropdown === 'country' && (<div className="options-dropdown glass-card mini-dropdown">{COUNTRY_CODES.map((c) => (<div key={c.code} className="option-item" onClick={() => { setFormData(prev => ({ ...prev, countryCode: c.code })); setOpenDropdown(null); }}><span>{c.code} ({c.name})</span></div>))}</div>)}</div><div className="entry-divider"></div><input type="tel" name="mobile" placeholder="+1 (753) 127-3" value={formData.mobile} onChange={handleInputChange} /></div></div>
                    <div className="input-group"><label className="rich-label"><span><MapPin size={16} /> Location / Address <span className="required-star">*</span></span></label><input type="text" name="address" placeholder="Asperiores ea dolor" value={formData.address} onChange={handleInputChange} /></div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content animate-in">
                  <div className="form-header">
                    <div className="form-header-row">
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Globe size={26} className="icon-purple" />
                        <h2>Social Presence</h2>
                      </div>
                      <button type="button" className="skip-btn" onClick={nextStep}>Skip <ChevronRight size={14} /></button>
                    </div>
                  </div>
                  <div className="dynamic-list">
                    <div className="scroll-area social-scroll">
                      {socialLinks.map((link, index) => (
                        <div key={index} className={`premium-entry-bar animate-in ${openDropdown === `social-${index}` ? 'z-top' : ''}`}>
                          <div className="entry-type-selector" onClick={(e) => e.stopPropagation()}>
                            <div className={`custom-select mini-select ${openDropdown === `social-${index}` ? 'open' : ''}`} onClick={() => setOpenDropdown(openDropdown === `social-${index}` ? null : `social-${index}`)}>
                              <span>{link.platform}</span><ChevronDown size={14} />
                            </div>
                            {openDropdown === `social-${index}` && (
                              <div className="options-dropdown glass-card mini-dropdown">
                                {PLATFORMS.map((p) => (
                                  <div key={p.name} className="option-item" onClick={() => { handleSocialChange(index, 'platform', p.name); setOpenDropdown(null); }}>{getPlatformIcon(p.name)}<span>{p.name}</span></div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="url-input-wrapper dark-box">
                            <div className="platform-icon-box">{getPlatformIcon(link.platform)}</div>
                            <input type="text" placeholder="https://..." value={link.url} onChange={(e) => handleSocialChange(index, 'url', e.target.value)} />
                          </div>
                          <button type="button" className="action-delete-btn" onClick={() => removeSocialLink(index)} disabled={socialLinks.length === 1}><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-secondary add-link-btn" onClick={addSocialLink}><Plus size={18} /> Add Social Link</button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content animate-in">
                  <div className="form-header"><div className="form-header-row"><div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}><Target size={26} className="icon-blue" /><h2>Professional Goal</h2></div></div></div>
                  <div className="input-group"><label className="rich-label"><span><Target size={16} /> Target Role <span className="required-star">*</span></span><small>What position are you applying for?</small></label><input type="text" name="targetRole" placeholder="Accountant" value={formData.targetRole} onChange={handleInputChange} /></div>
                  <div className="input-group"><label className="rich-label"><span><Star size={16} /> Top Skills <span className="required-star">*</span></span><small>List your strongest technical or soft skills (comma separated)</small></label><textarea name="skills" placeholder="Financial Reporting, Bookkeeping..." value={formData.skills} onChange={handleInputChange} rows={4} /></div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-content animate-in">
                  <div className="form-header">
                    <div className="form-header-row">
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Briefcase size={26} className="icon-blue" />
                        <h2>Work Experience</h2>
                      </div>
                      <button type="button" className="skip-btn" onClick={nextStep}>Skip <ChevronRight size={14} /></button>
                    </div>
                  </div>
                  
                  <div className="dynamic-list">
                    <div className="scroll-area single-card-scroll">
                      {experienceList.map((exp, index) => (
                        <div key={index} className="experience-vertical-card animate-in">
                          <button type="button" className="action-delete-btn" onClick={() => removeExperience(index)} disabled={experienceList.length === 1}><Trash2 size={16} /></button>
                          <div className="input-group"><label className="card-label"><Briefcase size={14} /> <span>COMPANY NAME</span></label><input type="text" placeholder="Apex Financial" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} /></div>
                          <div className="input-grid" style={{ marginBottom: 0, gap: '20px' }}>
                            <div className="input-group"><label className="card-label"><User size={14} /> <span>ROLE / POSITION</span></label><input type="text" placeholder="Accounting Intern" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} /></div>
                            <div className="input-group"><label className="card-label"><History size={14} /> <span>DURATION / YEARS</span></label><input type="text" placeholder="2022 - 2023" value={exp.years} onChange={(e) => handleExperienceChange(index, 'years', e.target.value)} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-secondary add-link-btn" onClick={addExperience}><Plus size={18} /> Add Experience</button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="step-content animate-in">
                  <div className="form-header">
                    <div className="form-header-row">
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Terminal size={26} className="icon-purple" />
                        <h2>Key Projects</h2>
                      </div>
                      <button type="button" className="skip-btn" onClick={nextStep}>Skip <ChevronRight size={14} /></button>
                    </div>
                  </div>
                  <div className="dynamic-list">
                    <div className="scroll-area single-card-scroll">
                      {projectList.map((project, index) => (
                        <div key={index} className="experience-vertical-card animate-in">
                          <button type="button" className="action-delete-btn" onClick={() => removeProject(index)} disabled={projectList.length === 1}><Trash2 size={16} /></button>
                          
                          <div className="input-group">
                            <label className="card-label"><Terminal size={14} /> <span>PROJECT TITLE</span></label>
                            <input type="text" placeholder="AI Chatbot / Web App" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                          </div>
                          
                          <div className="input-group">
                            <label className="card-label"><Link size={14} /> <span>PROJECT LINK (OPTIONAL)</span></label>
                            <input type="text" placeholder="https://github.com/yourusername/project" value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                          </div>

                          <div className="input-group">
                            <label className="card-label"><FileText size={14} /> <span>DESCRIPTION</span></label>
                            <textarea 
                              placeholder="Describe what you built and the technologies used (e.g., Built a real-time chat app using React and Socket.io...)" 
                              value={project.description} 
                              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-secondary add-link-btn" onClick={addProject}><Plus size={18} /> Add Project</button>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="step-content animate-in">
                  <div className="form-header"><div className="form-header-row"><div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}><GraduationCap size={26} className="icon-purple" /><h2>Education Details</h2></div><button type="button" className="skip-btn" onClick={nextStep}>Skip <ChevronRight size={14} /></button></div></div>
                  <div className="dynamic-list">
                    <div className="scroll-area single-card-scroll">
                      {educationList.map((edu, index) => (
                        <div key={index} className={`experience-vertical-card animate-in ${openDropdown === `edu-${index}` ? 'z-top' : ''}`}>
                          <button type="button" className="action-delete-btn" onClick={() => removeEducation(index)} disabled={educationList.length === 1}><Trash2 size={16} /></button>
                          <div className="input-group"><label className="card-label"><Briefcase size={14} /> <span>INSTITUTION NAME</span></label><input type="text" placeholder="University of Technology" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} /></div>
                          <div className="input-grid" style={{ marginBottom: 0, gap: '20px' }}>
                            <div className="input-group">
                              <label className="card-label"><GraduationCap size={14} /> <span>DEGREE TYPE</span></label>
                              <div className="entry-type-selector" onClick={(e) => e.stopPropagation()}>
                                <div className={`custom-select ${openDropdown === `edu-${index}` ? 'open' : ''}`} onClick={() => setOpenDropdown(openDropdown === `edu-${index}` ? null : `edu-${index}`)}>
                                  <span>{edu.type}</span><ChevronDown size={14} />
                                </div>
                                {openDropdown === `edu-${index}` && (
                                  <div className="options-dropdown glass-card mini-dropdown">
                                    {EDUCATION_TYPES.map((type) => (
                                      <div key={type} className="option-item" onClick={() => { handleEducationChange(index, 'type', type); setOpenDropdown(null); }}><span>{type}</span></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="input-group"><label className="card-label"><History size={14} /> <span>DURATION / YEARS</span></label><input type="text" placeholder="2018 - 2022" value={edu.years} onChange={(e) => handleEducationChange(index, 'years', e.target.value)} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn-secondary add-link-btn" onClick={addEducation}><Plus size={18} /> Add Education</button>
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="step-content animate-in">
                  <div className="form-header"><div className="form-header-row"><div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}><Star size={26} className="icon-blue" /><h2>Achievements & Wins</h2></div></div></div>
                  <div className="input-group">
                    <label className="rich-label"><span>Key Achievements</span><small>Major awards, certifications, or notable successes.</small></label>
                    <textarea name="achievements" placeholder="Your major wins..." value={formData.achievements} onChange={handleInputChange} rows={8} />
                  </div>
                </div>
              )}

            </form>

            <div className={`wizard-actions ${currentStep === 1 ? 'single-button' : 'dual-buttons'}`}>
              {currentStep > 1 && <button type="button" className="btn-secondary" onClick={prevStep}><ChevronLeft size={20} /> Back</button>}
              {currentStep < 7 ? (
                <button type="button" className="btn-primary" onClick={nextStep}>Next <ChevronRight size={20} /></button>
              ) : (
                <button type="button" className="btn-primary" disabled={isLoading} onClick={handleSubmit}>
                  {isLoading ? (
                    <span className="loading-wrapper"><Loader2 className="animate-spin" size={20} /> Architecting...</span>
                  ) : (
                    <>Generate <ChevronRight size={20} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="right-side">
          {resume ? (
            <div className="preview-container animate-in">
              <div className="preview-header-actions-bar">
                <div className="action-group-right">
                  <button className="preview-action-btn" onClick={downloadPDF}><Download size={18} /> PDF</button>
                  <button className="preview-action-btn" onClick={downloadJSON}><FileJson size={18} /> JSON</button>
                </div>
              </div>
              <div className="resume-paper-wrapper">
                <div className="resume-paper premium-paper" ref={resumeRef}>
                  <div className="resume-header-section centered">
                    <h1 className="resume-name">{formData.name || 'Your Name'}</h1>
                    <div className="contact-info-unified">
                      <div className="contact-unit"><Mail size={12} color="#5d175d" /> <span>{formData.email}</span></div>
                      <div className="contact-unit"><Phone size={12} color="#5d175d" /> <span>{formData.mobile}</span></div>
                      {formData.address && <div className="contact-unit"><MapPin size={12} color="#5d175d" /> <span>{formData.address}</span></div>}
                      {socialLinks.filter(l => l.url).map((link, index) => (
                        <div key={index} className="contact-unit">
                          {getPlatformIcon(link.platform, 12, true)}
                          <span>{formatSocialUrl(link.url, link.platform)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="resume-section">
                    <h3 className="section-header-title"><FileText size={16} className="section-icon" /> PROFESSIONAL SUMMARY</h3>
                    <p className="summary-text-professional">{resume?.summary || 'No summary available.'}</p>
                  </div>

                  {resume?.skills && resume.skills.length > 0 && resume.skills.some(s => s.trim()) && (
                    <div className="resume-section">
                      <h3 className="section-header-title"><Target size={16} className="section-icon" /> EXPERTISE</h3>
                      <div className="skills-grid-professional">
                        {resume.skills.map((skill, i) => <span key={i} className="skill-badge-professional">{skill}</span>)}
                      </div>
                    </div>
                  )}

                  {resume?.experience && resume.experience.length > 0 && resume.experience.some(exp => exp.title || exp.company) && (
                    <div className="resume-section">
                      <h3 className="section-header-title"><Briefcase size={16} className="section-icon" /> PROFESSIONAL EXPERIENCE</h3>
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="experience-item-pro">
                          <div className="exp-header-pro">
                            <span className="exp-title-pro">{exp.title}</span>
                            <span className="exp-date-pro">{exp.years}</span>
                          </div>
                          <div className="exp-company-pro">{exp.company}</div>
                          {exp.description && (
                            <ul className="exp-bullets-pro">
                              {Array.isArray(exp.description) 
                                ? exp.description.map((desc, j) => <li key={j}>{desc}</li>)
                                : <li>{exp.description}</li>
                              }
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resume?.projects && resume.projects.length > 0 && (
                    <div className="resume-section">
                      <h3 className="section-header-title"><Terminal size={16} className="section-icon" /> KEY PROJECTS</h3>
                      {resume.projects.map((proj, i) => (
                        <div key={i} className="experience-item-pro">
                          <div className="exp-header-pro">
                            <span className="exp-title-pro">{proj.title}</span>
                            {proj.link && <span className="exp-date-pro" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{proj.link}</span>}
                          </div>
                          {proj.description && (
                            <ul className="exp-bullets-pro">
                              {Array.isArray(proj.description)
                                ? proj.description.map((desc, j) => <li key={j}>{desc}</li>)
                                : <li>{proj.description}</li>
                              }
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resume?.education && resume.education.length > 0 && resume.education.some(edu => edu.institution || edu.degree) && (
                    <div className="resume-section">
                      <h3 className="section-header-title"><GraduationCap size={16} className="section-icon" /> EDUCATION</h3>
                      {resume.education.map((edu, i) => (
                        <div key={i} className="education-item-pro">
                          <div className="edu-header-pro">
                            <span className="edu-school-pro">{edu.institution}</span>
                            <span className="edu-date-pro">{edu.years}</span>
                          </div>
                          <div className="edu-degree-pro">{edu.degree}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resume?.achievements && resume.achievements.length > 0 && resume.achievements.some(a => a.trim()) && (
                    <div className="resume-section">
                      <h3 className="section-header-title"><Award size={16} className="section-icon" /> NOTABLE ACHIEVEMENTS</h3>
                      <ul className="achievements-list-pro">
                        {resume.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="placeholder-card"><FileText size={48} className="icon-muted" /><h3>Ready to Architect?</h3><p>Your high-fidelity resume will appear here once generated.</p></div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
