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

const MinimalTemplate = ({ resumeData }) => {
  if (!resumeData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Resume preview will appear here</p>
        </div>
      </div>
    );
  }

  const { personalInfo, education, experience, skills, projects, certifications, languages } = resumeData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
    >
      {/* Header - Minimal */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-6">
          {personalInfo?.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo?.city || personalInfo?.state) && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{[personalInfo.city, personalInfo.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center space-x-6">
          {personalInfo?.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-12 text-center">
          <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.location && (
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  )}
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mt-4">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Projects
          </h2>
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-3">
                    {project.description}
                  </p>
                )}
                <div className="flex justify-center items-center space-x-4">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      GitHub
                    </a>
                  )}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center tracking-wide">
            Languages
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {languages.map((lang, index) => (
              <div key={index} className="text-center">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <p className="text-sm text-gray-500">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MinimalTemplate;
