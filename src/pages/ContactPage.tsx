import React, { useState } from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
      <Container>
        <SectionHeading 
          title="Contact SKILLSTASH - We're Here to Help" 
          subtitle="Get in touch with our career development experts for personalized assistance with resume templates, courses, and career guidance"
          centered
        />
        
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0">
          <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Email Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs sm:text-sm">Get expert help with templates and courses</p>
            <a 
              href="mailto:skillstash.official@gmail.com" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-300 text-sm break-all"
            >
              skillstash.official@gmail.com
            </a>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600 mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Phone Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs sm:text-sm">Speak with our career consultants</p>
            <a 
              href="tel:+917633880806" 
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-300"
            >
              +91 7633880806
            </a>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-purple-100 text-purple-600 mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Office Location</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs sm:text-sm">Visit our career development center</p>
            <p className="text-purple-600 dark:text-purple-400 font-medium">Camp, Pune, 411001</p>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 text-orange-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Business Hours</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs sm:text-sm">Monday - Friday</p>
            <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">9:00 AM - 6:00 PM IST</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 px-4 sm:px-0">
          {/* Contact Form */}
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Send us a Message</h3>
            </div>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 dark:text-green-200 text-sm sm:text-base">Thank you! Your message has been sent successfully.</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="resume-templates">Resume Templates Support</option>
                  <option value="course-inquiry">Course Inquiry</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="career-guidance">Career Guidance</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6} 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 resize-none"
                  placeholder="Tell us how we can help you with your career development needs..."
                  required
                ></textarea>
              </div>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base py-3"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h3>
            
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">How do I download resume templates?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Simply browse our template collection, select your preferred design, create a free account, and download instantly. 
                All templates are ATS-friendly and professionally designed.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Are your courses industry-certified?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! Our courses are designed by industry experts and provide certificates upon completion. 
                Many of our courses are recognized by leading companies and professional organizations.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Do you offer career counseling services?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We provide career guidance through our courses and blog content. For personalized career counseling, 
                please contact us directly to discuss our premium consultation services.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">What file formats are available for templates?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our templates are available in multiple formats including Word (.docx), PDF, and some in PowerPoint (.pptx) 
                to ensure compatibility with all systems and ATS software.
              </p>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">How can I get a refund?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We offer a 30-day money-back guarantee on all paid courses and premium templates. 
                Contact our support team with your order details for assistance.
              </p>
            </Card>
          </div>
        </div>

        {/* Additional Support Section */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white text-center mx-4 sm:mx-0">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Our career development experts are ready to help you succeed. Whether you need help with resume templates, 
            course selection, or career guidance, we're here to support your professional journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:skillstash.official@gmail.com"
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium text-sm sm:text-base"
            >
              Email Us Now
            </a>
            <a 
              href="tel:+917633880806"
              className="border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300 font-medium text-sm sm:text-base"
            >
              Call Us Today
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;