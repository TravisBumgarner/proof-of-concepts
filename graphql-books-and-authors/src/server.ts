const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,

} = require('graphql')

import * as dbQueries from './db/queries'

const app = express()


const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        // author: {
        //     type: AuthorType,
        //     resolve: (book: Book) => {
        //         return authors.find(author => author.id === book.authorId)
        //     }
        // }
    })
})

// const AuthorType = new GraphQLObjectType({
//     name: 'Author',
//     description: 'This represents a author of a book',
//     fields: () => ({
//         id: { type: GraphQLNonNull(GraphQLInt) },
//         name: { type: GraphQLNonNull(GraphQLString) },
//         books: {
//             type: new GraphQLList(BookType),
//             resolve: (author: Author) => {
//                 return books.filter(book => book.authorId === author.id)
//             }
//         }
//     })
// })

type BookQueryArgs = {
    ids?: number[]
}

type AuthorQueryArgs = {
    filterIds?: number[]
}

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Some/All Books',
            args: {
                ids: { type: GraphQLList(GraphQLInt) }
            },
            resolve: (parent: any, args: BookQueryArgs) => dbQueries.selectBooksByIds(args.ids)

        },
        // authors: {
        //     type: new GraphQLList(AuthorType),
        //     description: 'List of All Authors',
        //     resolve: (parent: undefined, args: AuthorQueryArgs) => typeof args.filterIds !== 'undefined' ? authors.filter(author => args.filterIds?.includes(author.id)) : authors,
        //     args: {
        //         filterIds: { type: GraphQLList(GraphQLInt) }
        //     }
        // }
    })
})

type BookMutationArgs = {
    name: string
    authorId: number
}

type AuthorMutationArgs = {
    name: string
}

// const RootMutationType = new GraphQLObjectType({
//     name: 'Mutation',
//     description: 'Root Mutation',
//     fields: () => ({
//         addBook: {
//             type: BookType,
//             description: 'Add a book',
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 authorId: { type: GraphQLNonNull(GraphQLInt) }
//             },
//             resolve: (parent: undefined, args: BookMutationArgs) => {
//                 const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
//                 books.push(book)
//                 return book
//             }
//         },
//         addAuthor: {
//             type: AuthorType,
//             description: 'Add an author',
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) }
//             },
//             resolve: (parent: undefined, args: AuthorMutationArgs) => {
//                 const author = { id: authors.length + 1, name: args.name }
//                 authors.push(author)
//                 return author
//             }
//         }
//     })
// })

const schema = new GraphQLSchema({
    query: RootQueryType,
    // mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))