import Sequelize from 'sequelize';

import User from '../app/models/User';
import Wallet from '../app/models/Wallet';
import Transaction from '../app/models/Transaction';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, Wallet, Transaction, File];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
          .map(model => model.init(this.connection))
          .map(model => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();