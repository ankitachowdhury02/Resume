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

const ModernTemplate = ({ resumeData }) => {
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
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          {personalInfo?.profilePicture && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <img 
                src={personalInfo.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-blue-100 mb-4">
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

            <div className="flex items-center space-x-4">
              {personalInfo?.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {personalInfo?.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {personalInfo?.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
            Professional Summary
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Skills
              </h2>
              <div className="space-y-4">
                {skills.reduce((acc, skill, index) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {}).map((categorySkills, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
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
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
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

          {/* Education */}
          {education && education.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate || 'Present'}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
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

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-gray-600 text-xs">{cert.issuer}</p>
                    <p className="text-gray-500 text-xs">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-600">{exp.location}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p className="font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                Projects
              </h2>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-6 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
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
                              <Github className="w-4 h-4" />
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
                      <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
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
        </div>
      </div>
    </motion.div>
  );
};

export default ModernTemplate;
