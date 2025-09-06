import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Eye, 
  User,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { resumeAPI } from '../services/api';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const PublicResumeView = () => {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  useEffect(() => {
    fetchPublicResume();
  }, [slug]);

  const fetchPublicResume = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getPublicResume(slug);
      setResume(response.data.resume);
    } catch (error) {
      setError('Resume not found or is not public');
      console.error('Error fetching public resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('public-resume-preview');
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

      const fileName = `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_Resume.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - Resume`,
          text: `Check out ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}'s resume`,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate resumeData={resume} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resume} />;
      default:
        return <ClassicTemplate resumeData={resume} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This resume is not available or has been made private.'}</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
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
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                </h1>
                <p className="text-sm text-gray-600">Public Resume</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Template Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Resume Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div id="public-resume-preview">
            {renderTemplate()}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Resume created with Resume Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <span>Create your own resume</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicResumeView;
