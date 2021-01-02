/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable quotes */
import requiresAuth from "../permission";

export default {
  Message: {
    user: ({ userId }, args, { models }) =>
      models.User.findOne({ where: { id: userId } }, { raw: true }),
  },
  Query: {
    // eslint-disable-next-line no-unused-vars
    messages: requiresAuth.createResolver(
      async (parent, { channelId }, { models }) =>
        models.Message.findAll(
          { order: [["created_at", "ASC"]], where: { channelId } },
          { raw: true }
        )
    ),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          await models.Message.create({ ...args, userId: user.id });
          return true;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          return false;
        }
      }
    ),
  },
};
