export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16',
}

export enum GenerationStatus {
  Idle = 'idle',
  Uploading = 'uploading',
  Generating = 'generating',
  Complete = 'complete',
  Error = 'error',
}

export interface VideoConfig {
  prompt: string;
  aspectRatio: AspectRatio;
}

export interface GeneratedVideo {
  url: string;
  mimeType: string;
}
