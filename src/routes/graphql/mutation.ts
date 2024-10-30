import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { ChangeUserInput, CreateUserInput, UserType } from './types/userType.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileType,
} from './types/profileType.js';
import { ChangePostInput, CreatePostInput, PostType } from './types/postType.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.user.create({
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.profile.create({
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.post.create({
          data: args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.post.delete({
          where: {
            id: args.id,
          },
        });
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args, context) {
        return await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
      },
    },
  },
});
