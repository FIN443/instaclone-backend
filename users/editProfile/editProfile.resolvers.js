import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword },
  { loggedInUser }
) => {
  // if server context has user get user
  // console.log(loggedInUser);
  // if not loggedIn
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
      id: loggedInUser.id,
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
};

export default {
  Mutation: {
    // protectedResolver() is verify user
    editProfile: protectedResolver(resolverFn),
  },
};
