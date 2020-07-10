module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('wallets', 'total', {
      type: Sequelize.DOUBLE,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    }),

  down: queryInterface => queryInterface.removeColumn('wallets', 'total'),
};
