import React from 'react'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SubGreddiits = ({ changeLogin }) => {
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [flag, setFlag] = useState(0);
    const [subreddits, setSubreddits] = useState([]);
    let navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [followingSg, setFollowingSg] = useState([]);
    // const [allTags, setAllTapostsgs] = useState([]);
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        changeLogin(false);
    };

      
    useEffect(() => {
        console.log("ran again");
        axios.post('http://localhost:5000/get_sg_data')
            .then(response => {
                //storing all the sg followed by particular user in an array and then push all the data
                //of all the sg in to different array and then sending it
                setFollowingSg([]);
                let username = localStorage.getItem("username");
                response.data.forEach(item => {
                    if (item.followers.includes(username)) {
                        setFollowingSg((prevState) => [...prevState, item]);
                        console.log(item.name)
                    }
                });

                setData(response.data);
                setData1(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        setFlag(1);
    }, []);


    const allTags = data1.reduce((tags, post) => {
        post.tags.forEach((tag) => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
        return tags;
    }, []);


    console.log(followingSg);
    useEffect(() => {
        axios.post('http://localhost:5000/handleuserssg', { username: localStorage.getItem('username') })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleTagClick = (tag) => {
        const index = selectedTags.indexOf(tag);
        if (index !== -1) {
            setSelectedTags([
                ...selectedTags.slice(0, index),
                ...selectedTags.slice(index + 1),
            ]);
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const filteredPosts = data1.filter((post) => {
        return selectedTags.some((tag) => post.tags.includes(tag));
    });


    const clearFilters = () => {
        setSelectedTags([]);
    };


    const handleClick = (id) => {
        axios.post('http://localhost:5000/inc_no_of_visitors', { id: id })
        navigate(`/users/${id}/guest`);
    };

    const handleClick1 = (id) => {
        axios.post('http://localhost:5000/inc_no_of_visitors', { id: id })
        navigate(`/users/${id}/follower`);
    };

    const handleFollowSg = (name) => {
        console.log(localStorage.getItem("username"));
        axios.patch('http://localhost:5000/addrequesttosg', { name: name, username: localStorage.getItem("username") })
            .then(response => {
                alert(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSort1 = (e) => {
        e.preventDefault();
        console.log(data);
        setData([...data1].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const handleunfollow = async (id, name) => {
        if (name !== localStorage.getItem("username")) {
            await axios.post('http://localhost:5000/removefromsg', { id: id, name: localStorage.getItem("username") })
            alert("unfollowed");
        }
        else {
            alert("BC tera hi sub greddiit hai chutiye !!")
        }
    };

    const handleSort2 = (e) => {
        e.preventDefault();
        console.log(data1);
        setData([...data].sort((b, a) => a.name.localeCompare(b.name)));
    };


    // not yet checked
    const handleSort3 = (e) => {
        e.preventDefault();
        setData([...data].sort((b,a) => a.followers.length - b.followers.length));
    };

    const handleSort4 = (e) => {
        console.log("khrbf");
        e.preventDefault();
        setData([...data1]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.get(`http://localhost:5000/subreddits?name=${searchTerm}`);
        setSubreddits(response.data);
        setData([...subreddits]);
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
                                <Link className="nav-link" to="/Profile">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/Profile/mySubGreddiit">My Sub Greddiit</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleLogout}>logout</Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="text" placeholder="Search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                            <button className="btn btn-outline-success" type="submit">SEARCH</button>
                        </form>
                    </div>
                </div>
            </nav>
            <div class="sg_div">
                <button className="btn btn-outline-success sg_button " onClick={handleSort1}>sort by name A-Z</button>
                <button className="btn btn-outline-success sg_button" onClick={handleSort2}>sort by name Z-A</button>
                <button className="btn btn-outline-success sg_button" onClick={handleSort3}>sort by followers</button>
                <button className="btn btn-outline-success sg_button" onClick={handleSort4}>sort by time of creation</button>
            </div>
            <div>
                <h3>Filter by tags:</h3>
                <div style={{ whiteSpace: "nowrap" }}>
                    {allTags.map((tag) => (
                        <a
                            key={tag}
                            className={selectedTags.includes(tag) ? "selected" : ""}
                            onClick={() => handleTagClick(tag)}
                            style={{ display: "inline-block", marginRight: "10px" }}
                        >
                            {tag}
                        </a>
                    ))}
                </div>
                <button onClick={clearFilters}>Clear Filters</button>

            </div>
            <section class="vh-100 gradient-custom-2">
                <div class="container py-5 h-100">
                    <div class="row d-flex justify-content-center h-100">
                        <div class="col-md-12 col-xl-10">

                            <div class="card mask-custom">
                                <div class="card-body p-4 text-white">

                                    <div class="text-center pt-3 pb-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-todo-list/check1.webp"
                                            alt="Check" width="60" />
                                        <h2 class="my-4">SUB GREDDIITS</h2>
                                    </div>

                                    <table class="table text-white mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">NAME</th>
                                                <th scope="col">DESCRIPTION</th>
                                                <th scope="col">BANNED</th>
                                                <th scope="col">POSTS</th>
                                                <th scope="col">MEMBERS</th>
                                                <th scope="col">OPEN</th>
                                                <th scope="col">FOLLOW</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredPosts.map(item => (

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
                                                        <h6 class="mb-0"><span class="align-middle">{item.banned}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.posts}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.followers.length}</span></h6>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleClick1(item._id)}>
                                                            OPEN
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleunfollow(item._id, item.username)}>
                                                            UNFOLLOW
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                        
                                        <h3>Following SG</h3>
                                        <tbody>
                                            {followingSg.map(item => (
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
                                                        <h6 class="mb-0"><span class="align-middle">{item.banned}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.posts}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.followers.length}</span></h6>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleClick1(item._id)}>
                                                            OPEN
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleunfollow(item._id, item.username)}>
                                                            UNFOLLOW
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                        <br />
                                        <h3>All sg</h3>
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
                                                        <h6 class="mb-0"><span class="align-middle">{item.banned}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.posts}</span></h6>
                                                    </td>
                                                    <td class="align-middle">
                                                        <h6 class="mb-0"><span class="badge bg-danger">{item.followers.length}</span></h6>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleClick(item._id)}>
                                                            OPEN
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="primary btn-lg" onClick={() => handleFollowSg(item.name)}>
                                                            FOLLOW
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

export default SubGreddiits
