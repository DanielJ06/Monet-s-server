import Wallet from '../models/Wallet';
import User from '../models/User';

class WalletController {
  async store(req, res) {
    const { title, description, total } = req.body;
    const wallet = await Wallet.create({
      title,
      description,
      total,
      user_id: req.userId,
    });

    return res.json(wallet);
  }

  async index(req, res) {
    const wallets = await Wallet.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'title', 'description', 'total'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(wallets);
  }

  async update(req, res) {
    const { id } = req.params;

    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.status(401).json({ error: 'Wallet not found' });
    }

    const { title, description } = await wallet.update(req.body);
    return res.json({
      id,
      title,
      description,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.status(401).json({ error: 'Wallet not found' });
    }

    await wallet.destroy();

    return res.json({ Success: 'Wallet has been deleted' });
  }
}

export default new WalletController();
