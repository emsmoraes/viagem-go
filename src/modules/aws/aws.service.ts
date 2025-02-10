import { ConfigService } from "@nestjs/config";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AwsService {
    private readonly s3Client = new S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') })
    constructor(private readonly configService: ConfigService) { }

    async post(fileName: string, file: Buffer, folder: string) {
        const Key = `${folder}/${fileName}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: 'viagem-go',
                Key,
                Body: file
            })
        )

        return `https://viagem-go.s3.sa-east-1.amazonaws.com/${Key}`;
    }

    async delete(fileName: string, folder: string) {
        const Key = `${folder}/${fileName}`;

        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: 'viagem-go',
                Key
            })
        );
    }
}
