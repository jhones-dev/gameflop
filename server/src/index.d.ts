import type { users } from '@prisma/client';
import type express from 'express';

export type ApolloContext = {
  req: express.Request;
  res: express.Response;
  user?: users;
};

export type BaseError = {
  __typename: string;
  statusCode: string;
  message: string | Error;
};

export type InputError = {
  __typename: 'InputError';
  field: string;
  details?: string;
} & BaseError;

export type InternalError = {
  __typename: 'InternalError';
  action: string;
  operation?: string;
  details?: string | Error;
} & BaseError;
