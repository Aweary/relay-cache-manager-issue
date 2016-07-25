import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

console.log(arguments)

var userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: function () {
          console.log(arguments)
          return Promise.resolve({"name": 'meow'})
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: userType,
        args: {
          name: {
            name: 'name',
            type: GraphQLString
          }
        },
        resolve: function(source, args, context, info) {
          console.log({ source, args, context, info, arguments })
          return Promise.resolve({"name": 'meow'})
        }
      }
    }
  })
})

module.exports = schema;
