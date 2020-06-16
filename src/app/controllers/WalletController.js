import Wallet from '../models/Wallet';
import User from '../models/User';

class WalletController {
    async store(req, res) {
        const { title, description } = req.body;
        const wallet = await Wallet.create({
            title,
            description,
            user_id: req.userId
        });

        return res.json({ wallet })
    }
    async index(req, res) {
        const wallets = await Wallet.findAll({ 
            where: { user_id: req.userId },
            attributes: ['title', 'description'],
            include: [{ 
                model: User,
                as: 'user',
                attributes: ['name', 'email']
            }]
        })

        return res.json(wallets);
    }
}

export default new WalletController();
