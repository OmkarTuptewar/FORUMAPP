// routes/groupRoutes.js
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createGroup, getGroups, getGroupsDetails, createGroupPost } = require('../controllers/groupController');

// Route to create a group
router.post('/create', protect, createGroup);

// Route to get all groups
router.get('/get', protect, getGroups);

router.get('/:groupId', protect, getGroupsDetails);

router.post('/creategrouppost', protect,createGroupPost );

module.exports = router;
