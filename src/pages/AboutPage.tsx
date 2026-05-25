import React from 'react';
import { Container } from '../components/shared/Container';
import { SectionHeading } from '../components/shared/SectionHeading';
import { Users, Target, Award, BookOpen, TrendingUp, Star } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Job Seekers Helped', value: '25,000+' },
    { icon: BookOpen, label: 'Resume Templates', value: '500+' },
    { icon: Award, label: 'Course Completions', value: '15,000+' },
    { icon: TrendingUp, label: 'Success Rate', value: '92%' }
  ];

  const features = [
    {
      icon: Target,
      title: 'ATS-Optimized Templates',
      description: 'Our resume templates are designed to pass Applicant Tracking Systems and get you noticed by recruiters.'
    },
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with our comprehensive career development and skill-building courses.'
    },
    {
      icon: Award,
      title: 'Professional Certification',
      description: 'Earn recognized certifications that validate your skills and boost your career prospects.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth Support',
      description: 'Get personalized guidance and resources to accelerate your professional development journey.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Container>
        {/* Hero Section */}
        <div className="pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeading 
              title="About SKILLSTASH" 
              subtitle="Empowering careers through professional development and innovative learning solutions"
            />
            <p className="text-xl text-gray-300 leading-relaxed mt-8">
              SKILLSTASH is your trusted partner in career advancement, offering premium resume templates, 
              comprehensive online courses, and professional development resources designed to help you 
              achieve your career goals and stand out in today's competitive job market.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 border-t border-gray-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 border-t border-gray-800">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To democratize career success by providing accessible, high-quality professional development 
                resources that empower individuals to achieve their career aspirations and unlock their full potential.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We believe that everyone deserves the opportunity to build a successful career, regardless of 
                their background or starting point. Through our innovative platform, we're breaking down barriers 
                and making professional growth achievable for all.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become the world's leading platform for career development, where millions of professionals 
                discover their potential, develop their skills, and achieve remarkable career success through 
                our comprehensive ecosystem of learning resources and tools.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose SKILLSTASH?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with expert knowledge to deliver unparalleled career development solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 border-t border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
              <p className="text-gray-300">We maintain the highest standards in everything we create and deliver.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community</h3>
              <p className="text-gray-300">We foster a supportive community where professionals can grow together.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">We continuously evolve our platform to meet changing career needs.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 border-t border-gray-800">
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already accelerated their careers with SKILLSTASH. 
              Start your journey today and unlock your full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                <a href="/templates">Browse Templates</a>
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                <a href="/courses">Explore Courses</a>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}