"use strict";
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLID } = require('graphql');
const axios = require('axios');
// GraphQL Object Type for people.
const PeopleType = new GraphQLObjectType({
    name: 'People',
    fields: () => ({
        name: { type: GraphQLString },
        height: { type: GraphQLString },
        mass: { type: GraphQLString },
        gender: { type: GraphQLString },
        homeworld: { type: GraphQLString },
    })
});
const HomeworldType = new GraphQLObjectType({
    name: 'Homeworld',
    fields: () => ({
        name: { type: GraphQLString },
        rotation_period: { type: GraphQLString },
        orbital_period: { type: GraphQLString },
    })
});
// Root Query / Resolvers
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // resolves all people on the API.
        people: {
            type: new GraphQLList(PeopleType),
            resolve(parent) {
                return axios.get('https://swapi.dev/api/people')
                    .then((res) => res.data.results);
            }
        },
        // resolves one person depending on the search query.
        person: {
            type: PeopleType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return axios.get(`https://swapi.dev/api/people/${args.id}/`)
                    .then((res) => res.data);
            }
        }
    }
});
// exporting GraphQL Schema
module.exports = new GraphQLSchema({
    query: RootQuery
});
//# sourceMappingURL=schema.js.map