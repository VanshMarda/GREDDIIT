import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sg_As_Guest = () => {
    const[user,setUser]=useState([]);
    const { sub_id } = useParams();
    console.log(sub_id);

    useEffect(() => {
        axios.get(`http://localhost:5000/users/${sub_id}`)
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.error(err));
        // console.log(user);
    }, []);


    return (
        <div className="container-xl px-4 mt-4">
            {/* <h6>HELLO</h6> */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
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
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">FOLLOW</button>
                        </form>
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

                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card mb-4">
                        <div className="card-header">Account Details</div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputUsername">Name</label>
                                    <input className="form-control" type="text" value={user.name} />
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputFirstName">Description</label>
                                        <input autoComplete="off" className="form-control" type="text" value={user.description} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputLastName">Banned words</label>
                                        <input autoComplete="off" className="form-control" type="text" value={user.banned} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sg_As_Guest;
