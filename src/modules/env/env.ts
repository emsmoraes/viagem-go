import { z } from "zod"

export const envSchema = z.object({
    PORT: z.coerce.number().optional().default(3333),
    S3_USER_AVATARS_FOLDER_PATH: z.coerce.string(),
    S3_PROPOSAL_COVERS_FOLDER_PATH: z.coerce.string()
})

export type Env = z.infer<typeof envSchema>
