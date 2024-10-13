import { useEffect } from 'react';

export default function DynamicKaTeXCSS() {
  useEffect(() => {
    import('katex/dist/katex.min.css');
  }, []);

  return null;
}