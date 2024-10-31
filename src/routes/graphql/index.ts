import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { RootQuery } from './query.js';
import { Mutation } from './mutation.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation,
      });

      const result = await graphql({
        schema,
        source: req.body.query,
        contextValue: { prisma },
        variableValues: req.body.variables,
      });

      return result;
    },
  });
};

export default plugin;
