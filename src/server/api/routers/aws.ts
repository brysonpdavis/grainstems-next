import { z } from "zod";
import{ createPresignedPost, type PresignedPostOptions } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from '../../../env/server.mjs'

const s3 = new S3Client({
    credentials: {
        accessKeyId: env.AWS_COGNITO_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'us-east-1'
})

export const aws = createTRPCRouter({
    getUploadUrl: publicProcedure
        .input(z.object({ name: z.string(), type: z.string() }))
        .mutation(async ({ input }) => {

            const key = `${Math.floor(Math.random() * 10000000)}-${input.name}`
            const bucket = env.AWS_BUCKET

            const putParams: PresignedPostOptions = {
                Bucket: bucket,
                Key: key,
                Expires: 3600
            }

            const presignedUrlResponse = await createPresignedPost(s3, putParams)

            console.log('presigned post url', presignedUrlResponse)

            return {presignedUrlResponse, key, bucket}
        }),

});

