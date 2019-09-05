import React from 'react';

import './PlanItem.css'

import alt from '../../../materials/icons/alt.png';

const planItem = props => (
    <li key={props.id} className="plans__list-item">
        <div className="PlanItem-Container">
            <div className="Icon-Container">
                <img src={require(`../../../materials/icons/${props.marker}.png`)} alt={alt} />
            </div>
            <div className="PlanBody-Container">
                <h2>{props.title}</h2>
            </div>
        </div>
        <hr />
    </li>
);

export default planItem;