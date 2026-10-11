function writeString(view: DataView, offset: number, text: string) {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
}

export function makeToneWav(frequency: number, seconds: number): string {
  const sampleRate = 8000;
  const samples = Math.floor(sampleRate * seconds);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples * 2, true);
  for (let index = 0; index < samples; index += 1) {
    const time = index / sampleRate;
    const attack = Math.min(1, index / 180);
    const release = Math.min(1, (samples - index) / 360);
    const sample = Math.sin(2 * Math.PI * frequency * time) * attack * release * 0.35;
    view.setInt16(44 + index * 2, Math.round(sample * 32767), true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export const localTones = [
  makeToneWav(246, 0.7),
  makeToneWav(330, 0.7),
  makeToneWav(196, 0.8),
] as const;
