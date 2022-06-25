require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUsers, protectResolver } from "./users/users.utils";

const server = new ApolloServer({
  schema,
  // Get token from request headers
  context: async ({ req }) => {
    return {
      loggedInUser: await getUsers(req.headers.token),
    };
  },
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`🚀Server is running on http://localhost:${PORT}/`));
