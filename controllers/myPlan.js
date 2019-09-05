const Plan =  require('../models/plan');

module.exports = {
    getMyPlans: async (req, res, next) => {
        try {
            if(!req.isAuth) {
                return res.status(200).json({result: 'authError'});
            }
            
            const plans = await Plan.find({Creator: req.userId});
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
    }
}