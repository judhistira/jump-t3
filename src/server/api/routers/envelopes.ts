import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const envelopeRouter = createTRPCRouter({
  getIncome: publicProcedure.query(async ({ ctx }) => {
    let income = await ctx.db.income.findFirst({});

    income ??= await ctx.db.income.create({
      data: {
        amount: 999,
      },
    });

    return income;
  }),

  addIncome: publicProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { amount } = input;

      const income = await ctx.db.income.findFirst();
      console.log("Skibidi income: ", income);

      if (!income) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const updatedIncome = await ctx.db.income.update({
        data: {
          amount: income.amount + amount,
        },
        where: {
          id: income.id,
        },
      });

      return updatedIncome;
    }),

  getEnvelopes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.envelope.findMany();
  }),

  createEnvelope: publicProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const income = await ctx.db.income.findFirst({});
      if (!income) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const { amount } = input;

      if (amount > income.amount) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const envelope = await ctx.db.envelope.create({
        data: {
          amount,
        },
      });

      await ctx.db.income.update({
        data: {
          amount: income.amount - amount,
        },
        where: {
          id: income.id,
        },
      });

      return envelope;
    }),

  addToEnvelope: publicProcedure
    .input(z.object({ id: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const income = await ctx.db.income.findFirst({});
      if (!income) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const { amount, id } = input;

      if (amount > income.amount) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const envelope = await ctx.db.envelope.findFirst({
        where: {
          id: id,
        },
      });

      if (!envelope) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db.income.update({
        data: {
          amount: income.amount - amount,
        },
        where: {
          id: income.id,
        },
      });

      return await ctx.db.envelope.update({
        where: {
          id,
        },
        data: {
          amount: envelope.amount + amount,
        },
      });
    }),
  spendEnvelope: publicProcedure
    .input(z.object({ id: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { amount, id } = input;

      const envelope = await ctx.db.envelope.findFirst({
        where: {
          id: id,
        },
      });

      if (!envelope) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (envelope.amount < amount) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db.envelope.update({
        where: {
          id,
        },
        data: {
          amount: envelope.amount - amount,
        },
      });
    }),

  remove: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.db.envelope.delete({
        where: {
          id,
        },
      });
    }),
});
