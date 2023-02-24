import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const OpenMsg = ({ match }) => {
    let navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [unfollowers, setUnfollowers] = useState([]);
    const [requested, setRequested] = useState([]);
    const [user, setUser] = useState([]);
    const { sub_id } = useParams();
    console.log(sub_id);

    useEffect(() => {
        axios.get(`http://localhost:5000/users/${sub_id}`)
            .then(res => {
                setUser(res.data);
                setUnfollowers(res.data.unfollowers);
                setFollowers(res.data.followers);
                setRequested(res.data.requests);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.keyCode) {
                case 85: // "U" key
                    navigate(`/users/${sub_id}`);
                    break;
                case 74: // "J" key
                    navigate(`/users/${sub_id}/requests`);
                    break;
                case 72: // "H" key
                    navigate(`/users/${sub_id}/report`);
                    break;
                case 75: // "K" key
                    navigate(`/users/${sub_id}/stats`);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const handlejoining = (e) => {
        navigate(`/users/${sub_id}/requests`);
        console.log("elff");
    };
    // console.log(followers);

    const handlereporting = (e) => {
        navigate(`/users/${sub_id}/report`)
    };

    const handleposts=(e)=>{
        navigate(`/users/${sub_id}/follower/posts`)
    }

    const handlestats = (e) => {
        navigate(`/users/${sub_id}/stats`)
    };

    return (
        <div className="container-xl px-4 mt-4">
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
                                <button className="btn btn-primary profile_button" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                    USERS
                                </button>
                                <button className="btn btn-primary profile_button" type="button" onClick={handlejoining}>JOINING REQUESTS</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={handlestats}>STATS</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={handlereporting} >REPORT</button>
                                <button className="btn btn-primary profile_button" type="button" onClick={handleposts} >POSTS</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">USERS</h5>
                </div>
                <div className="offcanvas-body">
                    <div className="dropdown mt-3">
                        <h3>Unblocked users</h3>
                        <ul>
                            {followers.map(item => (
                                <>
                                    <div className="media">
                                        <div className="media-left">
                                            <a className="avatar avatar-off" href="#">
                                                <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="" />
                                                <i></i>
                                            </a>
                                        </div>
                                        <div className="media-body">
                                            <div><h5 key={item._id} className="name" href="#">{item}</h5></div>
                                        </div>
                                    </div></>
                            ))}
                        </ul>
                        <h3>blocked users</h3>
                        <ul>
                            {unfollowers.map(item => (
                                <>
                                    <div className="media">
                                        <div className="media-left">
                                            <a className="avatar avatar-off" href="#">
                                                <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="" />
                                                <i></i>
                                            </a>
                                        </div>
                                        <div className="media-body">
                                            <div><h5 key={item._id} className="name" href="#">{item}</h5></div>
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

export default OpenMsg;
