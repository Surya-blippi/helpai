// types/react-webcam.d.ts

declare module 'react-webcam' {
    import * as React from 'react';
  
    export type ScreenshotFormat = 'image/webp' | 'image/png' | 'image/jpeg' | undefined;
  
    export interface WebcamProps {
      audio?: boolean;
      height?: number | string;
      width?: number | string;
      screenshotFormat?: ScreenshotFormat;
      videoConstraints?: MediaTrackConstraints;
      className?: string;
      // Add any other props you are using
    }
  
    class Webcam extends React.Component<WebcamProps> {
      static defaultProps: Partial<WebcamProps>;
      getScreenshot(): string | null;
      // Include any other methods you use
    }
  
    export default Webcam;
  }
  