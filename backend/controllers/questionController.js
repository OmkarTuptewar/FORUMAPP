const Question = require('../models/Question');

// Controller to create a question
const createQuestion = async (req, res) => {
   const { title, description, image, username } = req.body;

   try {
      const newQuestion = new Question({ title, description, image, username });
      await newQuestion.save();
      res.status(201).json(newQuestion);
   } catch (error) {
      res.status(500).json({ message: 'Failed to post question', error });
   }
};


// Controller to get all questions
const getQuestions = async (req, res) => {
   try {
      const questions = await Question.find().sort({ createdAt: -1 });
      res.status(200).json(questions);
   } catch (error) {
      res.status(500).json({ message: 'Failed to fetch questions', error });
   }
};

module.exports = { createQuestion, getQuestions };
