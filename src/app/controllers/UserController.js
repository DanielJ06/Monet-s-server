import * as Yup from 'yup';

import User from "../models/User";

class UserController {
    async store(req, res) {
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(3),
        });

        if(!(await validationSchema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' })
        }
        const { id, name, email } = await User.create(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }
    async update(req, res) {
        const validationSchema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(3),
            password: Yup.string().min(3).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            )
        });

        if(!(await validationSchema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { email, oldPassword } = req.body;
        const user = await User.findByPk(req.userId)

        if (email !== user.email) {
            const userExists = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' })
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(400).json({ error: 'Old password does not match' })
        }

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        })
    }
}

export default new UserController();