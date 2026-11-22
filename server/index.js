import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();
app.use(cors());

async function startServer() {
  try {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    await mongoose.connect(
      "mongodb+srv://princerajtyagi:Tyagi%409661166@fluffy-flight.3mz6v5w.mongodb.net/?appName=Fluffy-flight"
    );

    console.log("MongoDB Connected ✔");
    app.listen(4000, () =>
      console.log("Server running at http://localhost:4000/graphql")
    );
  } catch (err) {
    console.error("❌ Server start FAILED:", err);
  }
}

startServer();
