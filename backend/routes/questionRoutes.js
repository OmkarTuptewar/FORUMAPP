const express = require('express');
const { createQuestion, getQuestions } = require('../controllers/questionController');
const router = express.Router();

// Route to create a new question
router.post('/', createQuestion);

// Route to get all questions
router.get('/', getQuestions);

module.exports = router;
