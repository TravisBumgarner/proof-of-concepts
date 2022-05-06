import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import { gql } from 'apollo-server'
import { jsonEvent, JSONEventType } from '@eventstore/db-client';

import { mutationTypeDefs, mutationResolvers } from './mutations'
import { queryTypeDefs, queryResolvers } from './queries'
import { subscriptionTypeDefs, subscriptionResolvers } from './subscriptions'
import { sharedTypeDefs } from './sharedTypes'

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers
}

const schema = makeExecutableSchema({
  typeDefs: [mutationTypeDefs, queryTypeDefs, subscriptionTypeDefs, sharedTypeDefs],
  resolvers
});

export {
  schema
}