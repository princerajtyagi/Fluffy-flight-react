import { gql } from "@apollo/client";

export const ADD_SCORE = gql`
  mutation AddScore($player: String!, $score: Int!) {
    addScore(player: $player, score: $score) {
      id
      player
      score
      date
    }
  }
`;
