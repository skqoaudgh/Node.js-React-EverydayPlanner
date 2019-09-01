const Plan =  require('../models/plan');

module.exports = {
    getMyPlans: async (req, res, next) => {
        try {

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
                throw new Error('Unauthenticated!');
            }

            const date = req.body.date;
            const repeatOption = req.body.repeatOption;
            const title = req.body.title;
            const detail = req.body.detail;

            const newPlan = new Plan({
                Creator: req.userId,
                Date: date,
                RepeatOption: repeatOption,
                Title: title,
                Detail: detail,
                IsDone: false
            });
            return res.status(200).json(await newPlan.save());
        }
        catch(err) {
            throw err;
        }
    }
}