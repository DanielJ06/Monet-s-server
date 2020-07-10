import * as Yup from 'yup';
import { CronJob } from 'cron';
import { subWeeks } from 'date-fns';
import { Op } from 'sequelize';

import Transaction from "../models/Transaction";
import Wallet from "../models/Wallet";

class TransactionController {
    async index(req, res) {
        const { walletId } = req.query;
        const wallet = await Wallet.findByPk(walletId);

        if (!wallet) {
            return res.status(401).json({ error: 'Wallet not found' });
        }

        const transactions = await Transaction.findAll({
            where: { wallet_id: walletId },
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: Wallet,
                    as: 'wallet',
                    attributes: ['id', 'title', 'description']
                }
            ]
        })

        return res.json(transactions);
    }

    async weekTransactions(req, res) {
        const now = new Date();
        const lastWeek = subWeeks(now, 1);
        const { walletId } = req.query;
        const wallet = await Wallet.findByPk(walletId);

        if (!wallet) {
            return res.status(401).json({ error: 'Wallet not found' });
        }

        const transactions = await Transaction.findAll({
            where: {
                wallet_id: walletId,
                createdAt: {
                    [Op.between]: [lastWeek, now]
                },
            },
            order: [["created_at", "DESC"]],
            limit: 5,
            include: [
                {
                    model: Wallet,
                    as: 'wallet',
                    attributes: ['id', 'title', 'description']
                }
            ]
        })

        return res.json(transactions);
    }

    async store(req, res) {
        const validationSchema = Yup.object().shape({
            title: Yup.string().required(),
            value: Yup.number().required(),
            type: Yup.mixed().oneOf(['deposit', 'withdraw']),
            installments: Yup.mixed().oneOf(['fixed', 'unique']),
        });

        if(!(await validationSchema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { title, value, type, installments, wallet_id } = req.body;

        const walletIsValid = await Wallet.findOne({
            where: {
                id: wallet_id
            }
        })

        if(!walletIsValid) {
            return res.status(401).json({ error: 'Wallet does not exists' })
        }

        let { minute='*', hour='*', day='*', month='*' } = req.body
        const job = new CronJob(`0 ${minute} ${hour} ${day} ${month} *`, async () => {
            const transaction = await Transaction.create({
                title,
                value,
                type,
                installments,
                wallet_id
            });
            return transaction;
        })

        if (installments === 'fixed') {
            job.start();
        }

        if (type === 'deposit') {
            const newValue = walletIsValid.total + value;
            await walletIsValid.update({ total: newValue });
        } else {
            const newValue = walletIsValid.total - value;
            await walletIsValid.update({ total: newValue })
        }

        const transaction = await Transaction.create({
            title,
            value,
            type,
            installments,
            wallet_id
        });

        return res.json(transaction);
    }

    async update(req, res) {
        const validationSchema = Yup.object().shape({
            title: Yup.string(),
            value: Yup.number(),
            type: Yup.mixed().oneOf(['deposit', 'withdraw']),
            installments: Yup.mixed().oneOf(['fixed', 'unique']),
        });

        if(!(await validationSchema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(400).json({ error: 'Transaction does not exists' })
        }

        const { title, value, type, installments } = await transaction.update(req.body);

        return res.json({
            title,
            value,
            type,
            installments,
        });
    }

    async delete(req, res) {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(401).json({ error: 'Transaction not found' });
        }

        await transaction.destroy();

        return res.json({ Success: 'Transaction has been deleted' })
    }
}

export default new TransactionController();
