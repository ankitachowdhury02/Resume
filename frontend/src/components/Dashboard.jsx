import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Copy, 
  Star,
  User,
  LogOut,
  Settings,
  Search,
  Filter,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    const filtered = resumes.filter(resume =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResumes(filtered);
  }, [resumes, searchTerm]);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data.resumes);
    } catch (error) {
      toast.error('Failed to fetch resumes');
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleDuplicateResume = async (id) => {
    try {
      const response = await resumeAPI.duplicateResume(id);
      setResumes([response.data.resume, ...resumes]);
      toast.success('Resume duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await resumeAPI.setDefaultResume(id);
      setResumes(resumes.map(resume => ({
        ...resume,
        isDefault: resume._id === id
      })));
      toast.success('Default resume updated');
    } catch (error) {
      toast.error('Failed to set default resume');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleTogglePublic = async (resume) => {
    try {
      const response = await resumeAPI.togglePublicResume(resume._id);
      const updatedResume = response.data.resume;
      
      setResumes(prevResumes => 
        prevResumes.map(r => r._id === resume._id ? updatedResume : r)
      );
      
      if (updatedResume.isPublic) {
        const publicUrl = `${window.location.origin}/public/${updatedResume.publicSlug}`;
        toast.success(
          <div>
            <p>Resume made public!</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                toast.success('Link copied to clipboard!');
              }}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Copy public link
            </button>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success('Resume made private');
      }
    } catch (error) {
      toast.error('Failed to update resume visibility');
      console.error('Error toggling public status:', error);
    }
  };

  const handleShareResume = (resume) => {
    if (resume.isPublic && resume.publicSlug) {
      const publicUrl = `${window.location.origin}/public/${resume.publicSlug}`;
      
      if (navigator.share) {
        navigator.share({
          title: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - Resume`,
          text: `Check out ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}'s resume`,
          url: publicUrl
        }).catch(() => {
          copyToClipboard(publicUrl);
        });
      } else {
        copyToClipboard(publicUrl);
      }
    } else {
      toast.error('Please make the resume public first');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleDownloadPDF = async (resume) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' });

      // Create a temporary element for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Generate HTML content for the resume
      tempDiv.innerHTML = generateResumeHTML(resume);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${resume.personalInfo?.firstName || 'Resume'}_${resume.personalInfo?.lastName || 'Resume'}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
  };

  const generateResumeHTML = (resume) => {
    const { personalInfo, education, experience, skills, projects, certifications, languages } = resume;
    
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
          <h1 style="font-size: 32px; margin: 0; color: #1f2937;">${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}</h1>
          <div style="margin-top: 10px; color: #6b7280;">
            ${personalInfo?.email ? `<span>${personalInfo.email}</span>` : ''}
            ${personalInfo?.phone ? `<span style="margin-left: 20px;">${personalInfo.phone}</span>` : ''}
            ${personalInfo?.city ? `<span style="margin-left: 20px;">${personalInfo.city}, ${personalInfo?.state || ''}</span>` : ''}
          </div>
          <div style="margin-top: 10px;">
            ${personalInfo?.linkedin ? `<a href="${personalInfo.linkedin}" style="color: #3b82f6; text-decoration: none; margin-right: 15px;">LinkedIn</a>` : ''}
            ${personalInfo?.github ? `<a href="${personalInfo.github}" style="color: #3b82f6; text-decoration: none; margin-right: 15px;">GitHub</a>` : ''}
            ${personalInfo?.website ? `<a href="${personalInfo.website}" style="color: #3b82f6; text-decoration: none;">Website</a>` : ''}
          </div>
        </div>

        ${personalInfo?.summary ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Professional Summary</h2>
            <p style="margin-top: 10px;">${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${education && education.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Education</h2>
            ${education.map(edu => `
              <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px;">${edu.degree}</h3>
                    <p style="margin: 5px 0; color: #6b7280;">${edu.institution}</p>
                    ${edu.fieldOfStudy ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${edu.fieldOfStudy}</p>` : ''}
                  </div>
                  <div style="text-align: right; color: #6b7280; font-size: 14px;">
                    <p style="margin: 0;">${edu.startDate} - ${edu.endDate || 'Present'}</p>
                    ${edu.gpa ? `<p style="margin: 5px 0 0 0;">GPA: ${edu.gpa}</p>` : ''}
                  </div>
                </div>
                ${edu.description ? `<p style="margin-top: 10px; font-size: 14px;">${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Work Experience</h2>
            ${experience.map(exp => `
              <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px;">${exp.position}</h3>
                    <p style="margin: 5px 0; color: #6b7280;">${exp.company}</p>
                    ${exp.location ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${exp.location}</p>` : ''}
                  </div>
                  <div style="text-align: right; color: #6b7280; font-size: 14px;">
                    <p style="margin: 0;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                </div>
                ${exp.description ? `<p style="margin-top: 10px; font-size: 14px;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Skills</h2>
            <div style="margin-top: 10px;">
              ${skills.map(skill => `
                <span style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 14px;">${skill.name}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Projects</h2>
            ${projects.map(project => `
              <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <h3 style="margin: 0; font-size: 16px;">${project.name}</h3>
                    <div style="margin-top: 5px;">
                      ${project.url ? `<a href="${project.url}" style="color: #3b82f6; text-decoration: none; margin-right: 15px; font-size: 14px;">Live Demo</a>` : ''}
                      ${project.githubUrl ? `<a href="${project.githubUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">GitHub</a>` : ''}
                    </div>
                  </div>
                  ${(project.startDate || project.endDate) ? `
                    <div style="text-align: right; color: #6b7280; font-size: 14px;">
                      <p style="margin: 0;">${project.startDate} - ${project.endDate || 'Present'}</p>
                    </div>
                  ` : ''}
                </div>
                ${project.description ? `<p style="margin-top: 10px; font-size: 14px;">${project.description}</p>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                  <div style="margin-top: 10px;">
                    ${project.technologies.map(tech => `
                      <span style="display: inline-block; background: #e5e7eb; color: #374151; padding: 2px 6px; margin: 1px; border-radius: 3px; font-size: 12px;">${tech}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${certifications && certifications.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Certifications</h2>
            ${certifications.map(cert => `
              <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <div>
                  <h3 style="margin: 0; font-size: 16px;">${cert.name}</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${cert.issuer}</p>
                </div>
                <div style="text-align: right; color: #6b7280; font-size: 14px;">
                  <p style="margin: 0;">${cert.date}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${languages && languages.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Languages</h2>
            <div style="margin-top: 10px;">
              ${languages.map(lang => `
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span style="font-weight: 500;">${lang.name}</span>
                  <span style="color: #6b7280; font-size: 14px;">${lang.proficiency}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ResumeCraft</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your resumes and create new ones to land your dream job.
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/resume-builder"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Resume</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
          </div>
        </motion.div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first resume to get started'
              }
            </p>
            {!searchTerm && (
              <Link to="/resume-builder" className="btn-primary">
                Create Your First Resume
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card p-6 group hover:shadow-xl transition-all duration-300"
              >
                {/* Resume Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  {resume.isDefault && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  )}
                </div>

                {/* Resume Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Updated:</span>
                    <span className="ml-2">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Sections:</span>
                    <span className="ml-2">
                      {[
                        resume.education?.length > 0 && 'Education',
                        resume.experience?.length > 0 && 'Experience',
                        resume.skills?.length > 0 && 'Skills',
                        resume.projects?.length > 0 && 'Projects'
                      ].filter(Boolean).length} completed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/resume-builder/${resume._id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit Resume"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDuplicateResume(resume._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteResume(resume._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume._id)}
                        className="text-xs text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Set as Default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleTogglePublic(resume)}
                      className={`p-2 rounded-lg transition-colors ${
                        resume.isPublic 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={resume.isPublic ? 'Make Private' : 'Make Public'}
                    >
                      {resume.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleShareResume(resume)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share Resume"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDownloadPDF(resume)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
