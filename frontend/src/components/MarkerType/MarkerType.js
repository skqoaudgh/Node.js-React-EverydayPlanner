import React from 'react';

import './MarkerType.css';

import gamePad from '../../materials/icons/game-pad.png';
import goal from '../../materials/icons/goal.png';
import tube from '../../materials/icons/life-preserver.png';
import mail from '../../materials/icons/mail.png';
import exercise from '../../materials/icons/soccer.png';
import stopwatch from '../../materials/icons/stopwatch.png';
import study from '../../materials/icons/study.png';

const markertype = props => (
    <div className="markerType-Container">
        <input className="magic-radio" type="radio" id="1" name="markerType" value="game-pad" onChange={props.onChange} checked="checked" />
        <label htmlFor="1"><img src={gamePad} /></label>
        <input className="magic-radio" type="radio" id="2" name="markerType" value="goal" onChange={props.onChange} />
        <label htmlFor="2"><img src={goal} /></label>
        <input className="magic-radio" type="radio" id="3" name="markerType" value="life-preserver" onChange={props.onChange} />
        <label htmlFor="3"><img src={tube} /></label>
        <input className="magic-radio" type="radio" id="4" name="markerType" value="mail" onChange={props.onChange} />
        <label htmlFor="4"><img src={mail} /></label>
        <input className="magic-radio" type="radio" id="5" name="markerType" value="soccer" onChange={props.onChange} />
        <label htmlFor="5"><img src={exercise} /></label>
        <input className="magic-radio" type="radio" id="6" name="markerType" value="stopwatch" onChange={props.onChange} />
        <label htmlFor="6"><img src={stopwatch} /></label>
        <input className="magic-radio" type="radio" id="7" name="markerType" value="study" onChange={props.onChange} />
        <label htmlFor="7"><img src={study} /></label>
    </div>
)

export default markertype;