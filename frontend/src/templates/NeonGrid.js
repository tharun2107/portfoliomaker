import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// Particle background component
function ParticleBackground() {
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00FFFF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FFFF';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      id="particles-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
    />
  );
}

// Animated skill card
function SkillCard({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 10 }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-400/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <h3 className="text-cyan-300 font-semibold text-center">{skill}</h3>
        </div>
      </div>
    </motion.div>
  );
}

// Animated project card
function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-3">{project.name}</h3>
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="mb-4">
            <span className="text-sm text-cyan-400 font-semibold">Technologies: </span>
            <span className="text-sm text-gray-300">{project.technologies}</span>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <FaGlobe /> View Project
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Experience timeline item
function ExperienceItem({ experience, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.3 }}
      className="relative pl-8 pb-8"
    >
      <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
      <div className="absolute left-2 top-4 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent"></div>
      
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
        <p className="text-cyan-400 font-semibold mb-2">{experience.company}</p>
        <p className="text-gray-400 text-sm mb-3">{experience.duration}</p>
        <p className="text-gray-300">{experience.description}</p>
      </div>
    </motion.div>
  );
}

export default function NeonGrid({ data }) {
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', label: 'About', icon: '👨‍💻' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'education', label: 'Education', icon: '🎓' },
  ];

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return <FaGithub />;
      case 'linkedin': return <FaLinkedin />;
      case 'website': return <FaGlobe />;
      default: return <FaGlobe />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30 z-50"
        >
          <div className="container mx-auto px-6 py-4">
            <nav className="flex justify-center space-x-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="pt-20 pb-10">
          <AnimatePresence mode="wait">
            {/* About Section */}
            {activeSection === 'about' && (
              <motion.section
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto px-6 py-12"
              >
                <div className="text-center mb-12">
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {data.name}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 text-gray-300 mb-8"
                  >
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-cyan-400" />
                      {data.email}
                    </div>
                    {data.phone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-cyan-400" />
                        {data.phone}
                      </div>
                    )}
                    {data.location && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-cyan-400" />
                        {data.location}
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center gap-6"
                  >
                    {Object.entries(data.socials || {}).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-3xl text-gray-400 hover:text-cyan-400 transition-colors transform hover:scale-110"
                        >
                          {getSocialIcon(platform)}
                        </a>
                      )
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <motion.section
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto px-6 py-12"
              >
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Skills & Technologies
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {(data.skills || []).map((skill, index) => (
                    <SkillCard key={index} skill={skill} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <motion.section
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto px-6 py-12"
              >
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Experience
                </h2>
                <div className="max-w-4xl mx-auto">
                  {(data.experience || []).map((exp, index) => (
                    <ExperienceItem key={index} experience={exp} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <motion.section
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto px-6 py-12"
              >
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(data.projects || []).map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <motion.section
                key="education"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto px-6 py-12"
              >
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Education
                </h2>
                <div className="max-w-4xl mx-auto space-y-8">
                  {(data.education || []).map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                      <p className="text-purple-400 font-semibold mb-2">{edu.institution}</p>
                      <p className="text-gray-400 mb-3">{edu.year}</p>
                      {edu.details && <p className="text-gray-300">{edu.details}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}