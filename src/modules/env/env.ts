import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number().optional().default(3333),
    S3_USER_AVATARS_FOLDER_PATH: z.coerce.string(),
    S3_PROPOSAL_COVERS_FOLDER_PATH: z.coerce.string(),
    S3_PROPOSAL_DESTINATION_COVERS_FOLDER_PATH: z.coerce.string(),
    S3_PROPOSAL_DAY_BY_DAY_COVERS_FOLDER_PATH: z.coerce.string(),
    S3_CUSTOMER_IMAGES_FOLDER_PATH: z.coerce.string(),
    S3_CUSTOMER_DOCUMENTS_FOLDER_PATH: z.coerce.string(),
    S3_TICKET_IMAGES_FOLDER_PATH: z.coerce.string(),
    S3_TICKET_PDFS_FOLDER_PATH: z.coerce.string(),
    S3_ACCOMMODATION_IMAGES_FOLDER_PATH: z.coerce.string(),
    S3_ACCOMMODATION_PDFS_FOLDER_PATH: z.coerce.string(),
    S3_CRUISE_IMAGES_FOLDER_PATH: z.coerce.string(),
    S3_CRUISE_PDFS_FOLDER_PATH: z.coerce.string(),
})

export type Env = z.infer<typeof envSchema>
