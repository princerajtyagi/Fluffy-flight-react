import Score from "./models/Score.js";

export const resolvers = {
  Query: {
    getScores: async () => Score.find()
  },

  Mutation: {
    addScore: async (_, { player, score }) => {
      const newScore = new Score({ player, score });
      await newScore.save();
      return newScore;
    }
  }
};
