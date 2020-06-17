import Transaction from "../models/Transaction";

class TransactionController {
    async store(req, res) {
        const { title, value, type, wallet_id } = req.body;

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
