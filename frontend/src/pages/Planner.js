import React, { Component } from 'react';
import Calendar from 'react-calendar';

import AuthContext from '../context/authContext';
import PlanList from '../components/PlanList/PlanList';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import Spinner from '../components/Spinner/Spinner';

import './Planner.css';

class PlannerPage extends Component {
    state = {
        date: new Date(),
        plans: [],
        isLoading: true,
        isEditing: false,
        isFail: false
    }
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.detailEl = React.createRef();
        this.markerEl = React.createRef();
        this.repeatOptionEl = React.createRef();
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
            const plans = resData;
            if(this.isActive) {
                this.setState({plans: plans, isLoading: false});
            }
        })
        .catch(err => {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading: false});
            }
        });
    }

    addButtonHandler = () => {
        this.setState({isEditing: true});
    }

    modalCancelHandler = () => {
        this.setState({isEditing: false, isFail: false});
    };

    modalConfirmHandler = () => {
        if(!this.titleEl.current.value || !this.detailEl.current.value || !this.markerEl.current.value || !this.repeatOptionEl.current.value) {
            return false;
        }
        else {
            let requestBody = {
                date: this.state.date,
                repeatOption: this.repeatOptionEl.current.value,
                title: this.titleEl.current.value,
                detail: this.detailEl.current.value,
                marker: this.markerEl.current.value
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
                    this.setState({isEditing: false, isFail: true});
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
        this.setState({ date });
    }

    render() {
        return (
            <React.Fragment>
            {(this.state.isLoading || this.state.isEditing || this.state.isFail) && <Backdrop />}
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
                <input type="text" placeholder="Marker" ref={this.markerEl}></input>
                <input type="text" placeholder="Repeat Option" ref={this.repeatOptionEl}></input>
            </Modal>}
            {!this.state.isLoading && !this.state.isEditing && 
            <div id="planner-container">
                <Calendar
                    className="planner"
                    onCalendarChange={this.onCalendarChange}
                    value={this.state.date}
                />
                <div id="plan-container">
                    <h1>My Plan</h1>
                    <hr />
                    <PlanList 
                        plans={this.state.plans} 
                        userId={this.context.userId}
                    />
                    <div id="plan-addBtn-Container" onClick={this.addButtonHandler}><div id="plan-addBtn">+</div></div>
                </div>
            </div>}
            </React.Fragment>
        );
    }
}

export default PlannerPage;