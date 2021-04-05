const express = require('express');
const router = express.Router();
const User = require('../models/user');

// render the registration form //
router.get('/register', (req, res) => {
   res.render ('users/register');
});

router.post('/register', async(req, res) => {
   res.send(req.body);
})

module.exports = router;