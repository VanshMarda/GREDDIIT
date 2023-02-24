import React from 'react'
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const MysubGreddiit = (props) => {
    let navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [banned, setBanned] = useState('');
    const [words, setWords] = useState([]);
    const [words1, setWords1] = useState([]);
    const [data, setData] = useState([]);
    const [idd, setId] = useState("");
    const [count, setCount] = useState(0);
    const [removemsg, setRemovemsg] = useState("");
    function handleChange(e) {
        e.preventDefault();
        const wordsArray = banned.split(",");
        const wordsArray1 = tags.split(",");
        setWords(wordsArray);
        setWords1(wordsArray1);
        console.log(wordsArray);
        setCount(count + 1);
        props.setModalShow(false);
        console.log(wordsArray);
        try {
            const res = axios.post('http://localhost:5000/addSubgGreddiit', { name: name, description: description, tags: wordsArray1, banned: wordsArray, username: localStorage.getItem("username") })
            console.log(res.data)
        } catch (e) {
            alert(e)
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        props.changeLogin(false);
    };

    useEffect(() => {
        axios.post('http://localhost:5000/get_msg_data', { username: localStorage.getItem("username") })
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [count]);

    useEffect(() => {
        if (removemsg !== "") {
            console.log(removemsg);
            axios.post('http://localhost:5000/removefrommsg', { name: removemsg, username: localStorage.getItem("username"), id: idd })
                .then(response => {
                    if (response.data) {
                        console.log('following updated')
                    } else {
                        console.log('following not updated');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            setRemovemsg("");
            setCount(count + 1);
        }
    }, [removemsg]);

    const handleClick = (id) => {
        navigate(`/users/${id}`);
    };



    return (
        <>
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
                                <Link className="nav-link" to="/Profile/SubGreddiits">SubGreddiits</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleLogout}>logout</Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">FOLLOW</button>
                        </form>
                    </div>
                </div>
            </nav>
            <Button variant="primary btn-lg" onClick={() => props.setModalShow(true)}>
                ADD SUB GREDDIIT
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
                                            <MDBInput label='Name' id='form1' type='text' className='w-100' autoComplete='off' value={name} onChange={(event) => setName(event.target.value)} />
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="envelope me-3" size='lg' />
                                            <MDBInput label='Description' id='form2' type='text' value={description} autoComplete='off' onChange={(event) => setDescription(event.target.value)} />
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="lock me-3" size='lg' />
                                            <MDBInput label='Tags' id='form3' type='text' value={tags} autoComplete='off' onChange={(event) => setTags(event.target.value)} />
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <MDBIcon fas icon="key me-3" size='lg' />
                                            <MDBInput label='Banned Keywords' id='form4' type='text' autoComplete='off' value={banned} onChange={(event) => setBanned(event.target.value)} />
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
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center h-100">
                        <div class="col-md-12 col-xl-10">

                            <div class="card mask-custom">
                                <div class="card-body p-4 text-white">

                                    <div class="text-center pt-3 pb-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                                            alt="Check" width="60" />
                                        <h2 class="my-4">MY SUB GREDDIITS</h2>
                                    </div>

                                    <table class="table text-white mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">NAME</th>
                                                <th scope="col">DESCRIPTION</th>
                                                <th scope="col">BANNED</th>
                                                <th scope="col">POSTS</th>
                                                <th scope="col">MEMBERS</th>
                                                <th scope="col">DELETE</th>
                                                <th scope="col">OPEN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(item => (
                                                <tr class="fw-normal">
                                                    <th>
                                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                            alt="avatar 1" style={{ width: '45px' }} />
                                                        <span class="ms-2">{item.name}</span>
                                                    </th>
                                                    <td class="align-middle">
                                                        <span>{item.description}</span>
                                                    </td>
                                                    <td class="align-middle">
                                                        {item.banned.map(item1 => (
                                                            <h6 class="mb-0"><span class="align-middle">{item1}</span></h6>

                                                        ))}
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.posts}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.followers.length}</span></h6>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => {
                                                            setRemovemsg(item.name)
                                                            setId(item._id)
                                                        }} >
                                                            REMOVE
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleClick(item._id)}>
                                                            OPEN
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
        </>
    );
}


export default MysubGreddiit
