import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe
} from 'lucide-react';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const ResumePreview = ({ resumeData, template = 'classic' }) => {
  if (!resumeData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Resume preview will appear here</p>
          <p className="text-sm mt-2">Start filling out the form to see your resume</p>
        </div>
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects, certifications, languages } = resumeData;

  // Render the appropriate template
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate resumeData={resumeData} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resumeData} />;
      default:
        return <ClassicTemplate resumeData={resumeData} />;
    }
  };

  return renderTemplate();
};

export default ResumePreview;
