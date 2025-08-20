import React, { useEffect, useMemo, useRef, useState } from 'react';

interface TerminalWindowProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  animated?: boolean;
}

interface TerminalStep {
  id: number;
  prompt?: string;
  response?: string;
  content?: string;
  delay: number;
  isPrompt: boolean;
  isSuccess?: boolean;
}

const InteractivePrompt = ({
  prompt,
  response,
  isVisible,
}: {
  prompt: string;
  response: string;
  isVisible: boolean;
}) => {
  const [displayedResponse, setDisplayedResponse] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDisplayedResponse('');
      return;
    }

    // Debug: log what we're trying to type
    console.log('InteractivePrompt - response:', response, 'type:', typeof response);

    // Reset and start fresh
    setDisplayedResponse('');

    // Simple timeout to show full response after delay
    const timeout = window.setTimeout(() => {
      setDisplayedResponse(response || 'ERROR: undefined response');
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isVisible, response]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-400">{prompt}</span>
      <span className="text-white dark:text-black">{displayedResponse}</span>
    </div>
  );
};

export const TerminalWindow = ({
  title = 'Terminal',
  className = '',
  children,
  animated = false,
}: TerminalWindowProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [commandTyped, setCommandTyped] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminalSteps: TerminalStep[] = useMemo(
    () => [
      {
        id: 0,
        prompt: 'Initialize Git? (Y/n):',
        response: 'true',
        delay: 1000,
        isPrompt: true,
      },
      {
        id: 1,
        content: '✓ Found global Git identity:\n  Name: naruto\n  Email: naruto@konoha.com',
        delay: 3000,
        isPrompt: false,
      },
      {
        id: 2,
        prompt: 'Use this identity for the project? (Y/n):',
        response: 'true',
        delay: 5000,
        isPrompt: true,
      },
      {
        id: 3,
        content: '✓ Project created at: ./my-ninja-app',
        delay: 8000,
        isPrompt: false,
        isSuccess: true,
      },
    ],
    []
  );

  const commandText = 'npx @vite-powerflow/create my-ninja-app';
  const commandTypingDuration = commandText.length * 80;

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsAnimating(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => observer.disconnect();
  }, [animated, hasAnimated]);

  useEffect(() => {
    if (!animated || !isAnimating) return;

    // Wait for command to finish typing before starting steps
    const commandTimeout = window.setTimeout(() => {
      setCommandTyped(true);
    }, commandTypingDuration);

    return () => window.clearTimeout(commandTimeout);
  }, [animated, isAnimating, commandTypingDuration]);

  useEffect(() => {
    if (!animated || !commandTyped) return;

    const timeouts: number[] = [];

    terminalSteps.forEach(step => {
      const timeout = window.setTimeout(() => {
        setVisibleLines(prev => [...prev, step.id]);
      }, step.delay); // Use absolute delays, not relative

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => window.clearTimeout(timeout));
    };
  }, [animated, commandTyped, terminalSteps]);

  // If not animated, just render children normally
  if (!animated) {
    return (
      <div
        className={`code-block overflow-hidden rounded-lg border bg-black dark:bg-white ${className}`}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-200 px-4 py-2 border-b border-gray-700 dark:border-gray-300">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-gray-300 dark:text-gray-700 text-sm font-mono">{title}</span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm text-white dark:text-black min-h-[200px]">
          {children}
        </div>
      </div>
    );
  }

  // Animated terminal content
  return (
    <div ref={terminalRef} className={className}>
      <div className="code-block overflow-hidden rounded-lg border bg-black dark:bg-white animate-fade-in">
        {/* Terminal header */}
        <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-200 px-4 py-2 border-b border-gray-700 dark:border-gray-300">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-gray-300 dark:text-gray-700 text-sm font-mono">{title}</span>
          </div>
        </div>

        {/* Terminal content with animation */}
        <div className="p-4 font-mono text-sm text-white dark:text-black min-h-[200px]">
          <div className="space-y-2">
            {/* Command line - always visible */}
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <TypewriterText
                text={commandText}
                delay={80}
                className="text-white dark:text-black"
              />
            </div>

            {/* Animated progress lines */}
            {terminalSteps.map(step => (
              <div
                key={step.id}
                className={`transition-all duration-500 ${
                  visibleLines.includes(step.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
              >
                {step.isPrompt && step.prompt && step.response ? (
                  <InteractivePrompt
                    prompt={step.prompt}
                    response={step.response}
                    isVisible={visibleLines.includes(step.id)}
                  />
                ) : step.content ? (
                  <div
                    className={`${
                      step.isSuccess ? 'text-green-400' : 'text-gray-300 dark:text-gray-700'
                    }`}
                  >
                    {step.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {/* Terminal cursor after animation completes */}
            {visibleLines.length === terminalSteps.length && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400">$</span>
                <span className="typing-cursor text-green-400">|</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TypewriterText = ({ text, delay = 50, className = '' }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = window.setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => window.clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && <span className="typing-cursor">|</span>}
    </span>
  );
};
