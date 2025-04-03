import { AwsService } from 'src/modules/aws/aws.service';
import { extractFileName } from './extract-file-name';

export async function deleteImagesAndFiles(
  entities: { key: string; data: any[]; type: 'images' | 'files' }[],
  awsService: AwsService,
) {
  await Promise.all(
    entities.flatMap(({ key, data, type }) =>
      data.flatMap((entity) => {
        if (type === 'images') {
          const imageUrls = entity.imageUrls ?? entity.images ?? [];
          return imageUrls.map((imageUrl) =>
            awsService.delete(extractFileName(imageUrl, key), key),
          );
        }

        if (type === 'files') {
          const fileUrls = entity.fileUrls ?? entity.files ?? [];
          return fileUrls.map((fileUrl) =>
            awsService.delete(extractFileName(fileUrl, key), key),
          );
        }

        return [];
      }),
    ),
  );
}
