import React, { useState, useRef } from 'react';
import { fal } from "@fal-ai/client";
import { Paintbrush, Loader2, Image as ImageIcon, Sofa, Home, Camera, Download, Coffee } from 'lucide-react';

// Configure the FAL client with the API key from environment variables
fal.config({
  credentials: import.meta.env.VITE_FAL_API_KEY
});

const roomTypes = [
  { id: 'living-room', name: 'Living Room', icon: <Sofa className="w-5 h-5" /> },
  { id: 'bedroom', name: 'Bedroom', icon: <Home className="w-5 h-5" /> },
  { id: 'kitchen', name: 'Kitchen', icon: <Camera className="w-5 h-5" /> },
  { id: 'bathroom', name: 'Bathroom', icon: <Camera className="w-5 h-5" /> },
  { id: 'office', name: 'Office', icon: <Camera className="w-5 h-5" /> },
  { id: 'dining-room', name: 'Dining Room', icon: <Camera className="w-5 h-5" /> },
];

const designStyles = [
  { id: 'modern', name: 'Modern' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'scandinavian', name: 'Scandinavian' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'bohemian', name: 'Bohemian' },
  { id: 'mid-century', name: 'Mid-Century' },
  { id: 'contemporary', name: 'Contemporary' },
  { id: 'traditional', name: 'Traditional' },
  { id: 'rustic', name: 'Rustic' },
  { id: 'art-deco', name: 'Art Deco' },
];

const imageSizes = [
  { id: 'square_hd', name: 'Square HD' },
  { id: 'square', name: 'Square' },
  { id: 'portrait_4_3', name: 'Portrait 4:3' },
  { id: 'portrait_16_9', name: 'Portrait 16:9' },
  { id: 'landscape_4_3', name: 'Landscape 4:3' },
  { id: 'landscape_16_9', name: 'Landscape 16:9' },
];

interface GeneratedImage {
  url: string;
  prompt: string;
}

const InteriorDesignGenerator: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('living-room');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [imageSize, setImageSize] = useState<string>('landscape_16_9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  
  const itemsPerPage = 2; // Reduced to show larger images
  const maxPages = Math.ceil(generatedImages.length / itemsPerPage);
  const paginatedImages = generatedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const constructPrompt = () => {
    const roomName = roomTypes.find(room => room.id === selectedRoom)?.name || selectedRoom;
    const styleName = designStyles.find(style => style.id === selectedStyle)?.name || selectedStyle;
    
    let prompt = `A photorealistic ${styleName.toLowerCase()} style ${roomName.toLowerCase()}`;
    
    if (additionalDetails.trim()) {
      prompt += ` with ${additionalDetails.trim()}`;
    }
    
    prompt += '. Professional interior design photography, detailed textures, soft natural lighting, 8k, ultra-detailed.';
    
    return prompt;
  };

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const prompt = constructPrompt();
      
      if (promptRef.current) {
        promptRef.current.value = prompt;
      }
      
      console.log("Generating image with prompt:", prompt);
      
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt,
          image_size: imageSize,
          num_inference_steps: 4,
          seed: Math.floor(Math.random() * 1000000),
          num_images: 1,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Generation in progress:", update.logs.map(log => log.message));
          }
        },
      });
      
      console.log("Generation result:", result);
      
      if (result.data && result.data.images && result.data.images.length > 0) {
        // Add the new image to the beginning of the array
        setGeneratedImages(prev => [
          { url: result.data.images[0].url, prompt },
          ...prev
        ]);
        
        // Always switch to the first page when a new image is generated
        setCurrentPage(1);
        setRequestId(result.requestId);
      } else {
        setError("No images were generated. Please try again.");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(`Error generating image: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `interior-design-${selectedRoom}-${selectedStyle}-${index}.jpg`;
      link.click();
      
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Failed to download the image. Please try again.");
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, maxPages));
  };

  // Focus the textarea to adjust height after generating
  React.useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = 'auto';
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`;
    }
  }, [generatedImages]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Interior Design Generator</h2>
          <p className="text-gray-600 mb-6">Create beautiful interior design concepts with AI. Select your preferences and generate stunning designs!</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Controls */}
            <div className="space-y-6">
              {/* Room Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roomTypes.map(room => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        selectedRoom === room.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {room.icon}
                      <span>{room.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Design Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {designStyles.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        selectedStyle === style.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Additional Details */}
              <div>
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="additionalDetails"
                  rows={2}
                  placeholder="e.g., blue walls, wooden floors, large windows, plants..."
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>
              
              {/* Image Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {imageSizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Final Prompt Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Prompt
                </label>
                <textarea
                  ref={promptRef}
                  readOnly
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-sm"
                  defaultValue={constructPrompt()}
                  rows={2}
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              
              {/* Generate Button */}
              <button
                type="button"
                onClick={generateImage}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors ${
                  isGenerating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Paintbrush className="w-5 h-5" />
                    Generate Design
                  </>
                )}
              </button>
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
            
            {/* Right Column - Generated Images */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Generated Designs
              </h3>
              
              {generatedImages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {paginatedImages.map((image, index) => (
                      <div 
                        key={`${image.url}-${index}`} 
                        className="bg-white rounded-lg shadow-sm overflow-hidden group"
                      >
                        <div className="relative aspect-[16/9] bg-gray-100">
                          <img 
                            src={image.url} 
                            alt={`Generated interior design ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <button
                            onClick={() => downloadImage(image.url, index)}
                            className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Download image"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {image.prompt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {generatedImages.length > itemsPerPage && (
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {maxPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === maxPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === maxPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-center">
                    Your generated designs will appear here
                  </p>
                  <p className="text-gray-400 text-sm text-center mt-2">
                    Select your preferences and click "Generate Design"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy Us a Coffee Block */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-md p-6 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Coffee className="w-5 h-5 mr-2 text-amber-600" />
              Love Our Free AI Interior Design Generator? Support Us! ❤️
            </h3>
            <p className="text-gray-700">
              Help us maintain and improve our tool by supporting our API & hosting costs. Your contribution helps keep this tool free for everyone!
            </p>
          </div>
          <a 
            href="https://roihacks.gumroad.com/coffee" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors inline-flex items-center whitespace-nowrap"
          >
            <Coffee className="w-5 h-5 mr-2" />
            Buy Us a Coffee
          </a>
        </div>
      </div>

      {/* SEO Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <h2>Why Choose Our Free AI Interior Design Generator</h2>
        <p>
          Experience the future of interior design with our Free AI Interior Design Generator. Our cutting-edge AI technology creates stunning, photorealistic room designs in seconds, making it the perfect tool for interior designers, homeowners, and design enthusiasts alike.
        </p>

        <h3>How to Use the Free AI Interior Design Generator - Quick Start Guide</h3>
        <p>
          Creating your dream interior has never been easier with our Free AI Interior Design Generator tool. Whether you're a professional designer, homeowner, or just someone who loves exploring interior design ideas, our AI-powered tool delivers stunning results in seconds.
        </p>

        <h3>Free AI Interior Design Generator Features and Benefits</h3>
        <ul>
          <li>Instant photorealistic room visualizations</li>
          <li>Multiple interior design styles supported</li>
          <li>High-resolution output for professional use</li>
          <li>100% free to use - no hidden costs</li>
          <li>No sign-up required</li>
        </ul>

        <h3>Step-by-Step Guide to Using Our Free AI Interior Design Generator</h3>
        <ol>
          <li>Enter your room description in the Free AI Interior Design Generator input field above</li>
          <li>Include key details like style, colors, and furniture</li>
          <li>Click "Generate Interior Design" and watch as our Free AI Interior Design Generator creates your unique design</li>
          <li>Download your photorealistic interior visualization in high resolution</li>
        </ol>

        <h3>Best Practices for Using the Free AI Interior Design Generator</h3>
        <p>
          To get the most out of our Free AI Interior Design Generator, consider these expert tips:
        </p>
        <ul>
          <li>Be specific about design style (modern, traditional, contemporary)</li>
          <li>Mention key features (fireplace, windows, built-ins)</li>
          <li>Include materials and colors (marble, wood, neutral tones)</li>
          <li>Specify the room type (living room, kitchen, bedroom)</li>
        </ul>

        <h3>Learn More About Interior Design</h3>
        <p>
          Visit our blog to discover the latest interior design trends, tips, and inspiration to help you create your dream home.
        </p>

        <h3>Perfect Use Cases for Our Free AI Interior Design Generator</h3>
        <p>
          Our Free AI Interior Design Generator is ideal for:
        </p>
        <ul>
          <li>Interior designers visualizing concepts with the Free AI Interior Design Generator</li>
          <li>Real estate professionals staging virtual rooms</li>
          <li>Homeowners exploring design possibilities with our Free AI Interior Design Generator</li>
          <li>Design students creating project visualizations</li>
          <li>Furniture retailers showcasing room layouts</li>
          <li>Home stagers creating virtual staging designs</li>
        </ul>

        <h3>Why Our Free AI Interior Design Generator Stands Out</h3>
        <p>
          Unlike other tools, our Free AI Interior Design Generator offers:
        </p>
        <ul>
          <li>Superior image quality and realism</li>
          <li>Faster generation times</li>
          <li>More interior design style options</li>
          <li>Better understanding of design principles</li>
          <li>Completely free access to all features</li>
        </ul>
      </div>
    </div>
  );
};

export default InteriorDesignGenerator;