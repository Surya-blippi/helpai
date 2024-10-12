declare module 'react-katex' {
    import React from 'react';
  
    export interface KaTeXProps {
      children: string;
      math?: string;
      block?: boolean;
      errorColor?: string;
      renderError?: (error: Error | string) => React.ReactNode;
      settings?: {
        throwOnError?: boolean;
        errorColor?: string;
        macros?: object;
        colorIsTextColor?: boolean;
        maxSize?: number;
        maxExpand?: number;
        allowedProtocols?: string[];
        allowedUris?: RegExp;
      };
    }
  
    export const InlineMath: React.FC<KaTeXProps>;
    export const BlockMath: React.FC<KaTeXProps>;
  }