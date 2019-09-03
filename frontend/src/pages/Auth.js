import React, { Component } from 'react';

import AuthContext from '../context/authContext';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true,
        isFail: 0, // 0:성공. 1:실패 2:이메일중복 3:아이디중복 4:패스워드불일치
        signupSuccess: false
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.idEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    modalConfirmHandler = () => {
        this.setState({isFail: 0, signupSuccess: false});
        if(this.state.signupSuccess) {
            this.setState({isLogin: true});
        }

        if(this.idEl.current) {
            this.idEl.current.value = '';
        }
        if(this.emailEl.current) {
            this.emailEl.current.value = '';
        }
        if(this.passwordEl.current) {
            this.passwordEl.current.value = '';
        }        
    }

    switchModeHandelr = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        })
    }

    submitHandler = (event) => {
        event.preventDefault();

        const id = this.idEl.current.value;
        const password = this.passwordEl.current.value;
        let email;
        if(!this.state.isLogin)
            email = this.emailEl.current.value;

        if(id.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        if(!this.state.isLogin && email.trim().length === 0) {
            return;
        }

        let requestBody = {
            type: 'LOGIN',
            id: id,
            password: password
        };

        if(!this.state.isLogin) {
            requestBody = {
                type: 'REGIST',
                id: id,
                email: email,
                password: password,
            };
        }

        fetch('http://localhost:8000/auth', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.error) {
                if(resData.error === 'Email') {
                    this.setState({isFail: 2, signupSuccess: false});
                }
                if(resData.error === 'ID') {
                    this.setState({isFail: 3, signupSuccess: false});
                }
                if(resData.error === 'LoginFail') {
                    this.setState({isFail: 4, signupSuccess: false});
                }
            } 

            if(this.state.isLogin && resData.token) {
                this.context.login(
                    resData.token, 
                    resData.userId,
                    email
                );
            }
            else if(!this.state.isLogin && resData._id) {
                this.setState({signupSuccess: true});
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({isFail: 1, signupSuccess: false});
        });
    };

    render() {
        return (
            <React.Fragment>
                {(this.state.isFail > 0 || this.state.signupSuccess) && <Backdrop />}
                {this.state.isFail === 4 && this.state.isLogin && <Modal 
                    title='Login Fail' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>You entered wrong ID or Password!</p>
                </Modal>}

                {this.state.isFail === 3 && !this.state.isLogin && <Modal 
                    title='Signup Fail' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>The ID is already exist!</p>
                </Modal>}

                {this.state.isFail === 2 && !this.state.isLogin && <Modal 
                    title='Signup Fail' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>The Email is already exist!</p>
                </Modal>}

                {this.state.isFail === 1 && !this.state.isLogin && <Modal 
                    title='Server error' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>Oops! Please try again!</p>
                </Modal>}

                {this.state.signupSuccess && <Modal 
                    title='Signup Success' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>You can login now!</p>
                </Modal>}

                {!this.state.isFail &&
                    <div id="form-container">
                        <div id="container-title">
                            <h1>{this.state.isLogin ? 'Sign in' : 'Sign up'}</h1>
                        </div>
                        <div id="container-body">
                            <form className="auth-form" onSubmit={this.submitHandler}>
                                <div className="form-control">
                                    <input type="text" id="text" placeholder="Username" ref={this.idEl} />
                                </div>
                                {!this.state.isLogin && 
                                <div className="form-control">
                                    <input type="email" id="email" placeholder="Email" ref={this.emailEl} />
                                </div>}
                                <div className="form-control">
                                    <input type="password" id="password" placeholder="Password" ref={this.passwordEl} />
                                </div>
                                <div id="auth-submit">
                                    <button type="submit">{this.state.isLogin ? 'SIGN IN' : 'SIGN UP'}</button>
                                </div>
                                <div id="auth-toggle">
                                    <h1>{this.state.isLogin ? 'Don`t have an account?' : 'have an account?'}</h1>
                                    <button type="button" onClick={this.switchModeHandelr}>
                                        {this.state.isLogin ? 'SIGN UP NOW' : 'SIGN IN NOW'}
                                    </button> 
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default AuthPage;