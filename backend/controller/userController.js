const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


//@desc Get Users
// @route Get api/users
// @access Private
const getUser = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    res.status(200).json(user)
})


//@desc Set User
// @route Post api/users
// @access public
const setUser = asyncHandler(async(req, res)=>{
    if(!req.body.name || !req.body.position || !req.body.email || !req.body.phone){
        res.status(400)
        throw new Error("Please fill the missing data")
    }
     const userData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        position: req.body.position,
        companyName: req.body.companyName,
        website: req.body.website,
        image: req.body.image,
        workingHours: {
            start: req.body.start,
            end: req.body.end
        },
        languages: req.body.languages,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        xTwitter: req.body.xTwitter,
        linkedIn: req.body.linkedIn
    };

    const user = await User.create(userData);
    res.status(200).json(user);
})

//@desc update User
// @route Put api/users
// @access Private
const updateUser = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true,})
    res.status(200).json(updatedUser)
})
module.exports ={
    getUser,
    setUser,
    updateUser
}