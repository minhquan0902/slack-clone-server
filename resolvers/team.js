/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable quotes */

import formatErrors from "../formatErrors";
import requiresAuth from "../permission";

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({
            name: "general",
            public: true,
            teamId: team.id,
          });
          await models.Channel.create({
            name: "Private",
            public: true,
            teamId: team.id,
          });
          return {
            ok: true,
            team,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err),
          };
        }
      }
    ),
  },
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },
};
