'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('wallets', 'total', {
      type: Sequelize.DOUBLE,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('wallets', 'total')
  }
};
