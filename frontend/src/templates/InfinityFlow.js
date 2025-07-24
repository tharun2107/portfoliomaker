import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowDown } from 'react-icons/fa';

// Smooth scroll setup
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const startValue = 0;
    const endValue = parseInt(value) || 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={countRef}>{count}</span>;
}

// Section wrapper with scroll animations
function ScrollSection({ children, className = "", background = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center relative ${className}`}
      style={{ background }}
    >
      {children}
    </motion.section>
  );
}

// Hero section
function HeroSection({ data }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -500]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <ScrollSection background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      <motion.div style={{ y, opacity }} className="text-center text-white z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
        >
          {data.name}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl mb-8 font-light"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-purple-100">
            <div className="flex items-center gap-2">
              <FaEnvelope />
              {data.email}
            </div>
            {data.location && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                {data.location}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex justify-center gap-6 mb-12"
        >
          {Object.entries(data.socials || {}).map(([platform, url]) => (
            url && (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl hover:text-purple-200 transition-colors transform hover:scale-110"
              >
                {platform === 'github' && <FaGithub />}
                {platform === 'linkedin' && <FaLinkedin />}
                {platform === 'website' && <FaGlobe />}
              </a>
            )
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl text-purple-200"
        >
          <FaArrowDown />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </ScrollSection>
  );
}

// Skills section with morphing background
function SkillsSection({ data }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <ScrollSection 
      ref={ref}
      background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      className="relative"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-30"
        css={{
          background: "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        }}
      />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-white mb-12"
        >
          Skills & Expertise
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(data.skills || []).map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotateY: 180 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white font-semibold border border-white/30"
            >
              <div className="transform-gpu">
                {skill}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats counters */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="text-4xl font-bold mb-2">
              <AnimatedCounter value={data.projects?.length || 5} />+
            </div>
            <div className="text-lg">Projects Completed</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >
            <div className="text-4xl font-bold mb-2">
              <AnimatedCounter value={data.skills?.length || 10} />+
            </div>
            <div className="text-lg">Technologies</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-white"
          >
            <div className="text-4xl font-bold mb-2">
              <AnimatedCounter value={data.experience?.length || 3} />+
            </div>
            <div className="text-lg">Years Experience</div>
          </motion.div>
        </div>
      </div>
    </ScrollSection>
  );
}

// Experience section with timeline
function ExperienceSection({ data }) {
  return (
    <ScrollSection background="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800 text-center mb-16"
        >
          Journey Timeline
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
          
          <div className="space-y-12">
            {(data.experience || []).map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="w-1/2 pr-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-400">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{exp.title}</h3>
                    <p className="text-purple-600 font-semibold mb-2">{exp.company}</p>
                    <p className="text-gray-500 text-sm mb-3">{exp.duration}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-purple-400 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                
                <div className="w-1/2 pl-8"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}

// Projects showcase
function ProjectsSection({ data }) {
  return (
    <ScrollSection background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-16"
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects || []).map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, rotateX: -90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -20, scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transform-gpu"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{project.name}</h3>
              <p className="text-gray-200 mb-4">{project.description}</p>
              <p className="text-sm text-purple-200 mb-4">
                <strong>Tech:</strong> {project.technologies}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
                >
                  <FaGlobe />
                  View Project
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}

// Contact section
function ContactSection({ data }) {
  return (
    <ScrollSection background="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white mb-12"
        >
          Let's Connect
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20"
        >
          <div className="space-y-4 text-white">
            <div className="flex items-center justify-center gap-3">
              <FaEnvelope className="text-blue-300" />
              <span>{data.email}</span>
            </div>
            {data.phone && (
              <div className="flex items-center justify-center gap-3">
                <FaPhone className="text-blue-300" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center justify-center gap-3">
                <FaMapMarkerAlt className="text-blue-300" />
                <span>{data.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-6 mt-8">
            {Object.entries(data.socials || {}).map(([platform, url]) => (
              url && (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-3xl text-white hover:text-blue-300 transition-colors"
                >
                  {platform === 'github' && <FaGithub />}
                  {platform === 'linkedin' && <FaLinkedin />}
                  {platform === 'website' && <FaGlobe />}
                </motion.a>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </ScrollSection>
  );
}

export default function InfinityFlow({ data }) {
  // useSmoothScroll(); // Uncomment when Lenis is properly imported

  return (
    <div className="relative">
      {/* Sticky CTA */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
        >
          Get In Touch
        </motion.button>
      </motion.div>

      {/* Sections */}
      <HeroSection data={data} />
      <SkillsSection data={data} />
      <ExperienceSection data={data} />
      <ProjectsSection data={data} />
      <ContactSection data={data} />
    </div>
  );
}