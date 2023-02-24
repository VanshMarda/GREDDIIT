import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
    const [requested, setRequested] = useState([]);
    const [sg, setSg] = useState("");
    const { sub_id } = useParams();
    console.log(sub_id);
    let navigate = useNavigate();
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

    useEffect(() => {
        axios.get(`http://localhost:5000/users/${sub_id}`)
            .then(res => {
                setRequested(res.data.requests);
                setSg(res.data.name);
            })
            .catch(err => console.error(err));
    }, []);

    const handleAccept = (name) => {
        console.log(name, sub_id);
        axios.post('http://localhost:5000/handleacceptinsg', { name: name, id: sub_id, sg: sg })
            .then(res => console.log(res.data.message))
            .catch(err => console.error(err));
        setRequested(prevItems => prevItems.filter(item => item !== name));
    };

    const handleReject = (name) => {
        console.log("ukrf");
        axios.get('http://localhost:5000/handlerejectinsg', { name: name, id: sub_id })
            .then(res => { })
            .catch(err => console.error(err));
        setRequested(prevItems => prevItems.filter(item => item !== name));
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Greddiit</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/Profile">Home</Link>
                            </li>
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
            <div class="followerscontainer">
                <div class="row bootstrap snippets bootdey">
                    <div class="col-md-8 col-xs-12">
                        <div class="panel" id="followers">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <i class="icon md-check" aria-hidden="true"></i> FOLLOWING REQUESTS
                                </h3>
                            </div>
                            <div class="panel-body">
                                <ul className="list-group list-group-dividered list-group-full">
                                    {requested.map(follower => (
                                        <li className="list-group-item" key={follower}>
                                            <div className="media">
                                                <div className="media-left">
                                                    <a className="avatar avatar-off" href="javascript:void(0)">
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
                                                        <i></i>
                                                    </a>
                                                </div>
                                                <div className="media-body">
                                                    <div className="pull-right">
                                                        <button type="button" className="btn btn-info btn-sm waves-effect waves-light requests_button" onClick={() => handleAccept(follower)}>ACCEPT</button>
                                                        <button type="button" className="btn btn-info btn-sm waves-effect waves-light" onClick={() => handleReject(follower)}>REJECT</button>
                                                    </div>
                                                    <div><h5 className="name" href="javascript:void(0)">{follower}</h5></div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Requests
