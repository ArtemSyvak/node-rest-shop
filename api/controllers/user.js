const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// add new user to db
exports.create_user = (req, res, next)=> {
    User.find({email:req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'Mail Exists'
                })
            }
            else{
                bcrypt.hash(req.body.password, 10, (err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result=>{
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err=>{
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
};

// init sign in
exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed :c'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed :c'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        // process.env.JWT_KEY,
                        'secret',
                        {
                            expiresIn: '1h'
                        }
                    );
                    res.set('Authorization', `Bearer ${token}`);
                    console.log(res.get('Authorization'));
                    return res.status(200).json({
                        message: 'Auth successful !',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed :c'
                });
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// remove user from db
exports.delete_user = (req,res,next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted!'
            })
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
};