const express = require('express');
const router = express.Router();
const moment = require('moment')
const transactionModel = require('../models/transactionModel')

router.post('/gettransactions' , async (req,res) => {
    try 
    {   
        const {frequency , selectedDate , type} = req.body;
        const allTransactions = await transactionModel.find({ 
            ...(frequency!=="custom" ? {date:{$gt : moment().subtract(Number(frequency) , "d").toDate() }, } 
                            : { date: { $gte: selectedDate[0], $lte: selectedDate[1] }}),
            ...(type!=="all" && {type}) ,
                userid : req.body.userid});
        res.status(200).json(allTransactions);
    }
   catch (e)
   {
    res.status(500).json(e);
   }
})

router.post('/addtransactions' , async (req,res) => {
    try 
    {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).send('Transaction created')
    }
    catch (e)
    {
        res.status(500).json(e);
    }
})

router.post('/edittransactions' , async (req,res) => {
    try 
    {
        await transactionModel.findOneAndUpdate({_id : req.body.transactionid} , req.body.payload)
        res.status(201).send('Edited Succesfully')
    }
    catch (e)
    {
        res.status(500).json(e);
    }
})

router.post('/deletetransactions' , async (req,res) => {
    try 
    {
        await transactionModel.findOneAndDelete({_id : req.body.transactionid})
        res.status(201).send('Deleted Succesfully')
    }
    catch (e)
    {
        res.status(500).json(e);
    }
})

module.exports = router;