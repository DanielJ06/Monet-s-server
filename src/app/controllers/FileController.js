/* eslint-disable no-await-in-loop */
import { resolve } from 'path';
import csv from 'csvtojson';
import fs from 'fs';

import File from '../models/File';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });
    return res.json(file);
  }

  async csvImport(req, res) {
    const { filename: path } = req.file;
    const file = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path);

    const transactions = await csv().fromFile(file);

    async function processData(transactionArray) {
      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of transactionArray) {
        const { title, value, type, wallet_id } = transaction;

        const wallet = await Wallet.findByPk(wallet_id);
        const parsedValue = parseFloat(value);

        if (type === 'deposit') {
          const newValue = wallet.total + parsedValue;
          await wallet.update({ total: newValue });
        } else {
          const newValue = wallet.total - parsedValue;
          await wallet.update({ total: newValue });
        }

        await Transaction.create({
          title,
          value,
          type,
          wallet_id,
        });
      }
    }

    await processData(transactions);

    const csvFileExists = await fs.promises.stat(file);

    if (csvFileExists) {
      await fs.promises.unlink(file);
    }

    return res.json({ message: 'Success' });
  }
}

export default new FileController();
