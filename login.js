const router = require('express').Router();
let User = require('../models/User'); 

router.route('/login').get((req, res)=> {
    User.find()
        .then(users=> res.json(users))
        .catch(err=> res.status(400).json('Error: '+err))
})


router.route('/add').post((req, res)=> {

    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username})
    newUser.save()
        .then(()=> res.json('User Added!'))
        .catch(err=> res.status(400).json('Error: HERE'+err))
})

module.exports=router; 