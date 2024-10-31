import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (source, args, context) => {
        const result = await context.prisma.profile.findUnique({
          where: { userId: source.id },
        });

        return result || null;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (source, args, context) => {
        const result = await context.prisma.post.findMany({
          where: { authorId: source.id },
        });

        return result;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source, args, context) => {
        const result = await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: { in: [source.id] },
              },
            },
          },
        });

        return result;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source, args, context) => {
        const result = await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: { in: [source.id] },
              },
            },
          },
        });

        return result;
      },
    },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});
