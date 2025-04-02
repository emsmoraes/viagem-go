import { AwsService } from 'src/modules/aws/aws.service';
import { extractFileName } from './extract-file-name';

export async function deleteImagesAndFiles(
  entities: { key: string; data: any[] }[],
  awsService: AwsService,
) {
  await Promise.all(
    entities.flatMap(({ key, data }) =>
      data.flatMap((entity) => {
        const deleteImages = (entity.images ?? []).map((imageUrl) =>
          awsService.delete(extractFileName(imageUrl, key), key),
        );

        const deleteFiles = (entity.files ?? []).map((fileUrl) =>
          awsService.delete(extractFileName(fileUrl, key), key),
        );

        return [...deleteImages, ...deleteFiles];
      }),
    ),
  );
}
