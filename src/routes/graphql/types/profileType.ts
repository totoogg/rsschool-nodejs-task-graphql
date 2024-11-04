import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './memberType.js';
import DataLoader from 'dataloader';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.memberType.findMany({
              where: { id: { in: ids } },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.find((x: { id: string }) => x.id === id),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.memberTypeId);
      },
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    user: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source, args, context, info) => {
        const { dataloaders } = context;
        let dl = dataloaders.get(info.fieldNodes);

        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await context.prisma.user.findMany({
              where: { id: { in: ids } },
            });

            const sortedInIdsOrder = ids.map((id) =>
              rows.find((x: { id: string }) => x.id === id),
            );

            return sortedInIdsOrder;
          });

          dataloaders.set(info.fieldNodes, dl);
        }

        return dl.load(source.userId);
      },
    },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  }),
});
