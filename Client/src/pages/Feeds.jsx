import React, { useState, useRef, useCallback } from 'react';
import { FiSearch, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Mock initial data
const generatePosts = (startId, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    author: `User ${startId + i}`,
    content: `This is a beautiful, deeply engaging feed post #${startId + i}. Connected to our incredible styling tokens to ensure it feels right at home in either Warm Light or Night Dark themes. Enjoy the smooth lazy loading and dynamic feel!`,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 2,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
};

const PostCard = React.forwardRef(({ post }, ref) => {
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 rounded-lg bg-surface border border-borderColor shadow-soft hover:shadow-elevated transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-textPrimary leading-tight">{post.author}</div>
            <div className="text-xs text-textSecondary">{post.timestamp}</div>
          </div>
        </div>
      </div>
      <p className="text-textSecondary mb-5 leading-relaxed text-[15px]">{post.content}</p>
      
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-borderColor/50 text-textSecondary">
        <button className="flex items-center gap-2 hover:text-primary transition group">
          <FiHeart className="group-hover:text-primary transition-colors" /> 
          <span className="text-sm font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition group">
          <FiMessageCircle className="group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition ml-auto opacity-70 hover:opacity-100">
          <FiShare2 />
        </button>
      </div>
    </motion.div>
  );
});

export default function Feeds() {
  const [posts, setPosts] = useState(() => generatePosts(1, 10));
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setPosts(prevPosts => {
        const nextId = prevPosts.length > 0 ? prevPosts[prevPosts.length - 1].id + 1 : 1;
        return [...prevPosts, ...generatePosts(nextId, 5)];
      });
      setLoading(false);
    }, 1200);
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background py-8 px-4"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        
        {/* Header & Search */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-textPrimary">Community Feeds</h1>
          <p className="text-textSecondary">Explore what others are sharing and experiencing today.</p>
          
          <div className="relative w-full mt-2 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-textSecondary group-focus-within:text-primary transition-colors" size={18} />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 bg-surface border border-borderColor rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm transition-all text-[15px]"
              placeholder="Search posts or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Feed List */}
        <div className="flex flex-col gap-5">
          {filteredPosts.length === 0 && !loading ? (
             <div className="text-center py-10 text-textSecondary">
               No posts found matching "{searchQuery}"
             </div>
          ) : (
            filteredPosts.map((post, index) => {
              if (filteredPosts.length === index + 1 && !searchQuery) {
                return <PostCard ref={lastPostElementRef} key={post.id} post={post} />;
              } else {
                return <PostCard key={post.id} post={post} />;
              }
            })
          )}
          
          {loading && (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary border-opacity-30 border-t-primary"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
