import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, validate, parse } from 'graphql';
import { RootQuery } from './query.js';
import { Mutation } from './mutation.js';
import depthLimit from 'graphql-depth-limit';

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

      const validation_errors = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (validation_errors.length > 0) {
        return {
          errors: validation_errors,
        };
      }

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
