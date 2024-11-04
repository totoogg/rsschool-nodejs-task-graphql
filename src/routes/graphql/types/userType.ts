/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import DataLoader from 'dataloader';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.profile.findMany({
              where: { userId: { in: ids } },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.find((x: { userId: string }) => x.userId === id),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id) || null;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.post.findMany({
              where: { authorId: { in: ids } },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x: { authorId: string }) => x.authorId === id),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.user.findMany({
              where: {
                subscribedToUser: {
                  some: {
                    subscriberId: { in: ids },
                  },
                },
              },
              include: {
                subscribedToUser: true,
              },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x) => !!x.subscribedToUser.find((y) => y.subscriberId === id)),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.user.findMany({
              where: {
                userSubscribedTo: {
                  some: {
                    authorId: { in: ids },
                  },
                },
              },
              include: {
                userSubscribedTo: true,
              },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.filter((x) => !!x.userSubscribedTo.find((y) => y.authorId === id)),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.id);
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
