'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'transactions',
      'installments',
      {
        type: Sequelize.ENUM,
        values: ['fixed', 'unique'],
      },
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
        'transactions',
        'installments',
      );
    },
  }
