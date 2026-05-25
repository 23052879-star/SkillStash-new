import React from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-16">
      <Container>
        <SectionHeading 
          title="Terms of Service" 
          subtitle="Please read these terms carefully before using our services. By using SKILLSTASH, you agree to these terms."
          centered
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold">Terms and Conditions</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Last updated:</strong> January 2025
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to SKILLSTASH. These Terms of Service ("Terms") govern your use of our website, services, 
              and products. By accessing or using SKILLSTASH, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Acceptance of Terms</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>By accessing and using SKILLSTASH, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <p>If you do not agree to abide by the above, please do not use this service.</p>
              </div>
            </div>

            {/* User Accounts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold">User Accounts</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>To access certain features of our service, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
            </div>

            {/* Services and Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">Services and Content</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>SKILLSTASH provides:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Professional resume and CV templates</li>
                  <li>Online courses and educational content</li>
                  <li>Career development resources</li>
                  <li>Free productivity tools and resources</li>
                </ul>
                <p>All content is provided for personal and professional use. Commercial redistribution is prohibited without written consent.</p>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold">Payment Terms</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>For paid services and products:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>All prices are listed in Indian Rupees (INR)</li>
                  <li>Payment is required before access to paid content</li>
                  <li>We accept major credit cards and digital payment methods</li>
                  <li>All sales are final unless otherwise specified</li>
                  <li>Refunds are available within 30 days of purchase for courses</li>
                  <li>Template downloads are non-refundable once accessed</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-xl font-bold">Intellectual Property</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>All content on SKILLSTASH, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Templates, designs, and graphics</li>
                  <li>Course materials and educational content</li>
                  <li>Text, images, and multimedia content</li>
                  <li>Software and website functionality</li>
                  <li>Trademarks and logos</li>
                </ul>
                <p>Are owned by SKILLSTASH or our licensors and are protected by copyright and other intellectual property laws.</p>
              </div>
            </div>

            {/* User Conduct */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <h3 className="text-xl font-bold">User Conduct</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Use our services for any unlawful purpose</li>
                  <li>Share your account credentials with others</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Engage in any form of harassment or abuse</li>
                </ul>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold">Disclaimers</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>SKILLSTASH provides services "as is" without warranties of any kind. We disclaim:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Guarantees of uninterrupted or error-free service</li>
                  <li>Responsibility for third-party content or services</li>
                  <li>Guarantees of specific career outcomes or job placement</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-bold">Limitation of Liability</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>To the maximum extent permitted by law, SKILLSTASH shall not be liable for:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages exceeding the amount paid for our services</li>
                  <li>Issues arising from third-party services or content</li>
                </ul>
              </div>
            </div>

            {/* Termination */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-xl font-bold">Termination</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>We may terminate or suspend your account and access to our services:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>For violation of these Terms</li>
                  <li>For fraudulent or illegal activity</li>
                  <li>At our sole discretion with or without notice</li>
                </ul>
                <p>You may terminate your account at any time by contacting us.</p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">Governing Law</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>These Terms are governed by the laws of India. Any disputes will be resolved in the courts of Pune, Maharashtra.</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Contact Us</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@skillstash.com</p>
                  <p><strong>Phone:</strong> +91 7633880806</p>
                  <p><strong>Address:</strong> Camp, Pune, 411001, India</p>
                </div>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">Changes to Terms</h3>
              <p className="text-yellow-800 dark:text-yellow-200">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                by posting the updated Terms on our website. Your continued use of our services after such changes 
                constitutes acceptance of the new Terms.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfServicePage;