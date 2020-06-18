import * as Yup from 'yup';

import Transaction from "../models/Transaction";
import Wallet from "../models/Wallet";

class TransactionController {
    async store(req, res) {
        const validationSchema = Yup.object().shape({
            title: Yup.string().required(),
            value: Yup.number().required(),
            type: Yup.mixed().oneOf(['deposit', 'withdraw']),
        });

        if(!(await validationSchema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { title, value, type, wallet_id } = req.body;

        const walletIsValid = await Wallet.findOne({
            where: {
                id: wallet_id
            }
        })

        if(!walletIsValid) {
            return res.status(401).json({ error: 'Wallet does not exists' })
        }

        const transaction = await Transaction.create({
            title,
            value,
            type,
            wallet_id
        });

        return res.json(transaction);
    }
}

export default new TransactionController();
