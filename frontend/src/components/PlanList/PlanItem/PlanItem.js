import React from 'react';

import './PlanItem.css'

import alt from '../../../materials/icons/alt.png';

const checkOneSelection = event => {
    const allList = document.getElementsByClassName('toggle');
    if(event.target.checked) {
        for(let i=0; i<allList.length; i++) {
            if(allList[i] === event.target) continue;
            if(allList[i].checked) {
                allList[i].checked = false;
            }
        }
    }
}

function formatDate(date) { 
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); 
    if (month.length < 2) 
        month = '0' + month; 
    if (day.length < 2) 
        day = '0' + day; 
    return [year, month, day].join('-'); 
}

const planItem = props => (
    <li key={props.id} className="plans__list-item">
        <div className="PlanItem-Container">
            <div className="Icon-Container">
                <img src={require(`../../../materials/icons/${props.marker}.png`)} alt={alt} />
            </div>
            <div className="PlanBody-Container">
                <h2>{props.title}</h2>
            </div>
            <div className="dropdown">
                <input type="checkbox" id={props.id} name="toggle" className="toggle" onChange={checkOneSelection}/>
                <label htmlFor={props.id} className="toggleLabel"></label>
                <div className="message">
                    <div className="detail-container">
                        <div className="plan-title">{props.title}</div>
                        -
                        <div className="plan-date">{formatDate(props.date)}~{formatDate(props.deadline)}</div>
                    </div>
                    <p className="plan-detail">{props.detail}</p>
                    <div className="delButton-container">
                        <button id="item-modify" onClick={props.itemModifyHandler.bind(this, props.plan)}>Modify</button>
                        <button id="item-delete" onClick={props.itemDeleteHandler.bind(this, props.plan)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <hr />
    </li>
);

export default planItem;