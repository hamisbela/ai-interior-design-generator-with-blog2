import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../data/posts';
import { BlogPost } from '../types/blog';
import { Calendar, User } from 'lucide-react';

interface RelatedBlogPostsProps {
  currentPostSlug: string;
}

const RelatedBlogPosts: React.FC<RelatedBlogPostsProps> = ({ currentPostSlug }) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts().then((posts) => {
      // Filter out the current post
      const otherPosts = posts.filter(post => post.slug !== currentPostSlug);
      
      // Get 3 random posts (or fewer if there aren't 3 other posts)
      const randomPosts = getRandomPosts(otherPosts, 3);
      setRelatedPosts(randomPosts);
      setLoading(false);
    });
  }, [currentPostSlug]);

  // Function to get random posts
  const getRandomPosts = (posts: BlogPost[], count: number): BlogPost[] => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, posts.length));
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm">
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          // Determine if the featured image is from YouTube
          const isYoutubeThumb = post.featuredImage?.includes('img.youtube.com');
          
          return (
            <article key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link to={`/${post.slug}/`} className="block hover:no-underline">
                <div 
                  className={`${isYoutubeThumb ? 'youtube-thumbnail' : 'h-40'} bg-cover bg-center relative`}
                  style={{ 
                    backgroundImage: post.featuredImage 
                      ? `url(${post.featuredImage})` 
                      : 'url(https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1920&auto=format&fit=crop)'
                  }}
                >
                  {/* Only add overlay and title for non-featured images */}
                  {!post.featuredImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  )}
                  {!post.featuredImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h3 className="text-lg font-semibold text-white text-center">
                        {post.title}
                      </h3>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {(post.featuredImage || isYoutubeThumb) && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                      {post.title}
                    </h3>
                  )}
                  <div className="flex flex-wrap gap-2 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    {post.author && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedBlogPosts;