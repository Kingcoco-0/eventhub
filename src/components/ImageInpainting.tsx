import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Wand2, 
  RotateCcw, 
  Loader2, 
  Image as ImageIcon,
  Brush,
  Eraser,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
  ArrowLeft,
  Info,
  Palette,
  MessageCircle
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
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [zoom, setZoom] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(e.target?.result as string);
          
          // Setup canvas
          const canvas = canvasRef.current;
          const maskCanvas = maskCanvasRef.current;
          if (canvas && maskCanvas) {
            const ctx = canvas.getContext('2d');
            const maskCtx = maskCanvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;
            
            // Draw original image
            ctx?.drawImage(img, 0, 0);
            
            // Clear mask
            maskCtx?.clearRect(0, 0, img.width, img.height);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(event);
  }, [tool, brushSize]);

  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    
    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [isDrawing, tool, brushSize, zoom]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearMask = useCallback(() => {
    const canvas = maskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const generateImage = useCallback(async () => {
    if (!originalImage || !prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI image generation (replace with actual API call)
    setTimeout(() => {
      // For demo purposes, we'll use a placeholder generated image
      setGeneratedImage('https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg');
      setIsGenerating(false);
    }, 3000);
  }, [originalImage, prompt]);

  const downloadImage = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'inpainted-image.jpg';
      link.click();
    }
  }, [generatedImage]);

  const resetAll = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    clearMask();
    setZoom(1);
  }, [clearMask]);

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
                <h1 className="text-2xl font-bold text-white">AI Image Inpainting</h1>
                <p className="text-gray-400">Transform your images with AI-powered editing</p>
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
              How to Use AI Image Inpainting
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">1. Upload Image</h4>
                <p className="text-gray-300">Upload the image you want to edit. Supported formats: JPG, PNG, WebP</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">2. Mark Areas</h4>
                <p className="text-gray-300">Use the brush tool to mark areas you want to replace or modify</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">3. Describe Changes</h4>
                <p className="text-gray-300">Write a prompt describing what you want in the marked areas</p>
              </div>
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
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mb-4"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Choose Image
              </button>
              
              {originalImage && (
                <button
                  onClick={resetAll}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </button>
              )}
            </div>

            {/* Tools Section */}
            {originalImage && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-purple-400" />
                  Editing Tools
                </h3>
                
                {/* Tool Selection */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setTool('brush')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      tool === 'brush' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Brush className="w-4 h-4 mr-2" />
                    Brush
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      tool === 'eraser' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Eraser className="w-4 h-4 mr-2" />
                    Eraser
                  </button>
                </div>

                {/* Brush Size */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brush Size: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Zoom Controls */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Zoom: {Math.round(zoom * 100)}%
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearMask}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Mask
                </button>
              </div>
            )}

            {/* Prompt Section */}
            {originalImage && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                  AI Prompt
                </h3>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate in the marked areas... (e.g., 'a beautiful garden with flowers', 'modern furniture', 'sunset sky')"
                  className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-4"
                />
                
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
                      Generate Image
                    </>
                  )}
                </button>
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
                  Download Image
                </button>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {!originalImage ? 'Upload an image to get started' : 'Edit Your Image'}
                </h3>
                {originalImage && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Move className="w-4 h-4" />
                    <span>Click and drag to mark areas</span>
                  </div>
                )}
              </div>

              {!originalImage ? (
                <div className="aspect-video bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No image uploaded</p>
                    <p className="text-gray-500 text-sm">Upload an image to start inpainting</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original Image with Mask */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Original + Mask</h4>
                    <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                      />
                      <canvas
                        ref={maskCanvasRef}
                        className="relative w-full h-full object-contain cursor-crosshair"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                  </div>

                  {/* Generated Result */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Generated Result</h4>
                    <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                      {isGenerating ? (
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                          <p className="text-gray-300">Generating your image...</p>
                          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                        </div>
                      ) : generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="Generated result" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Wand2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">Generated image will appear here</p>
                          <p className="text-gray-500 text-sm mt-2">Mark areas and add a prompt to generate</p>
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