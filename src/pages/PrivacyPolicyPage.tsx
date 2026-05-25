import React from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-16">
      <Container>
        <SectionHeading 
          title="Privacy Policy" 
          subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
          centered
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold">Data Protection & Privacy</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Last updated:</strong> January 2025
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At SKILLSTASH, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services.
            </p>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Information We Collect</h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Name and email address when you create an account</li>
                    <li>Phone number if you choose to provide it</li>
                    <li>Payment information for course purchases (processed securely)</li>
                    <li>Profile information you choose to share</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pages visited and time spent on our website</li>
                    <li>Course progress and completion data</li>
                    <li>Template downloads and usage patterns</li>
                    <li>Device information and browser type</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold">How We Use Your Information</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Provide personalized course recommendations</li>
                  <li>Monitor and analyze usage patterns to improve our services</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold">Information Sharing</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-xl font-bold">Data Security</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure database storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data protection</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">Your Rights</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Request limitation of processing your data</li>
                </ul>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold">Cookies and Tracking</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Improve our services and user experience</li>
                </ul>
                <p>You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold">Contact Us</h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@skillstash.com</p>
                  <p><strong>Phone:</strong> +91 7633880806</p>
                  <p><strong>Address:</strong> Camp, Pune, 411001, India</p>
                </div>
              </div>
            </div>

            {/* Updates to Policy */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Updates to This Policy</h3>
              <p className="text-blue-800 dark:text-blue-200">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
                Policy periodically for any changes.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicyPage;