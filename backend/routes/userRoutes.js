import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import User from '../model/userModel.js';
import {generateToken} from "../utils.js";

const userRouter = express.Router();

userRouter.post(
    '/login',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user)
                });
            }
        }
        res.status(401).send({message: 'Email hoặc mật khẩu không đúng'});
    })
);

export default userRouter;