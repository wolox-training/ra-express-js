'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'permission', {
      type: Sequelize.ENUM('regular', 'administrator'),
      defaultValue: 'regular',
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'permission');
    queryInterface.sequelize.query('DROP TYPE "enum_Users_permission";');
  }
};
