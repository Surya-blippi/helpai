declare module 'mathjax-react' {
    import React from 'react';
  
    export interface MathJaxProps {
      children: string;
      inline?: boolean;
    }
  
    export const MathJax: React.FC<MathJaxProps>;
  
    interface MathJaxLoaderConfig {
      load?: string[];
    }
  
    interface MathJaxTexConfig {
      packages?: string[] | Record<string, string[]>;
      inlineMath?: [string, string][];
      displayMath?: [string, string][];
      processEscapes?: boolean;
      processEnvironments?: boolean;
      processRefs?: boolean;
      digits?: RegExp;
      tags?: 'none' | 'ams' | 'all';
      tagSide?: 'right' | 'left';
      tagIndent?: string;
      useLabelIds?: boolean;
      multlineWidth?: string;
      maxMacros?: number;
      maxBuffer?: number;
      baseURL?: string;
      formatError?: (jax: any, err: Error) => string;
    }
  
    interface MathJaxSvgConfig {
      scale?: number;
      minScale?: number;
      mtextInheritFont?: boolean;
      merrorInheritFont?: boolean;
      mathmlSpacing?: boolean;
      skipAttributes?: Record<string, boolean>;
      exFactor?: number;
      displayAlign?: 'left' | 'center' | 'right';
      displayIndent?: string;
      fontCache?: 'local' | 'global' | 'none';
      localID?: string | null;
      internalSpeechTitles?: boolean;
      titleID?: number;
    }
  
    interface MathJaxConfig {
      loader?: MathJaxLoaderConfig;
      tex?: MathJaxTexConfig;
      svg?: MathJaxSvgConfig;
      startup?: Record<string, unknown>;
      options?: Record<string, unknown>;
    }
  
    export interface MathJaxContextProps {
      children: React.ReactNode;
      config?: MathJaxConfig;
      version?: string;
      onStartup?: (mathJax: unknown) => void;
      onLoad?: () => void;
      onError?: (error: Error) => void;
    }
  
    export const MathJaxContext: React.FC<MathJaxContextProps>;
  }