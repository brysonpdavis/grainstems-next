import { z } from "zod";
import { Stem } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const sortStemsByPriority = (a: Stem, b: Stem) => {
  if (!(a.priority || b.priority)) {
    return a.createdAt.valueOf() - b.createdAt.valueOf()
  }

  if (!b.priority) return -1

  if (!a.priority) return 1

  return b.priority - a.priority
}

export const stems = createTRPCRouter({
  getSome: publicProcedure
    .input(z.object({ take: z.number(), offset: z.number() }))
    .query(async ({ input: { take, offset }, ctx }) => {
      const stems = await ctx.prisma.stem.findMany({
        take,
        skip: offset,
        orderBy: { createdAt: 'asc' }
      })
      return stems.sort(sortStemsByPriority)
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.stem.findMany()).sort(sortStemsByPriority)
  }),
  insertUpload: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string(), name: z.string(), description: z.string().optional()}))
    .mutation(async ({input: {name, bucket, key, description}, ctx}) => {

      const url = `https://${bucket}.s3.amazonaws.com/${key}`
      
      await ctx.prisma.stem.create({data: {name, description: description ?? '', url}})
      
      return 'all good to go'
  })
});
