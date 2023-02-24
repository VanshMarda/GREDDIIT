import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, LineChart } from "recharts";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Stats = () => {
  const [members, setMembers] = useState("");
  const [loder, setLoder] = useState(0);
  const { sub_id } = useParams();
  console.log(sub_id);
  let navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.keyCode) {
        case 85: // "U" key
          navigate('/users/${sub_id}');
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

  const getMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_followers_data', { id: sub_id });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMembers();
      setMembers(data);
      setLoder(1);
    };

    fetchData();
  }, []);

  return (
    loder ? (
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
        {console.log(members[0].no_of_follower)}
        <LineChart
          width={300}
          height={300}
          data={members[0].no_of_follower}
        >
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
        </LineChart>

        <LineChart
          width={300}
          height={300}
          data={members[0].no_of_posts}
        >
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
        </LineChart>

        <LineChart
          width={300}
          height={300}
          data={members[0].no_of_visitores}
        >
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
        </LineChart>
        
        <LineChart
          width={300}
          height={300}
          data={members[0].no_of_posts}
        >
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
        </LineChart>
        
      </div>) : (<p>loading</p>)
  );
};


export default Stats
