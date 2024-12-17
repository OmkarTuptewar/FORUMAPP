const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController');





router.get('/getnotifications', protect, getNotifications);

router.put('/:notificationId/marknotificationasread', protect,markNotificationAsRead );



module.exports = router;
