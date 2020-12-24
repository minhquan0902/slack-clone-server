export default {
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return false;
      }
    },
  },
};