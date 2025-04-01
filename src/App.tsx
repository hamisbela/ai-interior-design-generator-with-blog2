import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Home as HomeIcon, Paintbrush, Coffee, Info, Mail } from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogPreview from './components/BlogPreview';
import InteriorDesignGenerator from './components/InteriorDesignGenerator';
import ScrollToTop from './components/ScrollToTop';
import Sitemap from './components/Sitemap';
import SearchBar from './components/SearchBar';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import siteConfig from './config/site';

function App() {
  return (
    <Router>
      <HelmetProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Helmet>
            <title>{siteConfig.title} - {siteConfig.description}</title>
            <meta name="description" content={siteConfig.description} />
            <meta property="og:title" content={siteConfig.title} />
            <meta property="og:description" content={siteConfig.description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteConfig.siteUrl} />
            <link rel="canonical" href={siteConfig.siteUrl} />
          </Helmet>

          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center">
                    <Paintbrush className="h-8 w-8 text-blue-600 mr-2" />
                    <span className="font-bold text-xl">{siteConfig.title}</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="hidden md:block mr-4">
                    <SearchBar compact={true} />
                  </div>
                  <Link 
                    to="/" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    <HomeIcon className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                  <Link 
                    to="/blog/" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Blog
                  </Link>
                  <Link 
                    to="/about/" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    About
                  </Link>
                  <Link 
                    to="/contact/" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Link>
                  <a 
                    href="https://roihacks.gumroad.com/coffee"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 flex items-center"
                  >
                    <Coffee className="h-4 w-4 mr-1" />
                    Support Us
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-grow">
            <Routes>
              <Route path="/blog/" element={<BlogList />} />
              <Route path="/sitemap/" element={<Sitemap />} />
              <Route path="/about/" element={<AboutPage />} />
              <Route path="/contact/" element={<ContactPage />} />
              <Route path="/" element={
                <div className="py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Interior Design Generator</h1>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transform your space with AI-powered interior design ideas. Simply select your room type,
                        preferred style, and get beautiful design concepts in seconds.
                      </p>
                    </div>
                    
                    {/* AI Interior Design Generator */}
                    <div className="mb-16">
                      <InteriorDesignGenerator />
                    </div>
                    
                    {/* Blog Preview Section */}
                    <div className="mt-20 pt-12 border-t border-gray-200">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Design Inspiration & Tips</h2>
                      <BlogPreview />
                    </div>
                  </div>
                </div>
              } />
              {/* This should be the last route for catching blog posts */}
              <Route path="/:slug/" element={<BlogPostWrapper />} />
            </Routes>
          </main>
          
          <div className="bg-gray-100 py-6 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    <Paintbrush className="h-5 w-5 text-blue-600 inline mr-2" />
                    {siteConfig.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create stunning interior designs with our free AI-powered tool.
                  </p>
                </div>
                
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-3">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                    </li>
                    <li>
                      <Link to="/blog/" className="text-gray-600 hover:text-gray-900">Blog</Link>
                    </li>
                    <li>
                      <Link to="/about/" className="text-gray-600 hover:text-gray-900">About Us</Link>
                    </li>
                    <li>
                      <Link to="/contact/" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="/sitemap/" className="text-gray-600 hover:text-gray-900">Sitemap</Link>
                    </li>
                  </ul>
                </div>
                
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-3">Support</h3>
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="https://roihacks.gumroad.com/coffee" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                      >
                        <Coffee className="h-4 w-4 mr-1 text-amber-500" />
                        Buy Us a Coffee
                      </a>
                    </li>
                    <li>
                      <Link to="/contact/" className="text-gray-600 hover:text-gray-900">
                        Feedback
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-3">Legal</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                  &copy; {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HelmetProvider>
    </Router>
  );
}

// Wrapper for blog posts to handle proper routing
function BlogPostWrapper() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const path = location.pathname;
  
  // Exclude specific paths that have their own routes
  if (path === '/blog/' || path === '/sitemap/' || path === '/sitemap.xml/' || path === '/about/' || path === '/contact/') {
    return <Navigate to={path} replace />;
  }
  
  // If there's a page parameter, likely it's a request for a paginated blog route
  if (searchParams.has('page') && path === '/') {
    return <Navigate to={`/blog/?${searchParams.toString()}`} replace />;
  }
  
  return <BlogPost />;
}

export default App;