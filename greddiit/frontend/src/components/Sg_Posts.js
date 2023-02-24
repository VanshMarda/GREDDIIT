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

const Sg_Posts = (props) => {
    const [tittle, setTittle] = useState('');
    const [post, setPost] = useState('');
    const { sub_id } = useParams();
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [comment, setComment] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [banned, setBanned] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow1(false);
    const handleShow2 = () => setShow1(true);
    const [concern, setConcern] = useState("");
    useEffect(() => {
        axios.post('http://localhost:5000/get_posts_data', { id: sub_id })
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axios.post('http://localhost:5000/get_banned_words', { id: sub_id })
            .then(response => {
                console.log(response.data[0].banned);
                setBanned(response.data[0].banned);
            })
            .catch(error => {
                console.log(error);
            });
    }, [count]);


    const handleClose1 = async (tittle) => {
        // console.log(tittle);
        setShow(false)
        await axios.post('http://localhost:5000/addComment', { tittle: tittle, comment: comment })
        alert("comment added");
        setCount(count + 1);
    };

    const handleClose3 = async (name, post1) => {
        console.log(concern);
        setShow1(false)
        await axios.post('http://localhost:5000/report_user', { id: sub_id, reported_by: localStorage.getItem("username"), reported_user: name, concern: concern, post: post1 })
        alert("user reported");
        setCount(count + 1);
    };

    function handleChange(e) {
        e.preventDefault();
        props.setModalShow(false);
        console.log(post);
        const regex = new RegExp(banned.join("|"), "gi");
        if (post.match(regex)) {
            alert("Your post contains banned keywords.");
        }
        const filtered = post.replace(regex, "***");
        setPost(filtered);
        console.log(filtered);
        try {
            const res = axios.post('http://localhost:5000/addPost', { tittle: tittle, post: filtered, id: sub_id, username: localStorage.getItem("username") })
            console.log(res.data)
        } catch (e) {
            alert(e)
        }
    }
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

    const follow = async (tittle) => {
        await axios.post('http://localhost:5000/follow_post', { tittle: tittle, curr_username: localStorage.getItem("username") })
        alert("followed");
    };


    async function savePost(tittle) {
        await axios.post('http://localhost:5000/save_post', { tittle: tittle, curr_username: localStorage.getItem("username"), id: sub_id })
        alert("saved the post");
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
            <Button variant="primary btn-lg" onClick={() => props.setModalShow(true)}>
                ADD NEW POST
            </Button>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <MDBContainer fluid>

                        <MDBCard className='text-black m-5' style={{ borderRadius: '10px' }}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">SUB GREDDIIT</p>

                                        <div className="d-flex flex-row align-items-center mb-4 ">
                                            <MDBIcon fas icon="user me-3" size='lg' />
                                            <MDBInput label='Tittle' id='form1' type='text' className='w-100' autoComplete='off' value={tittle} onChange={(event) => setTittle(event.target.value)} />
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="key me-3" size='lg' />
                                            <MDBInput label='Post' id='form4' type='text' autoComplete='off' value={post} onChange={(event) => setPost(event.target.value)} />
                                        </div>

                                        <MDBBtn className='mb-4' size='lg' onClick={handleChange}>submit</MDBBtn>

                                    </MDBCol>

                                    <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                        <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                                    </MDBCol>

                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>

                    </MDBContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
            <section class="vh-100 gradient-custom-2">
                <div class="container py-5 h-100 posts_container">
                    <div class="row d-flex h-100">
                        <div class="col-md-12 col-xl-10">

                            <div class="card mask-custom">
                                <div class="card-body p-4 text-white">

                                    <div class="text-center pt-3 pb-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                                            alt="Check" width="60" />
                                        <h2 class="my-4">Posts</h2>
                                    </div>

                                    <table class="table text-white mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">TITTLE</th>
                                                <th scope="col">POSTS</th>
                                                <th scope="col">POSTED BY</th>
                                                <th scope="col">UPVOTE</th>
                                                <th scope="col">DEVOTE</th>
                                                <th scope="col">FOLLOW</th>
                                                <th scope="col">COMMENT</th>
                                                <th scope="col">SAVE POST</th>
                                                <th scope="col">SHOW COMMENTS</th>
                                                <th scope="col">REPORT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(item => (
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
                                                        <span>{item.username}</span>
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
                                                        <Button onClick={() => follow(item.tittle)}>
                                                            FOLLOW
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={handleShow}>
                                                            COMMENT
                                                        </Button>
                                                    </td>
                                                    <td class="align-middle">
                                                        <Button variant="primary btn-sm" onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                savePost(item.tittle);
                                                            }
                                                        }>
                                                            SAVE
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
                                                        <Button variant="primary btn-sm" onClick={handleShow2}>
                                                            REPORT
                                                        </Button>
                                                    </td>
                                                    <Modal show={show1} onHide={handleClose2}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Modal heading</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body><input class="form-control" type="text" placeholder="typr concern" value={concern} onChange={(event) => setConcern(event.target.value)} readonly /></Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleClose2}>
                                                                Close
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { handleClose3(item.username, item.post) }}>
                                                                Save Changes
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
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

export default Sg_Posts
