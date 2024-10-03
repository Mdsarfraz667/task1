import express from 'express'
import User from '../models/user.model.js'


const router = express.Router();

router.get('/', async (req, res) => {
    console.log("HII");
    try {
        const users = await User.find();
        console.log("users", users);
        return res.json({
            success: true,
            data: users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


router.post('/', async (req, res) => {


    try {

        const { firstName, lastName, phoneNumber, email, address } = req.body;


        if (!firstName || !lastName || !phoneNumber || !email || !address) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.find({ email });
        console.log("existingUser", existingUser);

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User Already Exists'
            });
        }

        const newUser = new User({ firstName, lastName, phoneNumber, email, address });
        console.log("newUser", newUser);


        const savedUser = await newUser.save();
        console.log(savedUser);
        return res.status(201).json({
            success: true,
            data: savedUser
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
});


router.patch('/:id', async (req, res) => {
    const { firstName, lastName, phoneNumber, email, address } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phoneNumber && { phoneNumber }),
                ...(email && { email }),
                ...(address && { address })
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
});




router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;