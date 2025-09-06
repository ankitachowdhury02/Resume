import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Save, 
  Download, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  Upload,
  Image
} from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../services/api';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import RichTextEditor from './RichTextEditor';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        linkedin: '',
        github: '',
        website: '',
        summary: '',
        profilePicture: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    }
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: 'certifications'
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages'
  });

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.getResume(id);
      const resume = response.data.resume;
      
      // Set form values
      Object.keys(resume).forEach(key => {
        if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
          setValue(key, resume[key]);
        }
      });
    } catch (error) {
      toast.error('Failed to fetch resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (id) {
        await resumeAPI.updateResume(id, data);
        toast.success('Resume updated successfully');
      } else {
        await resumeAPI.createResume(data);
        toast.success('Resume created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('resume-preview');
      if (!element) {
        toast.error('Resume preview not found');
        return;
      }

      toast.loading('Generating PDF...', { id: 'pdf-generation' });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

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

      const fileName = `${watch('personalInfo.firstName') || 'Resume'}_${watch('personalInfo.lastName') || 'Resume'}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>Templates</span>
              </button>
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Resume'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Template Selector */}
        {showTemplateSelector && (
          <div className="mb-8">
            <TemplateSelector
              resumeData={watch()}
              onTemplateChange={setSelectedTemplate}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Resume Title */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Title</h2>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  placeholder="e.g., Software Engineer Resume"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                
                {/* Profile Picture Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    {watch('personalInfo.profilePicture') && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                        <img 
                          src={watch('personalInfo.profilePicture')} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        {...register('personalInfo.profilePicture')}
                        type="url"
                        placeholder="Enter image URL or upload a file"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a URL or use the file upload below
                      </p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setValue('personalInfo.profilePicture', event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      {...register('personalInfo.firstName', { required: 'First name is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      {...register('personalInfo.lastName', { required: 'Last name is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      {...register('personalInfo.email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      {...register('personalInfo.phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    {...register('personalInfo.address')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      {...register('personalInfo.city')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      {...register('personalInfo.state')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      {...register('personalInfo.zipCode')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      {...register('personalInfo.linkedin')}
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      {...register('personalInfo.github')}
                      type="url"
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      {...register('personalInfo.website')}
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <RichTextEditor
                    content={watch('personalInfo.summary') || ''}
                    onChange={(content) => setValue('personalInfo.summary', content)}
                    placeholder="Brief summary of your professional background and key achievements..."
                  />
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendEducation({
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: '',
                      endDate: '',
                      gpa: '',
                      description: ''
                    })}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                
                {educationFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Education #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                        <input
                          {...register(`education.${index}.institution`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                        <input
                          {...register(`education.${index}.degree`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                        <input
                          {...register(`education.${index}.fieldOfStudy`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                        <input
                          {...register(`education.${index}.gpa`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          {...register(`education.${index}.startDate`)}
                          type="text"
                          placeholder="e.g., Sep 2020"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          {...register(`education.${index}.endDate`)}
                          type="text"
                          placeholder="e.g., May 2024"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        {...register(`education.${index}.description`)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendExperience({
                      company: '',
                      position: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      description: '',
                      achievements: []
                    })}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Experience #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          {...register(`experience.${index}.company`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <input
                          {...register(`experience.${index}.position`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          {...register(`experience.${index}.location`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            {...register(`experience.${index}.current`)}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">Currently working here</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          {...register(`experience.${index}.startDate`)}
                          type="text"
                          placeholder="e.g., Jan 2023"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          {...register(`experience.${index}.endDate`)}
                          type="text"
                          placeholder="e.g., Present"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        {...register(`experience.${index}.description`)}
                        rows={4}
                        placeholder="Describe your role, responsibilities, and key achievements..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendSkill({
                      name: '',
                      level: 'Intermediate',
                      category: 'Technical'
                    })}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                
                {skillFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Skill #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                        <input
                          {...register(`skills.${index}.name`)}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                        <select
                          {...register(`skills.${index}.level`)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          {...register(`skills.${index}.category`)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Languages">Languages</option>
                          <option value="Tools">Tools</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendProject({
                      name: '',
                      description: '',
                      technologies: [],
                      url: '',
                      githubUrl: '',
                      startDate: '',
                      endDate: ''
                    })}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                
                {projectFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Project #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                      <input
                        {...register(`projects.${index}.name`)}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        {...register(`projects.${index}.description`)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                        <input
                          {...register(`projects.${index}.url`)}
                          type="url"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                        <input
                          {...register(`projects.${index}.githubUrl`)}
                          type="url"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 lg:h-fit"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Preview</h2>
              <div id="resume-preview" className="space-y-6">
                <ResumePreview resumeData={watch()} template={selectedTemplate} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
