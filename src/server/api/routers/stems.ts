import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const stems = createTRPCRouter({
  getSome: publicProcedure
    .input(z.object({ take: z.number(), offset: z.number() }))
    .query(({ input: { take, offset }, ctx }) => {
      return ctx.prisma.stem.findMany({
        take,
        skip: offset,
        orderBy: { createdAt: 'asc' }
      })
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.stem.findMany();
  }),
  insertUpload: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string(), name: z.string(), description: z.string().optional()}))
    .mutation(async ({input: {name, bucket, key, description}, ctx}) => {

      const url = `https://${bucket}.s3.amazonaws.com/${key}`
      
      await ctx.prisma.stem.create({data: {name, description: description ?? '', url}})
      
      return 'all good to go'
  })
});
