/**
 * Decodes a base64 string into a Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a WAV file header for the PCM data.
 * @param dataLength length of the PCM data in bytes
 * @param sampleRate sample rate (e.g., 24000)
 * @param channelCount number of channels (e.g., 1)
 * @param bitsPerSample bits per sample (e.g., 16)
 */
function createWavHeader(dataLength: number, sampleRate: number, channelCount: number, bitsPerSample: number): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, channelCount, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * channelCount * (bitsPerSample / 8), true); // ByteRate
  view.setUint16(32, channelCount * (bitsPerSample / 8), true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // Subchunk2Size

  return new Uint8Array(header);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Wraps raw PCM data in a WAV container.
 * Gemini usually returns 24kHz, 16-bit mono PCM.
 */
export function pcmToWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const header = createWavHeader(pcmData.length, sampleRate, 1, 16);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}