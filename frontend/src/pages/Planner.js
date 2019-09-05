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
    state = {
        date: new Date(),
        plans: [],
        isLoading: true,
        isEditing: false,
        isFail: false,
        markerType: 'game-pad',
        repeatOption: 'NoRepeat'
    }
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.detailEl = React.createRef();
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
                localStorage.clear();
                this.setState({token: null});
                this.props.history.push('/auth');
            }
            else {
                const plans = resData;
                if(this.isActive) {
                    this.setState({plans: plans, isLoading: false});
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

    addButtonHandler = () => {
        this.setState({isEditing: true});
    }

    modalCancelHandler = () => {
        this.setState({isEditing: false, isFail: false});
    };

    modalConfirmHandler = () => {
        if(!this.titleEl.current.value || !this.detailEl.current.value) {
            return false;
        }
        else {
            let requestBody = {
                date: this.state.date,
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
                    this.setState({isEditing: false, isFail: true, token: null});
                    localStorage.clear();
                    this.props.history.push('/auth');
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

    markerTypeChangeHandler = (event) => {
        this.setState({markerType: event.target.value});
        console.log(event.target.value);
    }

    repeatOptionChangeHandler = (event) => {
        this.setState({repeatOption: event.target.value});
        console.log(event.target.value);
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
                <div className="repeatLabel">Marker Type</div>
                <RepeatOption onChange={this.repeatOptionChangeHandler}/>
                <div className="markerLabel">Marker Type</div>
                <MarkerType onChange={this.markerTypeChangeHandler}/>
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