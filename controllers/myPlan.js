const Plan =  require('../models/plan');
const Check =  require('../models/check');

module.exports = {
    getMyPlans: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }
            
            const plans = await Plan.find({Creator: req.userId}).sort({Date: 'asc'});
            return res.status(200).json(plans);
        }
        catch(err) {
            throw err;
        }
    },
    addMyPlan: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }

            const date = req.body.date;
            const repeatOption = req.body.repeatOption;
            const title = req.body.title;
            const detail = req.body.detail;
            const marker = req.body.marker;
            const deadline = req.body.deadline;

            const newPlan = new Plan({
                Creator: req.userId,
                Date: date,
                Deadline: deadline,
                RepeatOption: repeatOption,
                Title: title,
                Detail: detail,
                IsDone: false,
                Marker: marker
            });
            await newPlan.save();
            
            return res.status(201).json({result: 'done'});
        }
        catch(err) {
            throw err;
        }
    },
    deletePlan: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }

            const id = req.params.id;

            const deletedPlan = await Plan.deleteOne({_id: id});
            if(!deletedPlan) {
                return res.status(200).json({result: 'error'});
            }

            return res.status(200).json({result: 'done'});
        }
        catch(err) {
            throw err;
        }
    },
    updatePlan: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }

            const id = req.params.id;

            const repeatOption = req.body.repeatOption;
            const title = req.body.title;
            const detail = req.body.detail;
            const marker = req.body.marker;
            const deadline = req.body.deadline;

            const plan = await Plan.findById(id);
            if(!plan) {
                return res.status(200).json({result: 'error'});
            }

            plan.RepeatOption = repeatOption;
            plan.Title = title;
            plan.Detail = detail;
            plan.Marker = marker;
            plan.Deadline = deadline;

            const updatedPlan = await plan.save();
            if(!updatedPlan) {
                return res.status(200).json({result: 'error'});
            }

            return res.status(200).json({result: 'done'});
        }
        catch(err) {
            throw err;
        }
    },
    getChecks: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }

            const checks = await Check.find({Creator: req.userId}).sort({Date: 'asc'});
            return res.status(200).json(checks);
        }
        catch(err) {
            throw err;
        }
    },
    checkPlan: async (req, res ,next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }
            
            const plan = req.body.plan;
            const date = req.body.date;

            const isExist = await Check.findOne({Creator: req.userId, Plan: plan, Date: date});
            if(!isExist) {
                const newCheck = new Check({
                    Creator: req.userId,
                    Plan: plan,
                    Date: date,
                    isChecked: true
                });
        
                await newCheck.save();
                return res.status(201).json({result: newCheck._id});
            }
            else {
                isExist.isChecked = !isExist.isChecked;
                await isExist.save();
                return res.status(201).json({result: isExist._id});
            }
        }
        catch(err) {
            throw err;
        }
    }
}