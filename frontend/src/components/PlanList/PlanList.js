import React from 'react';

import PlanItem from './PlanItem/PlanItem';

import './PlanList.css';

const PlanList = props => {
    const plans = props.plans.map(plan => {
        return (
            <PlanItem
                plan={plan}
                key={plan._id} 
                id={plan._id}
                creator={plan.Creator} 
                date={plan.Date} 
                deadline={plan.Deadline}
                repeatOption={plan.Price}
                title={plan.Title}
                detail={plan.Detail}
                isDone={plan.IsDone}
                marker={plan.Marker}
                isChecked={plan.isChecked}
                itemModifyHandler={props.itemModifyHandler}
                itemDeleteHandler={props.itemDeleteHandler}
                checkChangeHandler={props.checkChangeHandler}
            />
        );
    });
    
    return <ul className="plan__list">{plans}</ul> 
};

export default PlanList;