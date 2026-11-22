import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Score {
    id: ID!
    player: String!
    score: Int!
    date: String!
  }

  type Query {
    getScores: [Score]
  }

  type Mutation {
    addScore(player: String!, score: Int!): Score
  }
`;
