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

const ClassicTemplate = ({ resumeData }) => {
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
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 mb-4">
          {personalInfo?.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo?.city || personalInfo?.state) && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{[personalInfo.city, personalInfo.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center space-x-4">
          {personalInfo?.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {personalInfo?.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {personalInfo?.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-gray-800 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                        <p className="text-gray-700 font-medium">{edu.institution}</p>
                        {edu.fieldOfStudy && (
                          <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="font-medium">{edu.startDate} - {edu.endDate || 'Present'}</p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Skills
              </h2>
              <div className="space-y-3">
                {skills.reduce((acc, skill, index) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {}).map((categorySkills, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      {Object.keys(skills.reduce((acc, skill) => {
                        const category = skill.category || 'Other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill);
                        return acc;
                      }, {}))[categoryIndex]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded border"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-sm text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-gray-800 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-600">{exp.location}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-gray-800 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live Demo</span>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
                            >
                              <Github className="w-3 h-3" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>
                      {(project.startDate || project.endDate) && (
                        <div className="text-right text-sm text-gray-600">
                          <p>{project.startDate} - {project.endDate || 'Present'}</p>
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClassicTemplate;
