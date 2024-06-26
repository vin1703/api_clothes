const express = require('express');

const router = express.Router();

const CryptoJS = require('crypto-js');

const User = require('../models/User');

const {verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken');

router.put('/:id',verifyTokenAndAuthorization, async (req,res,next)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
})

router.delete('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('user has been deleted...');
    }catch(err){
        res.status(500).json(err);
    }
})


router.get('/find/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
       const user =  await User.findById(req.params.id);
       const {password,...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } } // Add this stage to sort by _id in ascending order
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
module.exports = router;