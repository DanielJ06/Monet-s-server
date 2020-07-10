module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      value: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: ['deposit', 'withdraw'],
        allowNull: true,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'wallets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: queryInterface => queryInterface.dropTable('transactions'),
};
