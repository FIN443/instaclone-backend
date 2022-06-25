import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword, token }
    ) => {
      // Get id from token
      const { id } = await jwt.verify(token, process.env.SECRET_KEY);
      // if newPassword hash newPassword
      let hashPassword = null;
      if (newPassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        hashPassword = await bcrypt.hash(newPassword, salt);
      }
      // Search user with token.id and update
      const updatedUser = await client.user.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashPassword && { password: hashPassword }),
        },
      });
      // if user return status ok
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update profile.",
        };
      }
    },
  },
};
