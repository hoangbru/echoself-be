export const AUDIO_FORMATS = {
  MP3: {
    mimeType: "audio/mpeg",
    extension: ".mp3",
    maxBitrate: 320,
  },
  WAV: {
    mimeType: "audio/wav",
    extension: ".wav",
    maxBitrate: 1411,
  },
  FLAC: {
    mimeType: "audio/flac",
    extension: ".flac",
    maxBitrate: 1411,
  },
  AAC: {
    mimeType: "audio/aac",
    extension: ".aac",
    maxBitrate: 320,
  },
} as const;

export const AUDIO_QUALITY_BITRATES = {
  LOW: 96,
  MEDIUM: 128,
  HIGH: 256,
  LOSSLESS: 1411,
} as const;

export const MAX_FILE_SIZE = {
  AUDIO: 500 * 1024 * 1024, // 500MB
  IMAGE: 10 * 1024 * 1024, // 10MB
} as const;
