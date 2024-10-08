import express from 'express'
import User from '../models/user.model.js'


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1, _id: -1 });

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

        // here we can also apply the regex validation and phone NUmber Validation  same logic also but i am leaving for now beacuse i have alredy done on cient side

        const existingUserWithEmail = await User.find({ email });
        const existingUserWithMobileNumber = await User.find({ phoneNumber })




        if (existingUserWithEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        if (existingUserWithMobileNumber.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this phone number already exists'
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
    const userId = req.params.id;
    try {

        const existingUserWithEmail = await User.findOne({
            email: email,
            _id: { $ne: userId } // Exclude the current user from the check
        });

        const existingUserWithPhoneNumber = await User.findOne({
            phoneNumber: phoneNumber,
            _id: { $ne: userId } // Exclude the current user from the check
        });

        if (existingUserWithEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email is already taken by another user'
            });
        }

        if (existingUserWithPhoneNumber) {
            return res.status(409).json({
                success: false,
                message: 'Phone number is already taken by another user'
            });
        }



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
        return res.status(409).json({
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