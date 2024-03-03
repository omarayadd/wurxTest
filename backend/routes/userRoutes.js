const express = require('express');
const router = express.Router();
const { getUser, setUser, updateUser } = require('../controller/userController');
const upload =  require('../server');



router.get('/:id', getUser);
router.post('/', upload.single('file'), setUser);
router.put('/:id', updateUser);

module.exports = router;
