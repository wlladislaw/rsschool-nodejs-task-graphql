import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId } from './types/enums.js';


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
      // console.log(
      //   'graphqlgraphqlgraphql',
      //   graphql({
      //     schema,
      //     source: req.body.query,
      //     variableValues: req.body.variables,
      //   }),
      // );
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
    },
  });
  const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeId) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    }),
  });
  const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });
  const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: GraphQLFloat },
      profile: {type: ProfileType}
    }),
  });
  const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
    }),
  });
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        memberTypes: {
          type: new GraphQLList(MemberType),
          async resolve() {
            return await prisma.memberType.findMany();
          },
        },
        posts: {
          type: new GraphQLList(PostType),
          async resolve() {
            return await prisma.post.findMany();
          },
        },
        users: {
          type: new GraphQLList(UserType),

          async resolve() {
            return await prisma.user.findMany();
          },
        },
        profiles: {
          type: new GraphQLList(ProfileType),
          async resolve() {
            return await prisma.profile.findMany();
          },
        },
        post: {
          type: PostType,
          args: { id: { type: new GraphQLNonNull(UUIDType) } },
          async resolve(_, { id }) {
            const res = await prisma.post.findUnique({ where: { id: String(id) } });

            return res;
          },
        },
        user: {
          type: UserType,
          args: { id: { type: new GraphQLNonNull(UUIDType) } },
          async resolve(_, { id }) {
            const res = await prisma.user.findUnique({ where: { id: String(id) } });

            return res;
          },
        },
        profile: {
          type: ProfileType,
          args: { id: { type: new GraphQLNonNull(UUIDType) } },
          async resolve(_, { id }) {
            const res = await prisma.profile.findUnique({ where: { id: String(id) } });

            return res;
          },
        },
       
        memberType: {
          type: MemberType,
          args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
          async resolve(_, { id }) {
            const res = await prisma.memberType.findUnique({ where: { id: String(id) } });

            return res;
          },
        },
      },
    }),
  });
};

export default plugin;
