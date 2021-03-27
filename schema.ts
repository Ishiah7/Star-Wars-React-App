const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLID }  = require('graphql');
const axios = require('axios');

// GraphQL Object Type for people.


const PeopleType = new GraphQLObjectType({
    name : 'People',
    fields: () => ({
        name: { type: GraphQLString },
        height: { type: GraphQLString },
        mass: { type: GraphQLString },
        gender: { type: GraphQLString },
        homeworld_link: { type: GraphQLString },
        homeworld: { 
            type: GraphQLString,
            resolve(parent:any, args:any){
                return axios.get(parent.homeworld)
                .then((res: { data: any; })  => res.data.name)
            }
        },
    })
})

const HomeworldType = new GraphQLObjectType({
    name: 'Homeworld',
    fields: () => ({
        name: { type: GraphQLString },
        rotation_period: { type: GraphQLString },
        orbital_period: { type: GraphQLString }, 
    })
})




// Root Query 

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // resolves all people on the API.

        people: {
            type: new GraphQLList(PeopleType),
            resolve(parent: any) {
                return axios.get('https://swapi.dev/api/people')
                    .then((res: { data: any; })  => res.data.results)
            }
        },      

        // resolves one person depending on the search query.

        person: {
            type: PeopleType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent : any, args : any){
                return axios.get(`https://swapi.dev/api/people/${args.id}/`)
                    .then((res : { data: any; }) => res.data);
            }
        },

        pageSearch: {
            type: new GraphQLList(PeopleType),
            args: {
                page_number: {type: GraphQLString}
            },
            resolve(parent: any, args: any) {
                return axios.get(`https://swapi.dev/api/people/?page=${args.page_number}`)
                    .then((res: { data: any; })  => res.data.results)
            } 
        },

        characterSearch: {
            type: new GraphQLList(PeopleType),
            args: {
                character: {type: GraphQLString}
            },
            resolve(parent: any, args: any) {
                return axios.get(`https://swapi.dev/api/people/?search=${args.character}`)
                    .then((res: { data: any; })  => res.data.results)
            } 
        },
    }
})

// exporting GraphQL Schema

module.exports = new GraphQLSchema({
    query: RootQuery
})