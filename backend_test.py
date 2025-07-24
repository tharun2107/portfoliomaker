import requests
import sys
import json
import io
from datetime import datetime
import tempfile
import os

class PortfolioAPITester:
    def __init__(self, base_url="https://440605f7-a133-4b85-adb3-e0496a84161d.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {}
        if data and not files:
            headers['Content-Type'] = 'application/json'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    print(f"   Response: {response.text[:200]}...")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_get_templates(self):
        """Test getting portfolio templates"""
        success, response = self.run_test("Get Templates", "GET", "templates", 200)
        
        if success and response:
            templates = response.get('templates', [])
            if len(templates) == 4:
                print(f"   ✅ Found {len(templates)} templates as expected")
                # Check template structure
                required_fields = ['id', 'name', 'preview_image', 'description']
                for template in templates:
                    missing_fields = [field for field in required_fields if field not in template]
                    if missing_fields:
                        print(f"   ⚠️  Template missing fields: {missing_fields}")
                    else:
                        print(f"   ✅ Template '{template['name']}' has all required fields")
            else:
                print(f"   ❌ Expected 4 templates, got {len(templates)}")
                
        return success, response

    def create_dummy_pdf(self):
        """Create a dummy PDF file for testing"""
        try:
            # Create a simple text file and rename it as PDF for basic testing
            dummy_content = b"""John Doe
Software Engineer
john.doe@email.com
+1-555-123-4567
New York, NY

SKILLS:
Python, JavaScript, React, Node.js, MongoDB

EXPERIENCE:
Senior Software Engineer at Tech Corp (2020-2023)
- Developed web applications using React and Node.js
- Led a team of 5 developers
- Improved system performance by 40%

EDUCATION:
Bachelor of Computer Science
University of Technology (2016-2020)

PROJECTS:
E-commerce Platform
- Built full-stack e-commerce application
- Technologies: React, Node.js, MongoDB
- Link: https://github.com/johndoe/ecommerce
"""
            return io.BytesIO(dummy_content)
        except Exception as e:
            print(f"Error creating dummy PDF: {e}")
            return None

    def test_resume_parse(self):
        """Test resume parsing endpoint"""
        dummy_file = self.create_dummy_pdf()
        if not dummy_file:
            print("❌ Could not create dummy file for testing")
            return False, {}

        files = {'file': ('test_resume.pdf', dummy_file, 'application/pdf')}
        success, response = self.run_test("Parse Resume", "POST", "resume/parse", 200, files=files)
        
        if success and response:
            parsed_data = response.get('parsed_data', {})
            if parsed_data:
                print(f"   ✅ Resume parsed successfully")
                print(f"   Name: {parsed_data.get('name', 'Not found')}")
                print(f"   Email: {parsed_data.get('email', 'Not found')}")
                print(f"   Skills: {len(parsed_data.get('skills', []))} found")
            else:
                print(f"   ⚠️  No parsed data returned")
                
        return success, response

    def test_invalid_file_upload(self):
        """Test uploading invalid file type"""
        dummy_content = b"This is not a valid PDF or DOCX file"
        files = {'file': ('test.txt', io.BytesIO(dummy_content), 'text/plain')}
        
        success, response = self.run_test("Invalid File Upload", "POST", "resume/parse", 400, files=files)
        return success, response

    def test_portfolio_deploy(self):
        """Test portfolio deployment"""
        # Sample parsed resume data
        sample_data = {
            "username": "john_doe",
            "selected_template": "modern",
            "parsed_resume": {
                "name": "John Doe",
                "email": "john.doe@email.com",
                "phone": "+1-555-123-4567",
                "location": "New York, NY",
                "skills": ["Python", "JavaScript", "React"],
                "education": [
                    {
                        "degree": "Bachelor of Computer Science",
                        "institution": "University of Technology",
                        "year": "2016-2020",
                        "details": ""
                    }
                ],
                "experience": [
                    {
                        "title": "Senior Software Engineer",
                        "company": "Tech Corp",
                        "duration": "2020-2023",
                        "description": "Developed web applications"
                    }
                ],
                "projects": [
                    {
                        "name": "E-commerce Platform",
                        "description": "Built full-stack application",
                        "technologies": "React, Node.js, MongoDB",
                        "link": "https://github.com/johndoe/ecommerce"
                    }
                ],
                "socials": {
                    "linkedin": "https://linkedin.com/in/johndoe",
                    "github": "https://github.com/johndoe"
                }
            }
        }
        
        success, response = self.run_test("Deploy Portfolio", "POST", "portfolio/deploy", 200, data=sample_data)
        
        if success and response:
            portfolio_url = response.get('portfolio_url')
            if portfolio_url:
                print(f"   ✅ Portfolio deployed at: {portfolio_url}")
                return success, response, portfolio_url
            else:
                print(f"   ⚠️  No portfolio URL returned")
                
        return success, response, None

    def test_get_portfolio(self, route_slug):
        """Test getting portfolio by route slug"""
        if not route_slug:
            print("❌ No route slug provided for portfolio test")
            return False, {}
            
        success, response = self.run_test("Get Portfolio", "GET", f"portfolio/{route_slug}", 200)
        
        if success and response:
            portfolio = response.get('portfolio', {})
            if portfolio:
                print(f"   ✅ Portfolio retrieved successfully")
                print(f"   Username: {portfolio.get('username', 'Not found')}")
                print(f"   Template: {portfolio.get('selected_template', 'Not found')}")
            else:
                print(f"   ⚠️  No portfolio data returned")
                
        return success, response

    def test_nonexistent_portfolio(self):
        """Test getting non-existent portfolio"""
        fake_slug = "nonexistent_portfolio_12345"
        success, response = self.run_test("Get Non-existent Portfolio", "GET", f"portfolio/{fake_slug}", 404)
        return success, response

def main():
    print("🚀 Starting Portfolio Maker API Tests")
    print("=" * 50)
    
    tester = PortfolioAPITester()
    
    # Test 1: Root endpoint
    tester.test_root_endpoint()
    
    # Test 2: Get templates
    tester.test_get_templates()
    
    # Test 3: Resume parsing
    tester.test_resume_parse()
    
    # Test 4: Invalid file upload
    tester.test_invalid_file_upload()
    
    # Test 5: Portfolio deployment
    success, response, portfolio_url = tester.test_portfolio_deploy()
    
    # Test 6: Get deployed portfolio
    if portfolio_url:
        route_slug = portfolio_url.split('/')[-1]  # Extract slug from URL
        tester.test_get_portfolio(route_slug)
    
    # Test 7: Non-existent portfolio
    tester.test_nonexistent_portfolio()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 API Tests Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All API tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())