interface DispatchInstruction {
  assetId: number;
  assetName: string;
  instructedTime: Date;
  instructedVolume: number;
  retries: number;
}

export const sampleDispatchInstruction: DispatchInstruction = {
  assetId: 1,
  assetName: 'assetName',
  instructedTime: new Date(),
  instructedVolume: 1,
  retries: 1,
};
