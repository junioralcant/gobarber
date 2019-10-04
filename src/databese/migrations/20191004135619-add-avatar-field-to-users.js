"use strict";

// migration para fazer update na tabela users, adiciona a coluna avatar_id
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "avatar_id", {
      type: Sequelize.INTEGER,
      references: { model: "files", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "avatar_id");
  }
};
