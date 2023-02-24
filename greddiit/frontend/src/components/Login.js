import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios'
import { useState } from 'react';
var bcrypt=require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const Login = ({ username, password, setPassword, setUsername, changeLogin, setAge, setCity, setEmail, setPhonenumber}) => {
    const [state, setState] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        age: "",
        contactnumber: "",
        password: "",
        state: "",
        profession: ""
    });

    let navigate = useNavigate();
    //handling password

    function handleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmitSignUp = async (e) => {
        changeLogin(false);
        navigate('/Profile');

        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/signUp/user', state)
            console.log(res.data)
        } catch (e) {
            alert(e)
        }
        try {
            const res = await axios.post('http://localhost:5000/signUp/followers', state)
            console.log(res.data)
        } catch (e) {
            alert(e)
        }
        try {
            const res = await axios.post('http://localhost:5000/signUp/following', state)
            console.log(res.data)
        } catch (e) {
            alert(e)
        }

    }


    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
            setUsername(localStorage.getItem("username"));
            console.log("kdff")
            setPhonenumber(localStorage.getItem("phonenumber"));
            setAge(localStorage.getItem("age"));
            setCity(localStorage.getItem("state"));
            setEmail(localStorage.getItem("email"));
            navigate('/Profile');
            changeLogin(true);
        }
        else {
            navigate('/');
        }
    }, []);




    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ username });
        await axios.post('http://localhost:5000/check-username', { username: username ,password:password})
            .then(response => {
                var pass_got=response.data.password;
                if (response.data.username && bcrypt.compareSync(password,pass_got)) {
                    console.log(response.data);
                    setEmail(response.data.email);
                    setUsername(response.data.username);
                    setAge(response.data.age);
                    setPhonenumber(response.data.contactnumber);
                    setCity(response.data.state);
                    console.log('Username exists in the Atlas Cluster');
                    changeLogin(true);
                    navigate('/Profile');
                    localStorage.setItem("phonenumber", response.data.contactnumber);
                    localStorage.setItem("username", response.data.username);
                    localStorage.setItem("email", response.data.email);
                    localStorage.setItem("age", response.data.age);
                    localStorage.setItem("state", response.data.state);
                    localStorage.setItem("id", response.data._id);

                } else {
                    console.log(response.data);
                    console.log('Username does not exist in the Atlas Cluster');
                }
            })
            .catch(error => {
                console.log(error);
            });
    };


    return (
        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <h6 className="mb-0 pb-3">
                                <span>Log In </span><span>Sign Up</span>
                            </h6>

                            <input
                                className="checkbox"
                                type="checkbox"
                                id="reg-log"
                                name="reg-log"
                            />
                            <label htmlFor="reg-log"></label>
                            <div className="card-3d-wrap mx-auto">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">Log In</h4>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-group">
                                                        <input
                                                            value={username} onChange={(event) => setUsername(event.target.value)}
                                                            type="text"
                                                            name="logemail"
                                                            className="form-style"
                                                            placeholder="Username"
                                                            id="logemail"
                                                            autoComplete="on"
                                                        />
                                                        <i className="input-icon uil uil-user"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            value={password} onChange={(event) => setPassword(event.target.value)}
                                                            type="password"
                                                            name="logpass"
                                                            className="form-style"
                                                            placeholder="Your Password"
                                                            id="logpass"
                                                            autoComplete="on"
                                                        />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <button type="submit" className="btn mt-4" disabled ={!username || !password}>Submit</button>
                                                    <p className="mb-0 mt-4 text-center">
                                                        <a href="#0" className="link">Forgot your password?</a>
                                                    </p>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">Sign Up</h4>
                                                <form onSubmit={handleSubmitSignUp}>
                                                    <div className="grid-container1">
                                                        <div className="form-group  mt-2 firstname">
                                                            <input
                                                                type="text"
                                                                name="firstname"
                                                                className="form-style"
                                                                placeholder="First name"
                                                                // id="logname"
                                                                autoComplete="off"
                                                                value={state.firstname}
                                                                onChange={handleChange}
                                                            />
                                                            <i className="input-icon uil uil-user"></i>
                                                        </div>

                                                        <div className="form-group mt-2 lastname">
                                                            <input
                                                                type="text"
                                                                name="lastname"
                                                                className="form-style"
                                                                placeholder="Last Name"
                                                                id="logname"
                                                                autoComplete="off"
                                                                value={state.lastname}
                                                                onChange={handleChange}
                                                            />
                                                            <i className="input-icon uil uil-user "></i>
                                                        </div>
                                                    </div>
                                                    <div className="grid-container1">
                                                        <div className="form-group mt-2 ">
                                                            <input
                                                                type="number"
                                                                name="age"
                                                                className="form-style"
                                                                placeholder="Age"
                                                                id="logemail"
                                                                autoComplete="off"
                                                                value={state.age}
                                                                onChange={handleChange}
                                                            />
                                                            <i className="input-icon uil uil-schedule"></i>
                                                        </div>
                                                        <div className="form-group mt-2 ">
                                                            <input
                                                                type="contact number"
                                                                className="form-style"
                                                                placeholder="Contact number"
                                                                id="logemail"
                                                                autoComplete="off"
                                                                name="contactnumber"
                                                                value={state.contactnumber}
                                                                onChange={handleChange}
                                                            />
                                                            <i className="input-icon uil uil-phone-volume"></i>
                                                        </div>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            className="form-style"
                                                            placeholder="User Name"
                                                            id="logname"
                                                            autoComplete="off"
                                                            value={state.username}
                                                            onChange={handleChange}
                                                        />
                                                        <i className="input-icon uil uil-chat-bubble-user"></i>
                                                    </div>

                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-style"
                                                            placeholder="Your Email"
                                                            id="logemail"
                                                            autoComplete="off"
                                                            value={state.email}
                                                            onChange={handleChange}
                                                        />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>

                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            className="form-style"
                                                            placeholder="Your Password"
                                                            id="logpass"
                                                            autoComplete="off"
                                                            value={state.password}
                                                            onChange={handleChange}
                                                        />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="text"
                                                            name="profession"
                                                            className="form-style"
                                                            placeholder="Profession"
                                                            id="logpass"
                                                            autoComplete="off"
                                                            value={state.profession}
                                                            onChange={handleChange}
                                                        />
                                                        <i className="input-icon uil uil-user"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input
                                                            type="text"
                                                            name="state"
                                                            className="form-style"
                                                            placeholder="State"
                                                            id="logpass"
                                                            autoComplete="off"
                                                            value={state.state}
                                                            onChange={handleChange}
                                                        />
                                                        <i className="input-icon uil uil-user"></i>
                                                    </div>
                                                    <button to="/Profile" className="btn mt-4">submit</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login;