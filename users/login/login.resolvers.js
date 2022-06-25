import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // find user with args.username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found.",
        };
      }
      // check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }
      // issue a token(jwt) and send it to the user (JSON Web Token)
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      return {
        ok: true,
        token,
      };
    },
  },
};
