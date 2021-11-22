const express = require('express');
const { question, answer } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const { product_id: productId } = req.query;
  const { page, count } = req.query;
  if (!productId) return res.status(400).send('No product_id provided.');
  try {
    const result = await question.getQuestionsByProductId(
      productId,
      page,
      count
    );
    if (!result.rowCount) return res.status(404).send('No results found.');
    return res.status(200).json({
      product_id: productId,
      page,
      count,
      results: result.rows,
    });
  } catch (e) {
    return res.status(500).send();
  }
});

router.get('/:question_id/answers', async (req, res) => {
  const { question_id: questionId } = req.params;
  const { page, count } = req.query;
  if (!questionId) return res.status(400).send('No question_id provided.');
  try {
    const result = await answer.getAnswersByQuestionId(questionId, page, count);
    if (!result.rowCount) return res.status(404).send('No results found.');
    return res.status(200).json({
      question: questionId,
      page,
      count,
      results: result.rows,
    });
  } catch (e) {
    return res.status(500).send();
  }
});

router.put('/:question_id/helpful', async (req, res) => {
  const { question_id: questionId } = req.params;
  try {
    const result = await question.addQuestionHelpfulById(questionId);
    if (!result.rowCount)
      return res.status(400).send('No matching entries found.');
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send();
  }
});

router.put('/:question_id/report', async (req, res) => {
  const { question_id: questionId } = req.params;
  try {
    const result = await question.reportQuestionById(questionId);
    if (!result.rowCount)
      return res.status(400).send('No matching entries found');
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send();
  }
});

module.exports = router;
