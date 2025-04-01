import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush } from 'lucide-react';
import siteConfig from '../config/site';

interface CTABlockProps {
  variant?: 'sidebar' | 'footer';
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  icon?: React.ReactNode;
}

const CTABlock: React.FC<CTABlockProps> = ({ 
  variant = 'footer', 
  className = '',
  title,
  description,
  buttonText = 'Try Our AI Generator',
  secondaryButtonText,
  icon
}) => {
  // Interior design specific content
  const defaultTitle = variant === 'sidebar' ? 'Transform Your Space' : 'Inspired by Interior Design?';
  const defaultDescription = variant === 'sidebar' 
    ? 'Create stunning interior designs in seconds with our free AI-powered generator. No design experience needed!'
    : 'Generate your own beautiful interior designs with our free AI tool, or explore more design inspiration in our blog.';
  
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-grow">
          <h3 className={`font-bold text-gray-900 mb-2 ${variant === 'sidebar' ? 'text-lg' : 'text-xl'}`}>
            {title || defaultTitle}
          </h3>
          <p className={`text-gray-600 mb-4 ${variant === 'sidebar' ? 'text-sm' : 'text-base'}`}>
            {description || defaultDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/" 
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${variant === 'sidebar' ? 'w-full justify-center' : ''}`}
            >
              {icon || <Paintbrush size={16} className="mr-2" />}
              {buttonText} {!variant || variant === 'footer' ? <ArrowRight size={16} className="ml-2" /> : null}
            </Link>
            {secondaryButtonText && (
              <Link 
                to="/blog/" 
                className={`inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors ${variant === 'sidebar' ? 'w-full justify-center' : ''}`}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTABlock;