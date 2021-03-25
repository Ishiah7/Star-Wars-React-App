const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLID }  = require('graphql');
const axios = require('axios');

// GraphQL Object Type for people.

const PeopleType = new GraphQLObjectType({
    name : 'People',
    fields: () => ({
        name: { type: GraphQLString },
        height: { type: GraphQLString },
        mass: { type: GraphQLString },
        hair_color: { type: GraphQLString },
        skin_color: { type: GraphQLString },
        eye_color: { type: GraphQLString },
        birth_year: { type: GraphQLString },
    })
})



// Root Query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // resolves all people on the API.

        people: {
            type: new GraphQLList(PeopleType),
            resolve() {
                return axios.get('https://swapi.dev/api/people')
                    .then((res: { data: any; })  => res.data.results)
            }
        },

        // resolves one person depending on the search query.

        person: {
            type: PeopleType,
            args: {
                height: {type: GraphQLString}
            },
            resolve(parent : any, args : any){
                return axios.get(`https://swapi.dev/api/people/${args.height}`)
                    .then((res : { data: any; }) => res.data);
            }
        }
    }
})

// exporting GraphQL Schema

module.exports = new GraphQLSchema({
    query: RootQuery
})