import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Profile = ({ setPassword, setUsername, changeLogin, username, age, city, email, phonenumber, setAge, setCity, setPhonenumber, setEmail }) => {
    //handling logout

    let navigate = useNavigate();
    const [data, setData] = useState([]);
    const [followers, setFollowers] = useState("");
    const [followersl, setFollowersl] = useState(0);
    const [followingl, setFollowingl] = useState(0);

    // listen for beforeunload event and return confirmation message
    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         event.preventDefault();
    //         event.returnValue = 'Are you sure you want to leave without saving your changes?';
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [email,phonenumber,age,city]);



    const handleLogout = () => {
        setUsername("");
        setPassword("");
        localStorage.clear();
        navigate('/');
        changeLogin(false);
    };
    const followersreq = () => {
        console.log("hefr");
        navigate('/profile/followers');
    }

    const followingreq = () => {
        console.log("hefr");
        navigate('/profile/following');
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const inputRef = useRef(null);

    const handleChanges = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem("id");
        console.log({ username });
        localStorage.setItem("phonenumber", phonenumber);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("age", age);
        localStorage.setItem("state", city);
        await axios.post('http://localhost:5000/update-user', { id: id, username: username, city: city, email: email, phonenumber: phonenumber, age: age })
            .then(response => {
                if (response.data) {
                    changeLogin(true);
                    navigate('/Profile');

                } else {
                    console.log('Username does not exist in the Atlas Cluster');
                }
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };


    useEffect(() => {
        axios.get('http://localhost:5000/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.post('http://localhost:5000/following-list', { username: localStorage.getItem("username") })
            .then(response => {
                if (response.data) {
                    let x = response.data[0].following.length;
                    console.log(x);
                    setFollowersl(x);
                } else {
                    console.log('following list not updated');
                }
            })
            .catch(error => {
                console.log(error);
            });
        axios.post('http://localhost:5000/followers-list', { username: localStorage.getItem("username") })
            .then(response => {
                if (response.data) {
                    let x = response.data[0].followers;
                    let t = x.length;
                    console.log(t);
                    setFollowingl(t);
                } else {
                    console.log('following list not updated');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    useEffect(() => {
        if (followers != "") {
            console.log(followers);
            axios.post('http://localhost:5000/update-following', { followers: followers, username: username })
                .then(response => {
                    if (response.data) {
                        console.log('followers updated')
                    } else {
                        console.log('followers not updated');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            setFollowers("");
        }
    }, [followers])


    return (
        <div className="container-xl px-4 mt-4">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Greddiit</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/Profile/mySubGreddiit">My Sub Greddiit</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Profile/SubGreddiits">SubGreddiits</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Profile/savedPosts">Saved Posts</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <hr className="mt-0 mb-4" />
            <div className="row">
                <div className="col-xl-4">
                    <div className="card mb-4 mb-xl-0">
                        <div className="card-header">Profile Picture</div>
                        <div className="card-body text-center">
                            <img className="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="" />

                            <div className="small font-italic text-muted mb-4">Welcome to Greddiit !! Your own entertainment app</div>

                            <button className="btn btn-primary" type="button">{localStorage.getItem("username")}</button>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card mb-4">
                        <div className="card-header">Account Details</div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                                    <input ref={inputRef} className="form-control" type="text" defaultValue={username} />
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputFirstName">Age</label>
                                        <input ref={inputRef} autoComplete="off" className="form-control" type="text" defaultValue={age} onBlur={(event) => setAge(event.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputLastName">City</label>
                                        <input ref={inputRef} autoComplete="off" className="form-control" type="text" defaultValue={city} onBlur={(event) => setCity(event.target.value)} />
                                    </div>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputOrgName">Email</label>
                                        <input className="form-control" id="email" type="text" defaultValue={email} onBlur={(event) => setEmail(event.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputLocation">Contact number</label>
                                        <input className="form-control" id="inputLocation" type="text" defaultValue={phonenumber} onBlur={(event) => setPhonenumber(event.target.value)} />
                                    </div>
                                </div>
                                <button className="btn btn-primary profile_button" type="button" onClick={handleChanges} >Save changes</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={followersreq}>{followingl}followers</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={followingreq}>{followersl} FOLLOWING</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={handleLogout}>LOGOUT</button>
                                <button className="btn btn-primary profile_button" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                    Show profiles
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Profiles</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="dropdown mt-3">
                        <ul>
                            {data.map(item => (
                                <>
                                    <div className="pull-right">
                                        <button type="button" className="btn btn-info btn-sm waves-effect waves-light" onClick={() => setFollowers(item.username)} >FOLLOW</button>
                                    </div>
                                    <div className="media">
                                        <div className="media-left">
                                            <a className="avatar avatar-off" href="#">
                                                <img src="https://bootdey.com/img/Content/avatar/avatar5.png" alt="" />
                                                <i></i>
                                            </a>
                                        </div>
                                        <div className="media-body">
                                            <div><h5 key={item._id} className="name" href="#">{item.username}</h5></div>
                                        </div>
                                    </div></>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile
