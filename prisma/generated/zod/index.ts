import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const PostScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const EnvelopeScalarFieldEnumSchema = z.enum(['id','amount']);

export const IncomeScalarFieldEnumSchema = z.enum(['id','amount']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Post = z.infer<typeof PostSchema>

/////////////////////////////////////////
// ENVELOPE SCHEMA
/////////////////////////////////////////

export const EnvelopeSchema = z.object({
  id: z.number().int(),
  amount: z.number(),
})

export type Envelope = z.infer<typeof EnvelopeSchema>

/////////////////////////////////////////
// INCOME SCHEMA
/////////////////////////////////////////

export const IncomeSchema = z.object({
  id: z.number().int(),
  amount: z.number(),
})

export type Income = z.infer<typeof IncomeSchema>
