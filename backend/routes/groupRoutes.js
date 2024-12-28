// routes/groupRoutes.js
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createGroup, getGroups, getGroupsDetails, createGroupPost, verifyGroupAccess, fetchEvents, addEvent, deleteEvent, joinEvent } = require('../controllers/groupController');

// Route to create a group
router.post('/create', protect, createGroup);

// Route to get all groups
router.get('/get', protect, getGroups);

router.get('/:groupId', protect, getGroupsDetails);

router.post('/creategrouppost', protect,createGroupPost );

router.post('/verify-access', protect,verifyGroupAccess );

router.get('/:groupId/events',fetchEvents );

router.post('/:groupId/addevents', protect,addEvent );

router.delete('/:groupId/deleteevent/:eventId', protect,deleteEvent );


router.post('/:groupId/join/:eventId', protect,joinEvent );

module.exports = router;
