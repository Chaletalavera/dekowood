import React, { useState, useCallback } from 'react';
import { AppMode } from './types';
import { analyzeImage, generateImage, editImage, visualizeFurniture } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { TabButton } from './components/TabButton';

const VisualizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const GenerateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5v9a1 1 0 11-2 0V10H4a2 2 0 110-4h1.17A3 3 0 015 5z" clipRule="evenodd" /></svg>;
const AnalyzeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// Base64 encoded logo for the intro screen, corrected from the SVG in Header.tsx
const logoBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzTmFtZT0iaC04IHctOCB0ZXh0LWFtYmVyLTgwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlV2lkdGg9IjIiIHN0cm9rZUxpbmVjYXA9InJvdW5kIiBzdHJva2VMaW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik00IDExLjJWMjFhMSAxIDAgMCAwIDEgMWg0LjVhMSAxIDAgMCAwIDEtMXYtNS4yYTEgMSAwIDAgMSAxLTFoMWExIDEgMCAwIDEgMSAxVjIxYTEgMSAwIDAgMCAxIDFINThhMSAxIDAgMCAwIDEtMXYtOS44YTEgMSAwIDAgMC0uNC0xLjJsLTctNS4yYTEgMSAwIDAgMC0xLjIgMGwtNyA1LjJBMSAxIDAgMCAwIDQgMTEuMnoiIC8+PC9zdmc+";

const App = () => {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [environmentImage, setEnvironmentImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  const handleRun = useCallback(async () => {
    if (!mode) return;

    setIsLoading(true);
    setError(null);
    // Keep previous image if we are editing
    if (mode !== AppMode.Edit && !(mode === AppMode.Visualize && generatedImage)) {
        setGeneratedImage(null);
    }

    try {
      let result: string;
      switch (mode) {
        case AppMode.Visualize:
          if (!environmentImage || !modelImage) throw new Error("Please upload both an environment and a model image.");
          result = await visualizeFurniture(environmentImage, modelImage);
          break;
        case AppMode.Edit:
          const imageToEdit = generatedImage ? dataURLtoFile(generatedImage, 'last-generated.png') : environmentImage;
          if (!imageToEdit) throw new Error("Please upload an image to edit.");
          if (!prompt) throw new Error("Please enter a prompt to edit the image.");
          result = await editImage(imageToEdit, prompt);
          break;
        case AppMode.Generate:
          if (!prompt) throw new Error("Please enter a prompt to generate an image.");
          result = await generateImage(prompt);
          break;
        case AppMode.Analyze:
          if (!environmentImage) throw new Error("Please upload an image to analyze.");
          if (!prompt) throw new Error("Please enter a prompt to analyze the image.");
          result = await analyzeImage(environmentImage, prompt);
          break;
        default:
          throw new Error("Invalid mode selected.");
      }

      if (mode === AppMode.Analyze) {
        alert(`Analysis Result:\n\n${result}`);
      } else {
        setGeneratedImage(result);
        setPrompt('');
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, environmentImage, modelImage, prompt, generatedImage]);

  const resetState = (newMode: AppMode) => {
    setMode(newMode);
    setIsLoading(false);
    setError(null);
    setEnvironmentImage(null);
    setModelImage(null);
    setGeneratedImage(null);
    setPrompt('');
  };
  
  const handleStartOver = () => {
    if (mode) {
        resetState(mode);
    }
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={logoBase64} alt="Dekowood Logo" className="mx-auto h-24 w-24" />
            <h2 className="mt-6 text-2xl font-extrabold text-stone-900">Welcome to the Dekowood AI Visualizer</h2>
            <p className="mt-2 text-base text-stone-600">
              Bring your furniture ideas to life. Place items in your room, generate new concepts, or edit existing images.
            </p>
            <p className="mt-4 text-base font-semibold text-amber-800">Choose a mode to get started:</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             <TabButton label="Visualize" icon={<VisualizeIcon />} isActive={false} onClick={() => setMode(AppMode.Visualize)} />
             <TabButton label="Generate" icon={<GenerateIcon />} isActive={false} onClick={() => setMode(AppMode.Generate)} />
             <TabButton label="Edit" icon={<EditIcon />} isActive={false} onClick={() => setMode(AppMode.Edit)} />
             <TabButton label="Analyze" icon={<AnalyzeIcon />} isActive={false} onClick={() => setMode(AppMode.Analyze)} />
          </div>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    if (generatedImage && mode !== AppMode.Analyze) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-stone-800 mb-4">Current Image</h3>
            <img src={generatedImage} alt="Generated" className="rounded-lg shadow-md w-full" />
          </div>
          <div>
            <label htmlFor="prompt-input" className="block text-sm font-medium text-stone-700 mb-2">Enter modifications for the image:</label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make the wood darker', 'Add a vase of flowers on the table'"
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition"
              rows={3}
            />
          </div>
        </div>
      );
    }

    switch (mode) {
      case AppMode.Visualize:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader onImageSelect={setEnvironmentImage} title="Upload Environment" id="env-uploader" />
            <ImageUploader onImageSelect={setModelImage} title="Upload Furniture Model" id="model-uploader" />
          </div>
        );
      case AppMode.Edit:
        return (
          <div className="space-y-6">
            <ImageUploader onImageSelect={setEnvironmentImage} title="Upload Image to Edit" id="edit-uploader" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a retro filter', 'Remove the person in the background'"
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition"
              rows={3}
            />
          </div>
        );
      case AppMode.Generate:
        return (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A photorealistic image of a walnut wood coffee table in a bright, modern living room.'"
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition"
            rows={5}
          />
        );
      case AppMode.Analyze:
        return (
          <div className="space-y-6">
            <ImageUploader onImageSelect={setEnvironmentImage} title="Upload Image to Analyze" id="analyze-uploader" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Describe the style of this room', 'What materials are used in this chair?'"
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition"
              rows={3}
            />
          </div>
        );
      default: return null;
    }
  };

  const getRunButtonText = () => {
      if (isLoading) return 'Processing...';
      if (generatedImage && mode !== AppMode.Analyze) return 'Modify Image';
      return `Run ${mode}`;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <TabButton label="Visualize" icon={<VisualizeIcon />} isActive={mode === AppMode.Visualize} onClick={() => resetState(AppMode.Visualize)} />
          <TabButton label="Generate" icon={<GenerateIcon />} isActive={mode === AppMode.Generate} onClick={() => resetState(AppMode.Generate)} />
          <TabButton label="Edit" icon={<EditIcon />} isActive={mode === AppMode.Edit} onClick={() => resetState(AppMode.Edit)} />
          <TabButton label="Analyze" icon={<AnalyzeIcon />} isActive={mode === AppMode.Analyze} onClick={() => resetState(AppMode.Analyze)} />
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {isLoading ? <Loader /> : renderContent()}

          {!isLoading && (
             <div className="mt-8 flex flex-col sm:flex-row gap-4">
               <button
                  onClick={handleRun}
                  disabled={isLoading}
                  className="flex-grow bg-amber-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-800 disabled:bg-stone-400 transition-colors flex items-center justify-center text-lg"
               >
                  {getRunButtonText()}
               </button>
               <button
                  onClick={handleStartOver}
                  disabled={isLoading}
                  className="bg-stone-200 text-stone-700 font-bold py-3 px-6 rounded-lg hover:bg-stone-300 disabled:bg-stone-100 transition-colors"
               >
                  Start Over
               </button>
            </div>
          )}
          
          {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
