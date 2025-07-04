import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jumpRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return null;
  }),

  create: publicProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return null;
    }),
});
