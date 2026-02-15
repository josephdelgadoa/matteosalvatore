const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const supabase = require('../config/database');

// Middleware to protect routes and ensure admin access
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ status: 'fail', message: 'Invalid token or user no longer exists' });
    }

    // Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
        return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
    }

    req.user = user;
    next();
};

router.use(protect);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
