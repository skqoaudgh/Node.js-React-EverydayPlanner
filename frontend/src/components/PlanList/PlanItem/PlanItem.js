import React from 'react';

import './PlanItem.css'

import gamePad from '../../../materials/icons/game-pad.png';
import goal from '../../../materials/icons/goal.png';
import tube from '../../../materials/icons/life-preserver.png';
import mail from '../../../materials/icons/mail.png';
import exercise from '../../../materials/icons/soccer.png';
import stopwatch from '../../../materials/icons/stopwatch.png';
import study from '../../../materials/icons/study.png';

const planItem = props => (
    <li key={props.id} className="plans__list-item">
        <div className="PlanItem-Container">
            <div className="Icon-Container">
                <img src={gamePad}></img>
            </div>
            <div className="PlanBody-Container">
                <h2>{props.title}</h2>
            </div>
        </div>
        <hr />
    </li>
);

export default planItem;