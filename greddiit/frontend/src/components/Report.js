import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


const Report = () => {
    const [user, setUser] = useState([]);
    const { sub_id } = useParams();
    const [count, setCount] = useState(0);
    const [label, setLabel] = useState('Block');
    const [timer, setTimer] = useState(3);
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
        axios.post('http://localhost:5000/get_reported_people', { id: sub_id })
            .then(res => {
                setUser(res.data);
                console.log(res.data);
            })
            .catch(err => console.error(err));
    }, [count]);

    useEffect(() => {
        let interval = null;
        if (label === 'Cancel in 3 secs') {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [label]);

    const blockuser = async (id, name) => {
        if (label === 'Block') {
            setLabel('Cancel in 3 secs');
            setTimeout(async () => {
                if (label === 'Block') {
                    console.log(id, name);
                    await axios.post('http://localhost:5000/block_user', { id: id, name: name })
                        .then(res => {
                            console.log(res.body)
                        })
                        .catch(err => console.error(err));
                    setCount(count + 1);
                    setLabel("Blocked");
                }
            }, 3000);

        } else {
            setLabel('Block');
            setTimer(3);
        }
    };
    async function deletepost(id, post, name) {
        console.log(id, post);
        await axios.post('http://localhost:5000/delete_post', { id: id, post: post, name: name })
            .then(res => {
                console.log(res.body)
            })
            .catch(err => console.error(err));
        setCount(count + 1);
    }

    async function ignore(id, post, name) {
        console.log(id, post);
        await axios.post('http://localhost:5000/ignore', { id: id, post: post, name: name })
            .then(res => {
                alert(res.body.message);
            })
            .catch(err => console.error(err));
        setCount(count + 1);
    }

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
            <section class="vh-100 gradient-custom-2">
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center h-100">
                        <div class="col-md-12 col-xl-10">

                            <div class="card mask-custom">
                                <div class="card-body p-4 text-white">

                                    <div class="text-center pt-3 pb-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                                            alt="Check" width="60" />
                                        <h2 class="my-4">REPORTS</h2>
                                    </div>

                                    <table class="table text-white mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">POST</th>
                                                <th scope="col">REPORTED BY</th>
                                                <th scope="col">REPORTED USER</th>
                                                <th scope="col">CONCERN</th>
                                                <th scope="col">BLOCK USER</th>
                                                <th scope="col">DELETE POST</th>
                                                <th scope="col">IGNORE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.map(item => (
                                                <tr class="fw-normal">
                                                    <th>
                                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                            alt="avatar 1" style={{ width: '45px' }} />
                                                        <span class="ms-2">{item.post}</span>
                                                    </th>
                                                    <td class="align-middle">
                                                        <span>{item.reported_by}</span>
                                                    </td>
                                                    <td class="align-middle">
                                                        <span>
                                                            {item.reported_user}
                                                        </span>
                                                    </td>
                                                    <td class="align-middle">
                                                        <span>
                                                            {item.concern}
                                                        </span>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => blockuser(item.id, item.reported_user)}>
                                                            {label} {label === 'Cancel in 3 secs' ? timer : ''}
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => deletepost(item.id, item.post, item.reported_user)}>
                                                            delete post</Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => ignore(item.id, item.post, item.reported_user)}>
                                                            ignore</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Report
