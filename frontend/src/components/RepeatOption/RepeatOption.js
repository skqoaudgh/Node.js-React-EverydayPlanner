import React from 'react';

import './RepeatOption.css'

const repeatoption = props => (
    <div className="repeatOption-Container">
        <input className="magic-radio" type="radio" id="a" name="repeatOption" value="NoRepeat" onChange={props.onChange} />
        <label htmlFor="a">No Repeat</label>
        <input className="magic-radio" type="radio" id="b" name="repeatOption" value="Weekly" onChange={props.onChange} />
        <label htmlFor="b">Weekly</label>
        <input className="magic-radio" type="radio" id="c" name="repeatOption" value="Monthly" onChange={props.onChange} />
        <label htmlFor="c">Monthly</label>
    </div>
)

export default repeatoption;