import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Accordion component for expandable sections
function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Timeline component for experience and education
function TimelineItem({ item, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
      <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gray-300 last:hidden"></div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        {type === 'experience' ? (
          <>
            <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
            <p className="text-blue-600 font-medium">{item.company}</p>
            <p className="text-gray-500 text-sm mb-2">{item.duration}</p>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </>
        ) : (
          <>
            <h4 className="font-semibold text-gray-900 text-lg">{item.degree}</h4>
            <p className="text-blue-600 font-medium">{item.institution}</p>
            <p className="text-gray-500 text-sm mb-2">{item.year}</p>
            {item.details && <p className="text-gray-700">{item.details}</p>}
          </>
        )}
      </div>
    </motion.div>
  );
}

// Project card component
function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <h4 className="font-semibold text-gray-900 text-xl mb-3">{project.name}</h4>
      <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
      
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-500 block mb-2">Technologies:</span>
        <p className="text-gray-700">{project.technologies}</p>
      </div>
      
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <FaGlobe className="text-sm" />
          View Project
        </a>
      )}
    </motion.div>
  );
}

// Skill tag component
function SkillTag({ skill, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
    >
      {skill}
    </motion.span>
  );
}

export default function ProClassic({ data }) {
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return <FaGithub />;
      case 'linkedin': return <FaLinkedin />;
      case 'website': return <FaGlobe />;
      default: return <FaGlobe />;
    }
  };

  const handleDownloadPDF = () => {
    // This would trigger PDF generation/download
    alert('PDF download feature would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8"
          >
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
                {data.name ? data.name.charAt(0) : 'U'}
              </div>
              <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FaEnvelope className="text-sm" />
                  <span className="text-sm">{data.email}</span>
                </div>
                {data.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <FaPhone className="text-sm" />
                    <span className="text-sm">{data.phone}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{data.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {Object.keys(data.socials || {}).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Connect</h3>
                <div className="space-y-3">
                  {Object.entries(data.socials || {}).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {getSocialIcon(platform)}
                        </span>
                        <span className="capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Download PDF Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadPDF}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <FaDownload />
              Download PDF
            </motion.button>
          </motion.aside>

          {/* Main Content */}
          <main className="lg:w-2/3 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Skills Section */}
              {data.skills && data.skills.length > 0 && (
                <Accordion title="Skills & Expertise" defaultOpen={true}>
                  <div className="flex flex-wrap">
                    {data.skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} index={index} />
                    ))}
                  </div>
                </Accordion>
              )}

              {/* Experience Section */}
              {data.experience && data.experience.length > 0 && (
                <Accordion title="Professional Experience" defaultOpen={true}>
                  <div className="space-y-0">
                    {data.experience.map((exp, index) => (
                      <TimelineItem key={index} item={exp} type="experience" />
                    ))}
                  </div>
                </Accordion>
              )}

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <Accordion title="Projects & Portfolio">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects.map((project, index) => (
                      <ProjectCard key={index} project={project} index={index} />
                    ))}
                  </div>
                </Accordion>
              )}

              {/* Education Section */}
              {data.education && data.education.length > 0 && (
                <Accordion title="Education & Qualifications">
                  <div className="space-y-0">
                    {data.education.map((edu, index) => (
                      <TimelineItem key={index} item={edu} type="education" />
                    ))}
                  </div>
                </Accordion>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}