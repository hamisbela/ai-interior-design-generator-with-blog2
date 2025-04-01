import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllUrls } from '../data/posts';
import { MapPin } from 'lucide-react';
import siteConfig from '../config/site';

interface SitemapProps {
  compact?: boolean;
}

const Sitemap: React.FC<SitemapProps> = ({ compact = false }) => {
  const [baseUrls, setBaseUrls] = useState<Array<{ path: string; name: string }>>([]);
  const [blogUrls, setBlogUrls] = useState<Array<{ path: string; name: string; date?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUrls().then(({ baseUrls, blogUrls }) => {
      setBaseUrls(baseUrls);
      setBlogUrls(blogUrls);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className={compact ? '' : 'max-w-4xl mx-auto py-12 px-4 sm:px-6'}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-1/3"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3">Main Pages</h3>
        <ul className="space-y-2">
          {baseUrls.map((url) => (
            <li key={url.path}>
              <Link to={url.path} className="text-blue-600 hover:text-blue-800">
                {url.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Helmet>
        <title>Sitemap - {siteConfig.title}</title>
        <meta name="description" content={`Sitemap for ${siteConfig.title} website`} />
        <link rel="canonical" href={`${siteConfig.siteUrl}/sitemap/`} />
      </Helmet>
      <div className="flex items-center mb-8">
        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Site Map</h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Main Pages</h2>
          <ul className="space-y-2">
            {baseUrls.map((url) => (
              <li key={url.path}>
                <Link to={url.path} className="text-blue-600 hover:text-blue-800 text-lg">
                  {url.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Blog Posts</h2>
          <ul className="space-y-2">
            {blogUrls.map((url) => (
              <li key={url.path} className="flex flex-wrap justify-between">
                <Link to={url.path} className="text-blue-600 hover:text-blue-800">
                  {url.name}
                </Link>
                {url.date && (
                  <span className="text-gray-500 text-sm">
                    {new Date(url.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Sitemap;