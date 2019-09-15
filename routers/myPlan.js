const express = require('express');
const planController = require('../controllers/myPlan');
const router = express.Router();

router.get('/', planController.getMyPlans);
router.post('/', planController.addMyPlan);
router.delete('/:id', planController.deletePlan);
router.put('/:id', planController.updatePlan);

router.get('/check', planController.getChecks);
router.post('/check', planController.checkPlan);

module.exports = router;