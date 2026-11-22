import { gql } from "@apollo/client";

export const GET_SCORES = gql`
  query GetScores {
    getScores {
      id
      player
      score
      date
    }
  }
`;
