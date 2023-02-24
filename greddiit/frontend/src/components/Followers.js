import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Followers = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [unfollow, setUnfollow] = useState("");

  useEffect(() => {
    setCount(1);
    axios.post('http://localhost:5000/followers-list', { username: localStorage.getItem("username") })
      .then(response => {
        if (response.data) {
          setData(response.data[0].followers);
          console.log(response.data[0].followers);
        } else {
          console.log('following list not updated');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [count]);

  useEffect(() => {
    if (unfollow != "") {
      console.log(unfollow);
      axios.post('http://localhost:5000/remove', { unfollow: unfollow, username: localStorage.getItem("username") })
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
      setUnfollow("");
      setCount(count + 1);
    }
  }, [unfollow])


  return (
    <div class="followerscontainer">
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
      <div class="row bootstrap snippets bootdey">
        <div class="col-md-8 col-xs-12">
          <div class="panel" id="followers">
            <div class="panel-heading">
              <h3 class="panel-title">
                <i class="icon md-check" aria-hidden="true"></i> FOLLOWERS
              </h3>
            </div>
            <div class="panel-body">
              <ul className="list-group list-group-dividered list-group-full">
                {data.map(follower => (
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
                          <button type="button" className="btn btn-info btn-sm waves-effect waves-light" onClick={() => setUnfollow(follower)}>REMOVE</button>
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
  )
}

export default Followers
