declare module 'node-record-lpcm16' {
  interface RecordOptions {
    sampleRateHertz?: number;
    threshold?: number;
    verbose?: boolean;
    recordProgram?: string;
    silence?: string;
  }

  interface RecordingStream {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  function record(options?: RecordOptions): RecordingStream;

  export = { record };
}