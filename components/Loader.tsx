
import React from 'react';

const messages = [
  "Crafting your custom design...",
  "Applying the finishing touches...",
  "Rendering photorealistic details...",
  "Consulting with our virtual designers...",
  "Measuring twice, rendering once...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <svg className="animate-spin h-12 w-12 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg font-medium text-stone-700">{message}</p>
    </div>
  );
};
