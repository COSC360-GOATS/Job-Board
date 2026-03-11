const express = require('express');
const router = express.Router();
const { getJobs, getJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJob);

module.exports = router;