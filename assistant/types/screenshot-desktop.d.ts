declare module 'screenshot-desktop' {
  interface ScreenshotOptions {
    format?: 'png' | 'jpg';
    quality?: number;
    screen?: number;
  }
  
  function screenshot(options?: ScreenshotOptions): Promise<Buffer>;
  export = screenshot;
}
