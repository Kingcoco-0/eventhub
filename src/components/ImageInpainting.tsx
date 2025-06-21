import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Wand2, 
  RotateCcw, 
  Loader2, 
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  Info,
  MessageCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

interface ImageInpaintingProps {
  onBack: () => void;
  onSwitchToChatAssistant?: () => void;
}

const ImageInpainting: React.FC<ImageInpaintingProps> = ({ onBack, onSwitchToChatAssistant }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Please upload a JPG or PNG image file.');
        return;
      }

      // Validate file size (max 10MB for API compatibility)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please use an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const generateImage = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and provide a prompt');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGenerationProgress('Preparing image...');
    
    try {
      // Convert image to file
      const imageFile = dataURLtoFile(originalImage, 'image.png');
      
      // Create form data
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt.trim());
      formData.append('cfg_scale', cfgScale.toString());
      formData.append('steps', steps.toString());
      formData.append('output_format', 'png');
      
      setGenerationProgress('Sending request to Stability AI...');
      
      console.log('Making request to Stability AI...');
      console.log('Image file size:', imageFile.size);
      console.log('Image file type:', imageFile.type);
      console.log('Prompt:', prompt.trim());
      console.log('CFG Scale:', cfgScale);
      console.log('Steps:', steps);
      
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-2-inpainting/image/edit', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-OIY1Cq4k5vutKUSvR8oBwGhU8dmsqhyBarTXxtgi7xwRArPU',
          'Accept': 'application/json'
        },
        body: formData
      });

      console.log('Response received:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
            
            // Handle specific Stability AI error messages
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = errorData.errors.map((err: any) => err.message || err).join(', ');
            }
          } else {
            const errorText = await response.text();
            console.error('API Error Text:', errorText);
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your Stability AI credentials.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid request format. Please try a different image or simpler prompt.';
        } else if (response.status === 422) {
          errorMessage = 'Image processing failed. Please try a different image or adjust your prompt.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      setGenerationProgress('Processing generated image...');
      
      // Parse JSON response
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (responseData.artifacts && responseData.artifacts.length > 0) {
        const artifact = responseData.artifacts[0];
        if (artifact.base64) {
          // Convert base64 to blob URL
          const base64Data = artifact.base64;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          
          setGeneratedImage(imageUrl);
          setGenerationProgress('');
          
          console.log('Image generated successfully');
        } else {
          throw new Error('No image data received from API');
        }
      } else {
        throw new Error('No artifacts received from API');
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('CORS')) {
          setError('CORS error. The API request was blocked by browser security policies.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to generate image. Please try again.');
      }
      setGenerationProgress('');
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage, prompt, cfgScale, steps]);

  const downloadImage = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ai-edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [generatedImage]);

  const resetAll = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setGenerationProgress('');
    setCfgScale(7.5);
    setSteps(30);
    
    // Clean up any object URLs
    if (generatedImage && generatedImage.startsWith('blob:')) {
      URL.revokeObjectURL(generatedImage);
    }
  }, [generatedImage]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (generatedImage && generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to AI Assistant
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Wand2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Image Editor</h1>
                <p className="text-gray-400">Transform your images with text prompts</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4 mr-2" />
              {showInstructions ? 'Hide' : 'Show'} Instructions
            </button>
            {onSwitchToChatAssistant && (
              <button
                onClick={onSwitchToChatAssistant}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Switch to Chat Assistant
              </button>
            )}
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              How to Use AI Image Editor
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">1. Upload Image</h4>
                <p className="text-gray-300">Upload a JPG or PNG image (max 10MB)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">2. Describe Edit</h4>
                <p className="text-gray-300">Write what you want to add, change, or modify in the image</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">3. Generate</h4>
                <p className="text-gray-300">AI will intelligently edit your image based on your description</p>
              </div>
            </div>
            
            {/* API Status */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>Powered by Stability AI:</strong> This tool uses advanced AI to understand your text prompts and make intelligent edits to your images.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-medium">Generation Error</h4>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-purple-400" />
                Upload Image
              </h3>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors mb-4"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Choose Image
              </button>
              
              <p className="text-xs text-gray-400 mb-4">
                Supported: JPG, PNG (max 10MB)
              </p>
              
              {originalImage && (
                <button
                  onClick={resetAll}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </button>
              )}
            </div>

            {/* Prompt Section */}
            {originalImage && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                  Edit Prompt
                </h3>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to add, change, or modify in the image... (e.g., 'add sunglasses to the person', 'change the background to a beach', 'add flowers in the garden')"
                  className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-4"
                  disabled={isGenerating}
                />
                
                {/* Advanced Settings */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CFG Scale: {cfgScale}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="0.5"
                          value={cfgScale}
                          onChange={(e) => setCfgScale(Number(e.target.value))}
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          disabled={isGenerating}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          How closely to follow the prompt (7.5 recommended)
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Steps: {steps}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          step="1"
                          value={steps}
                          onChange={(e) => setSteps(Number(e.target.value))}
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          disabled={isGenerating}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Number of generation steps (30 recommended)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={generateImage}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Edit
                    </>
                  )}
                </button>

                {generationProgress && (
                  <div className="mt-3 text-center">
                    <p className="text-purple-400 text-sm">{generationProgress}</p>
                  </div>
                )}
              </div>
            )}

            {/* Download Section */}
            {generatedImage && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-purple-400" />
                  Download Result
                </h3>
                
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Edited Image
                </button>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {!originalImage ? 'Upload an image to get started' : 'Your Image Transformation'}
                </h3>
              </div>

              {!originalImage ? (
                <div className="aspect-video bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No image uploaded</p>
                    <p className="text-gray-500 text-sm">Upload an image to start editing with AI</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Original Image</h4>
                    <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-square">
                      <img 
                        src={originalImage} 
                        alt="Original image" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Generated Result */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">AI Edited Result</h4>
                    <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                      {isGenerating ? (
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                          <p className="text-gray-300">Generating your edited image...</p>
                          <p className="text-gray-500 text-sm mt-2">{generationProgress}</p>
                        </div>
                      ) : generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="AI edited result" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Wand2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">Edited image will appear here</p>
                          <p className="text-gray-500 text-sm mt-2">Add a description and generate</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInpainting;