import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Page Component
const Home = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [deploymentResult, setDeploymentResult] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/resume/parse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setParsedData(response.data.parsed_data);
        setCurrentStep(2);
      } else {
        alert('Failed to parse resume. Please try again.');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('Error parsing resume. Please check your file and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep(3);
  };

  const handleDeploy = async () => {
    if (!parsedData || !selectedTemplate) return;

    setIsLoading(true);

    try {
      const deployData = {
        username: parsedData.name || 'user',
        selected_template: selectedTemplate.id,
        parsed_resume: parsedData
      };

      const response = await axios.post(`${API}/portfolio/deploy`, deployData);

      if (response.data.success) {
        setDeploymentResult(response.data);
        setCurrentStep(4);
      } else {
        alert('Failed to deploy portfolio. Please try again.');
      }
    } catch (error) {
      console.error('Error deploying portfolio:', error);
      alert('Error deploying portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setParsedData(null);
    setSelectedTemplate(null);
    setDeploymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Portfolio Maker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your resume into a stunning portfolio website in minutes using AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Upload Your Resume</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700">
                        {isLoading ? 'Processing...' : 'Click to upload your resume'}
                      </p>
                      <p className="text-gray-500">PDF or DOCX files only</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && parsedData && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Resume Parsed Successfully!</h2>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Info</h3>
                    <p><strong>Name:</strong> {parsedData.name || 'Not found'}</p>
                    <p><strong>Email:</strong> {parsedData.email || 'Not found'}</p>
                    <p><strong>Phone:</strong> {parsedData.phone || 'Not found'}</p>
                    <p><strong>Location:</strong> {parsedData.location || 'Not found'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills && parsedData.skills.length > 0 ? (
                        parsedData.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills found</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Choose Template →
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose Your Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 ${
                      selectedTemplate?.id === template.id ? 'ring-4 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTemplate && (
                <div className="text-center">
                  <button
                    onClick={handleDeploy}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Deploying...' : 'Deploy Portfolio →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && deploymentResult && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-8">Portfolio Deployed Successfully! 🎉</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-gray-700 mb-6">Your portfolio is now live at:</p>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <code className="text-lg font-mono text-blue-600">
                    {window.location.origin}{deploymentResult.portfolio_url}
                  </code>
                </div>
                <div className="flex justify-center space-x-4">
                  <a
                    href={deploymentResult.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Portfolio
                  </a>
                  <button
                    onClick={resetProcess}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Portfolio Viewer Component
const PortfolioViewer = ({ slug }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API}/portfolio/${slug}`);
      if (response.data.success) {
        setPortfolio(response.data.portfolio);
      } else {
        setError('Portfolio not found');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Portfolio not found');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Portfolio Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The portfolio you're looking for doesn't exist.</p>
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Create Your Portfolio
          </a>
        </div>
      </div>
    );
  }

  const { parsed_resume } = portfolio;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Template Rendering */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{parsed_resume.name}</h1>
            <p className="text-lg text-gray-600">{parsed_resume.email} • {parsed_resume.phone}</p>
            {parsed_resume.location && (
              <p className="text-lg text-gray-600">{parsed_resume.location}</p>
            )}
          </div>

          {/* Social Links */}
          {parsed_resume.socials && Object.keys(parsed_resume.socials).length > 0 && (
            <div className="flex justify-center space-x-4 mb-8">
              {Object.entries(parsed_resume.socials).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        {parsed_resume.skills && parsed_resume.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {parsed_resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {parsed_resume.experience && parsed_resume.experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
            <div className="space-y-6">
              {parsed_resume.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                  <p className="text-gray-600 mb-2">{exp.duration}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {parsed_resume.projects && parsed_resume.projects.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
            <div className="space-y-6">
              {parsed_resume.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-gray-600 mb-2">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {parsed_resume.education && parsed_resume.education.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
            <div className="space-y-6">
              {parsed_resume.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-lg text-purple-600 font-medium">{edu.institution}</p>
                  <p className="text-gray-600">{edu.year}</p>
                  {edu.details && <p className="text-gray-700 mt-2">{edu.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:slug" element={<PortfolioViewer slug={window.location.pathname.split('/').pop()} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;