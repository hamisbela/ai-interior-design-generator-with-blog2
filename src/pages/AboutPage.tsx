import React from 'react';
import { Helmet } from 'react-helmet-async';
import siteConfig from '../config/site';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Helmet>
        <title>About Us - {siteConfig.title}</title>
        <meta name="description" content="Learn about the team behind AI Interior Design Generator and our mission." />
        <link rel="canonical" href={`${siteConfig.siteUrl}/about/`} />
      </Helmet>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About AI Interior Design Generator</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Welcome to AI Interior Design Generator, where technology meets creativity to transform interior design. 
              Our platform was born from a passion for making beautiful interior design accessible to everyone, regardless of budget or expertise.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              Our mission is to democratize interior design by leveraging cutting-edge AI technology. 
              We believe everyone deserves to live in a space that reflects their personality and meets their needs, 
              and our free AI Interior Design Generator makes that possible.
            </p>
            
            <h2>How It Started</h2>
            <p>
              AI Interior Design Generator began as a passion project by a team of technology enthusiasts and design lovers. 
              Frustrated by the high costs and limited accessibility of professional interior design services, 
              we set out to create a solution that could provide high-quality design concepts instantly and for free.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              We utilize state-of-the-art artificial intelligence and machine learning algorithms that have been trained on thousands 
              of professionally designed interiors. Our system understands design principles, spatial relationships, color theory, 
              and trending styles to generate photorealistic interior visualizations that are both beautiful and practical.
            </p>
            
            <h2>Our Commitment</h2>
            <p>
              We're committed to:
            </p>
            <ul>
              <li>Keeping our core interior design generation tools free for everyone</li>
              <li>Continuously improving our AI to produce even more realistic and useful designs</li>
              <li>Building a community of design enthusiasts who share ideas and inspiration</li>
              <li>Providing educational resources about interior design principles and trends</li>
              <li>Maintaining user privacy and data security</li>
            </ul>
            
            <h2>The Team</h2>
            <p>
              Our diverse team brings together expertise in artificial intelligence, software development, UI/UX design, and interior design. 
              While we may come from different backgrounds, we share a common vision: making beautiful spaces accessible to all.
            </p>
            
            <h2>Support Our Work</h2>
            <p>
              AI Interior Design Generator is primarily supported by user donations and minimal advertising. 
              If you find our tool valuable, please consider supporting us through our "Buy Us a Coffee" link, 
              which helps cover our server costs, AI API expenses, and development time.
            </p>
            
            <h2>Connect With Us</h2>
            <p>
              We love hearing from our users! Whether you have feedback, questions, or just want to share your 
              generated designs, please reach out through our Contact page. Your input helps us improve and grow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;