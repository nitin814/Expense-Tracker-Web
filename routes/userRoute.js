const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');

router.post('/login' , async (req,res)=> {
    try {
        const {email , password} = req.body;
        const user = await userModel.findOne({email,password})
        
        if (!user)
        {
            res.status(404).send("user not found");
        }
        res.status(200).json({
            success:true,
            user
        });
    }
    catch (e)
    {
        res.status(400).json({
            success:false,e
        })
    }
})

router.post('/register' , async (req,res)=> {
    try {
        const user = new userModel(req.body);
        await user.save();
        res.status(201).json({
            success:true,
            user
        })
    }
    catch (e)
    {
        res.status(400).json({
            success:false, e
        })
    }
})


module.exports = router;