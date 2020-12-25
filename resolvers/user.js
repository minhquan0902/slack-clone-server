/* eslint-disable arrow-parens */
/* eslint-disable quotes */
import bcrypt from "bcrypt";
import _ from "lodash";

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    // _.pick({a:1, b:2}, 'a') => {a:1}
    return e.errors.map((x) => _.pick(x, ["path", "message"]));
  }
  return [{ path: "name", message: "something went wrong" }];
};
export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      // Store hash password inside Database.
      try {
        if (password.length < 5 || password.length > 50) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message:
                  "The password must be between 5 and 50 characters long",
              },
            ],
          };
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword,
        });

        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
