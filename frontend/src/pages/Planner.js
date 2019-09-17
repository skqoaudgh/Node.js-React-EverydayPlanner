import React, { Component } from 'react';
import Calendar from 'react-calendar';

import AuthContext from '../context/authContext';
import PlanList from '../components/PlanList/PlanList';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from '../components/Spinner/Spinner';
import MarkerType from '../components/MarkerType/MarkerType';
import RepeatOption from '../components/RepeatOption/RepeatOption'

import './Planner.css';

class PlannerPage extends Component {
    date = new Date();
    state = {
        date: new Date(new Date(this.date.getTime() + (this.date.getTimezoneOffset()*60*1000)).toISOString().split('T')[0]), 
        plans: [],
        checks: [],
        selectedPlans: [],
        isLoading: true,
        isEditing: false,
        isFail: false,
        isManipulating: '',
        manipulatedPlan: '',
        markerType: 'game-pad',
        repeatOption: 'NoRepeat'
    }
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.detailEl = React.createRef();
        this.yearEl = React.createRef();
        this.monthEl = React.createRef();
        this.dayEl = React.createRef();
        // date, creator
    }

    componentDidMount() {
        this.fetchPlanner();

    }

    componentWillUnmount() {
        this.isActive = false;
    }

    fetchPlanner() {
        this.setState({isLoading: true});

        fetch('http://localhost:8000/planner', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData && resData.result === 'authError') {
                this.context.logout();
            }
            else {
                const plans = resData;
                if(this.isActive) {
                    this.setState({plans: plans});
                    this.fetchCheck();
                }
            }
        })
        .catch(err => {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading: false});
            }
        });
    }

    fetchSelectedPlans(date) {
        let selectedPlans = this.state.plans.filter(plan => {
            const planDate = new Date(plan.Date);
            const deadlineDate = new Date(plan.Deadline);
            plan.isChecked = false;

            this.state.checks.forEach(check => {
                const checkDate = new Date(check.Date);
                checkDate.setHours(0);
                if(date.getTime() === checkDate.getTime() && plan._id === check.Plan && check.isChecked) {
                    plan.isChecked = true;
                    return;
                }
            });

            if(deadlineDate.getTime() >= date.getTime()) {
                switch(plan.RepeatOption) {
                    case 'NoRepeat': {
                        if(date === planDate) return true;
                        else return false;
                    }
                    case 'Daily': {
                        return true;
                    }
                    case 'Weekly': {
                        if(date.getDay() === planDate.getDay()) return true;
                        else return false;
                    }
                    case 'Monthly': {
                        if(date.getDate() === planDate.getDate()) return true;
                        else return false;
                    }
                    default: {
                        return false;
                    }
                }
            }
            else return false;
        });
        this.setState({selectedPlans: selectedPlans});
    }

    fetchCheck() {
        fetch('http://localhost:8000/planner/check', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData && resData.result === 'authError') {
                this.context.logout();
            }
            else {
                const checks = resData;
                if(this.isActive) {
                    this.setState({checks: checks, isLoading: false});
                    this.state.date.setHours(0);
                    this.fetchSelectedPlans(this.state.date);
                }
            }
        })
        .catch(err => {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading: false});
            }
        });
    }

    checkChangeHandler = (event) => {
        event.persist();

        let requestBody = {
            plan: event.target.getAttribute('name'),
            date: this.state.date
        }
        event.target.disabled = true;

        fetch('http://localhost:8000/planner/check', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json',
                'Authorization': this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData && resData.result === 'authError') {
                this.context.logout();
            }
            else {
                const result = resData.result;
                if(result) {
                    event.target.disabled = false;

                    this.state.checks.forEach(check => {
                        const checkId = check._id;
                        if(checkId === result) {
                            check.isChecked = !check.isChecked;
                            console.log(check.isChecked);
                            return;
                        }
                    });
                    this.fetchSelectedPlans(this.state.date);
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    addButtonHandler = () => {
        this.setState({isEditing: true});
    }

    modalCancelHandler = () => {
        this.setState({isEditing: false, isFail: false, isManipulating: ''});
    };

    modalConfirmHandler = () => {
        if(!this.titleEl.current.value || !this.detailEl.current.value || !this.yearEl.current.value || !this.monthEl.current.value || !this.dayEl.current.value) {
            return false;
        }
        else {
            this.dayEl.current.value = parseInt(this.dayEl.current.value) + 1;
            let requestBody = {
                date: this.state.date,
                deadline: new Date(`${this.yearEl.current.value}-${this.monthEl.current.value}-${this.dayEl.current.value}`),
                repeatOption: this.state.repeatOption,
                title: this.titleEl.current.value,
                detail: this.detailEl.current.value,
                marker: this.state.markerType
            };

            fetch('http://localhost:8000/planner', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': this.context.token
                }
            }).then(res => {
                if(res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if(resData.result === 'done') {
                    this.setState({isEditing: false, isFail: false});
                    this.fetchPlanner();
                }
                else {
                    this.context.logout();
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({isEditing: false, isFail: false});
            });
        }
    }

    modalErrorHandler = () => {
        this.setState({isEditing: false, isFail: false});
    }

    onCalendarChange = date => {
        this.setState({date});
        this.fetchSelectedPlans(date);
    }

    markerTypeChangeHandler = (event) => {
        this.setState({markerType: event.target.value});
    }

    repeatOptionChangeHandler = (event) => {
        this.setState({repeatOption: event.target.value});
    }
    
    itemModifyHandler = (plan) => {
        this.setState({isManipulating: 'MODIFY', manipulatedPlan: plan});
    }

    modalItemModifyHandler = () => {
        let requestBody = {
            deadline: new Date(`${this.yearEl.current.value}-${this.monthEl.current.value}-${this.dayEl.current.value}`),
            repeatOption: this.state.repeatOption,
            title: this.titleEl.current.value,
            detail: this.detailEl.current.value,
            marker: this.state.markerType
        };

        fetch('http://localhost:8000/planner/'+this.state.manipulatedPlan._id, {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json',
                'Authorization': this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.result === 'done') {
                this.setState({isEditing: false, isFail: false, isManipulating: false});
                this.fetchPlanner();
            }
            else {
                this.context.logout();
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({isEditing: false, isFail: false, isManipulating: false});
        });
    }

    itemDeleteHandler = (plan) => {
        this.setState({isManipulating: 'DELETE', manipulatedPlan: plan});
    }

    modalItemDeleteHandler = async () => {
        fetch('http://localhost:8000/planner/'+this.state.manipulatedPlan._id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.result === 'done') {
                this.setState({isEditing: false, isFail: false, isManipulating: false});
                this.fetchPlanner();
            }
            else {
                this.context.logout();
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({isEditing: false, isFail: false, isManipulating: false});
        });
    }

    render() {
        return (
            <React.Fragment>
            {(this.state.isLoading || this.state.isEditing || this.state.isFail || this.state.isManipulating) && <Backdrop />}
            {this.state.isLoading && <Spinner className="spinner"/>}
            {this.state.isFail && <Modal
                title='ERROR'
                canConfirm
                confirmText='Confirm'
                onConfirm={this.modalErrorHandler}
                >
                <p>Error has occured during adding new plan!</p>
            </Modal>}
            {this.state.isEditing && <Modal 
                title='ADD NEW PLAN'
                canConfirm
                canCancel
                confirmText='Confirm'
                onConfirm={this.modalConfirmHandler}
                onCancel={this.modalCancelHandler}
                >
                <input type="text" placeholder="Title" ref={this.titleEl}></input>
                <textarea rows="4" placeholder="Detail" ref={this.detailEl}></textarea>
                <div className="repeatLabel">Deadline</div>
                <div className="date-container">
                    <input type="text" className="dateInput" placeholder="yyyy" ref={this.yearEl} defaultValue={this.state.date.getFullYear()}></input>
                    <input type="text" className="dateInput" placeholder="mm" ref={this.monthEl} defaultValue={this.state.date.getMonth()+1}></input>
                    <input type="text" className="dateInput" placeholder="dd" ref={this.dayEl} defaultValue={this.state.date.getDate()}></input>
                </div>
                <div className="repeatLabel">Marker Type</div>
                <RepeatOption onChange={this.repeatOptionChangeHandler}/>
                <div className="markerLabel">Marker Type</div>
                <MarkerType onChange={this.markerTypeChangeHandler}/>
            </Modal>}
            {this.state.isManipulating && <Modal
                title={(this.state.isManipulating==='DELETE')?'Delete plan':'Modify plan'}
                canConfirm
                canCancel
                confirmText={(this.state.isManipulating==='DELETE')?'Delete':'Modify'}
                onConfirm={(this.state.isManipulating==='DELETE')?this.modalItemDeleteHandler:this.modalItemModifyHandler}
                onCancel={this.modalCancelHandler}
                >
                {(this.state.isManipulating==='DELETE')?
                <p>Are you sure to delete this plan?</p>:
                <React.Fragment>
                    <input type="text" placeholder="Title" defaultValue={this.state.manipulatedPlan.Title} ref={this.titleEl}></input>
                    <textarea rows="4" placeholder="Detail" defaultValue={this.state.manipulatedPlan.Detail} ref={this.detailEl}></textarea>
                    <div className="repeatLabel">Deadline</div>
                    <div className="date-container">
                        <input type="text" className="dateInput" placeholder="yyyy" defaultValue={new Date(this.state.manipulatedPlan.Deadline).getFullYear()} ref={this.yearEl}></input>
                        <input type="text" className="dateInput" placeholder="mm" defaultValue={new Date(this.state.manipulatedPlan.Deadline).getMonth()+1} ref={this.monthEl}></input>
                        <input type="text" className="dateInput" placeholder="dd" defaultValue={new Date(this.state.manipulatedPlan.Deadline).getDate()} ref={this.dayEl}></input>
                    </div>
                    <div className="repeatLabel">Marker Type</div>
                    <RepeatOption onChange={this.repeatOptionChangeHandler}/>
                    <div className="markerLabel">Marker Type</div>
                    <MarkerType onChange={this.markerTypeChangeHandler}/>
                </React.Fragment>}
            </Modal>}
            {!this.state.isLoading && !this.state.isEditing && !this.state.isManipulating &&
            <div id="planner-container">
                <Calendar
                    className="planner"
                    onChange={this.onCalendarChange}
                    value={this.state.date}
                />
                <div id="plan-container">
                    <h1>My Plan</h1>
                    <hr />
                    <PlanList 
                        plans={this.state.selectedPlans}
                        userId={this.context.userId}
                        itemModifyHandler={this.itemModifyHandler}
                        itemDeleteHandler={this.itemDeleteHandler}
                        checkChangeHandler={this.checkChangeHandler}
                    />
                    <div id="plan-addBtn-Container" onClick={this.addButtonHandler}><div id="plan-addBtn">+</div></div>
                </div>
            </div>}
            </React.Fragment>
        );
    }
}

export default PlannerPage;