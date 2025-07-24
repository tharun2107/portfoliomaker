import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Stars, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Planet component with orbit animation
function Planet({ position, color, size, label, data, onClick, isActive }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      // Add subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      <Sphere
        ref={meshRef}
        position={position}
        args={[size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Sphere>
      
      {hovered && (
        <Html position={[position[0], position[1] + size + 0.5, position[2]]}>
          <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Central Sun component
function Sun({ data }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#FFA500" 
          emissive="#FF4500"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      <Html position={[0, 2.5, 0]}>
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
          <p className="text-lg">{data.email}</p>
        </div>
      </Html>
    </group>
  );
}

// Section detail panel
function SectionPanel({ section, data, onClose }) {
  const getSectionContent = () => {
    switch (section) {
      case 'about':
        return (
          <div>
            <h3 className="text-2xl font-bold mb-4">About Me</h3>
            <p className="text-gray-300 mb-4">
              {data.location && `📍 ${data.location}`}
            </p>
            <p className="text-gray-300 mb-4">
              {data.phone && `📞 ${data.phone}`}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.socials || {}).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 capitalize"
                  >
                    🔗 {platform}
                  </a>
                )
              ))}
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div>
            <h3 className="text-2xl font-bold mb-4">Skills & Technologies</h3>
            <div className="grid grid-cols-3 gap-3">
              {(data.skills || []).map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-full text-center text-sm font-medium"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'experience':
        return (
          <div>
            <h3 className="text-2xl font-bold mb-4">Experience</h3>
            <div className="space-y-6">
              {(data.experience || []).map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-semibold text-blue-300">{exp.title}</h4>
                  <p className="text-lg text-gray-300">{exp.company}</p>
                  <p className="text-gray-400 mb-2">{exp.duration}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div>
            <h3 className="text-2xl font-bold mb-4">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.projects || []).map((project, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-xl font-semibold text-green-300 mb-2">{project.name}</h4>
                  <p className="text-gray-300 mb-3">{project.description}</p>
                  <p className="text-sm text-gray-400 mb-3">
                    <strong>Tech:</strong> {project.technologies}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      🔗 View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'education':
        return (
          <div>
            <h3 className="text-2xl font-bold mb-4">Education</h3>
            <div className="space-y-4">
              {(data.education || []).map((edu, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-semibold text-purple-300">{edu.degree}</h4>
                  <p className="text-lg text-gray-300">{edu.institution}</p>
                  <p className="text-gray-400">{edu.year}</p>
                  {edu.details && <p className="text-gray-300 mt-2">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 h-full w-1/3 bg-black bg-opacity-90 backdrop-blur-sm p-6 overflow-y-auto z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-red-400"
      >
        ✕
      </button>
      
      <div className="mt-8 text-white">
        {getSectionContent()}
      </div>
    </motion.div>
  );
}

export default function SolarVerse({ data }) {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    { id: 'about', label: 'About', position: [3, 0, 0], color: '#4A90E2', size: 0.3 },
    { id: 'skills', label: 'Skills', position: [-3, 1, 2], color: '#7B68EE', size: 0.4 },
    { id: 'experience', label: 'Experience', position: [0, 2, -3], color: '#32CD32', size: 0.5 },
    { id: 'projects', label: 'Projects', position: [-2, -1, -2], color: '#FF6347', size: 0.4 },
    { id: 'education', label: 'Education', position: [2, -2, 1], color: '#DDA0DD', size: 0.3 },
  ];

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Stars background */}
        <Stars radius={300} depth={60} count={20000} factor={7} fade />
        
        {/* Central Sun */}
        <Sun data={data} />
        
        {/* Planets for each section */}
        {sections.map((section) => (
          <Planet
            key={section.id}
            position={section.position}
            color={section.color}
            size={section.size}
            label={section.label}
            data={data}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
        
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white z-40">
        <div className="bg-black bg-opacity-50 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">🌌 SolarVerse Portfolio</h2>
          <p className="text-sm text-gray-300">Click on planets to explore sections</p>
          <p className="text-sm text-gray-300">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>

      {/* Section Panel */}
      <AnimatePresence>
        {activeSection && (
          <SectionPanel
            section={activeSection}
            data={data}
            onClose={() => setActiveSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}