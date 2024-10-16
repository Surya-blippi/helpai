declare module 'react-katex' {
    import React from 'react';
  
    export interface KaTeXProps {
      math: string;
      block?: boolean;
      errorColor?: string;
      renderError?: (error: Error | string) => React.ReactNode;
      settings?: Record<string, unknown>;
    }
  
    export const BlockMath: React.FC<KaTeXProps>;
    export const InlineMath: React.FC<KaTeXProps>;
  }