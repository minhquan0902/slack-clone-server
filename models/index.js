/* eslint-disable quotes */
import Sequelize from "sequelize";

const sequelize = new Sequelize("slack", "root", "anhthu3105", {
  dialect: "mysql",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: {
    paranoid: true,
    underscored: true,
  },
});

sequelize.sync();

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
