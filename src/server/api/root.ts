import { createTRPCRouter } from "./trpc";
import { stems } from "./routers/stems";
import {aws} from "./routers/aws"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  stems,
  aws
});

// export type definition of API
export type AppRouter = typeof appRouter;
