import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeId } from './types/memberType.js';
import { UserType } from './types/userType.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/postType.js';
import { ProfileType } from './types/profileType.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),

      async resolve(parent, args, context) {
        return await context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      async resolve(parent, args, context) {
        const result = await context.prisma.memberType.findUnique({
          where: { id: args.id },
        });

        return result || null;
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),

      async resolve(parent, args, context) {
        return await context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      async resolve(parent, args, context) {
        const result = await context.prisma.user.findUnique({
          where: { id: args.id },
        });

        return result || null;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),

      async resolve(parent, args, context) {
        return await context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      async resolve(parent, args, context) {
        const result = await context.prisma.post.findUnique({
          where: { id: args.id },
        });

        return result || null;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),

      async resolve(parent, args, context) {
        return await context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      async resolve(parent, args, context) {
        const result = await context.prisma.profile.findUnique({
          where: { id: args.id },
        });

        return result || null;
      },
    },
  },
});
