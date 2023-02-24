import React from 'react'
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon
}
    from 'mdb-react-ui-kit';
const SavedPosts = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [count, setCount] = useState(0);

    useEffect(() => {
        axios.post('http://localhost:5000/get_saved_posts', { curr_username: localStorage.getItem("username") })
            .then(response => {
                console.log(response.data);
                setPosts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [count]);

    function upvote(tittle) {
        console.log(tittle);
        axios.post('http://localhost:5000/upvote', { tittle: tittle })
        setCount(count + 1);
    }

    function devote(tittle) {
        console.log(tittle);
        axios.post('http://localhost:5000/devote', { tittle: tittle })
        setCount(count + 1);
    }

    function handleremove(tittle) {
        axios.post('http://localhost:5000/remove_from_saved_posts', { tittle: tittle })
        setCount(count + 1);
    }

    const follow = async (tittle) => {
        await axios.post('http://localhost:5000/follow_post', { tittle: tittle, curr_username: localStorage.getItem("username") })
        alert("followed");
    };


    const handleClose1 = async (tittle) => {
        // console.log(tittle);
        setShow(false)
        await axios.post('http://localhost:5000/addComment', { tittle: tittle, comment: comment })
        alert("comment added");
        setCount(count + 1);
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
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">FOLLOW</button>
                        </form>
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
                                        <h2 class="my-4">Saved Posts</h2>
                                    </div>

                                    <table class="table text-white mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">TITTLE</th>
                                                <th scope="col">POSTS</th>
                                                <th scope="col">UPVOTE</th>
                                                <th scope="col">DEVOTE</th>
                                                <th scope="col">FOLLOW</th>
                                                <th scope="col">COMMENT</th>
                                                <th scope="col">SHOW COMMENTS</th>
                                                <th scope="col">REMOVE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {posts.map(item => (
                                                <tr class="fw-normal">
                                                    <th>
                                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                            alt="avatar 1" style={{ width: '45px' }} />
                                                        <span class="ms-2">{item.tittle}</span>
                                                    </th>
                                                    <td class="align-middle">
                                                        <span>{item.post}</span>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => upvote(item.tittle)}>
                                                            {item.upvote}
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => devote(item.tittle)}>
                                                            {item.devote}
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => follow(item.tittle)}>
                                                            FOLLOW
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={handleShow}>
                                                            COMMENT
                                                        </Button>
                                                    </td>

                                                    <Modal show={show} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Modal heading</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body><input class="form-control" type="text" placeholder="Readonly input here…" value={comment} onChange={(event) => setComment(event.target.value)} readonly /></Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleClose}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { handleClose1(item.tittle) }}>
                                                                Save Changes
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>

                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm " className="nav-link dropdown-toggle nav-item dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" /*</li>onClick={() => addComment(item.tittle)}*/>
                                                            COMMENT
                                                        </Button>
                                                        <ul className="dropdown-menu">
                                                            {item.comment.map(item1 => (
                                                                <li><a className="dropdown-item">{item1}</a></li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={() => handleremove(item.tittle)}>
                                                            REMOVE
                                                        </Button>
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

export default SavedPosts
