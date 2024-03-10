const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const gfs  = require('../server');


const getUser = asyncHandler(async (req, res) => {
    console.log(gfs);
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    gfs.files.findOne({ _id: user.profileImage }, (err, file) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (!file || file.length === 0) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});




//@desc Set User
// @route Post api/users
// @access public
const setUser = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.position) {
        res.status(400);
        throw new Error("Please fill the missing data");
    }
    let userData
    if(req.file){
     userData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        position: req.body.position,
        companyName: req.body.companyName,
        website: req.body.website,
        workingHours: {
            start: req.body.start,
            end: req.body.end
        },
        languages: req.body.languages,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        xTwitter: req.body.xTwitter,
        linkedIn: req.body.linkedIn,
        profileImage: req.file.id 
    };
}
else{
  userData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        position: req.body.position,
        companyName: req.body.companyName,
        website: req.body.website,
        workingHours: {
            start: req.body.start,
            end: req.body.end
        },
        languages: req.body.languages,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        xTwitter: req.body.xTwitter,
        linkedIn: req.body.linkedIn,
    }
}
    const user = await User.create(userData);
    res.status(200).json(user);
});



//@desc update User
// @route Put api/users
// @access Private
const updateUser = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }
    
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== undefined) {
            updateFields[key] = value;
        }
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {new:true})
    
    res.status(200).json(updatedUser)
})




module.exports ={
    getUser,
    setUser,
    updateUser,
}