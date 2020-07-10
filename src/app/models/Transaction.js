import Sequelize, { Model } from 'sequelize';

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        value: Sequelize.DOUBLE,
        type: {
          type: Sequelize.ENUM,
          values: ['deposit', 'withdraw'],
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Wallet, { foreignKey: 'wallet_id', as: 'wallet' });
  }
}

export default Transaction;
