export const pdfFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new Error('Apenas arquivos PDF são permitidos!'), false);
  }
  callback(null, true);
}; 