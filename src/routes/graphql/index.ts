import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

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
      id: { type: new GraphQLNonNull(GraphQLString) },
      discount: { type: new GraphQLNonNull(GraphQLString) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: new GraphQLList(MemberType),
          async resolve() {
            return await prisma.memberType.findMany();
          },
        },
        // discount: {
        //   type: new GraphQLNonNull(GraphQLString),
        // },
        // postsLimitPerMonth: {
        //   type: new GraphQLNonNull(GraphQLString),
        // },
      },
    }),
  });
};

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQuery',
//     fields: {
//       testString: {
//         type: GraphQLString,
//         resolve: async () => {
//           return 'hello world';
//         },
//       },
//     },
//   }),
// });

export default plugin;
