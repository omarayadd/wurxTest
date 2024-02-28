const express = require('express')
const router = express.Router()
const {getUser, setUser, updateUser} = require('../controller/userController')


router.get('/:id', getUser)
router.post('/', setUser)
router.put('/:id', updateUser)


module.exports = router