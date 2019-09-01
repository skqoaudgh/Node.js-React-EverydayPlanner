const express = require('express');
const planController = require('../controllers/myPlan');
const router = express.Router();

router.get('/', planController.getMyPlans);
router.post('/', planController.addMyPlan);

module.exports = router;