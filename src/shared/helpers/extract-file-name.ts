export function extractFileName(imageUrl: string, s3Folder: string): string {
    const basePath = `https://viagem-go.s3.sa-east-1.amazonaws.com/${s3Folder}/`;
    return imageUrl.replace(basePath, '');
  }
  