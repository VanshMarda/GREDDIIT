import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login'
import { useState } from 'react';
import Profile from './components/Profile'
import Followers from './components/Followers';
import Following from './components/Following';
import MysubGreddiit from './components/MysubGreddiit';
import OpenMsg from './components/OpenMsg';
import SubGreddiits from './components/SubGreddiits';
import Requests from './components/Requests';
import Sg_As_Guest from './components/Sg_As_Guest';
import Following_Sg from './components/Following_Sg';
import Sg_Posts from './components/Sg_Posts';
import SavedPosts from './components/SavedPosts';
import Report from './components/Report';
import Stats from './components/Stats';
const App = () => {
  const followingArray = [{ name: "Arya" }, { name: "Vansh" }, { name: "Yatharth" }, { name: "Ananya" }, { name: "Shambhavi" }, { name: "Nikunj" }];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userIsLogged, setuserIsLogged] = useState(false);

  const [email, setEmail] = useState('');
  const [id,setId]=useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  // let navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const handleLogin = (value) => {
    setuserIsLogged(value);
  }



  const RequireAuth = ({ children }) => {
    if (!userIsLogged) {
      return <Login username={username} password={password} setPassword={setPassword} setUsername={setUsername} changeLogin={handleLogin} setAge={setAge} setCity={setCity} setEmail={setEmail} setPhonenumber={setPhonenumber} />; // pasiing the property
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login username={username} password={password} setPassword={setPassword} setUsername={setUsername} changeLogin={handleLogin} setAge={setAge} setCity={setCity} setEmail={setEmail} setPhonenumber={setPhonenumber} />} />
          <Route path="/Profile" element={<RequireAuth><Profile setPassword={setPassword} setUsername={setUsername} changeLogin={handleLogin} username={username} age={age} city={city} email={email} phonenumber={phonenumber} setAge={setAge} setCity={setCity} setEmail={setEmail} setPhonenumber={setPhonenumber} /></RequireAuth>} />
          <Route path="/Profile/followers" element={<RequireAuth><Followers /></RequireAuth>} />
          <Route path="/Profile/following" element={<RequireAuth><Following following={followingArray} /></RequireAuth>} />
          <Route path="/Profile/mySubGreddiit" element={<RequireAuth><MysubGreddiit  setModalShow={setModalShow} show={modalShow} onHide={() => setModalShow(false)} setId={setId} /></RequireAuth>} />
          <Route path="/Profile/SubGreddiits" element={<RequireAuth><SubGreddiits /></RequireAuth>}/>
          <Route path="/users/:sub_id" element={<RequireAuth><OpenMsg/></RequireAuth>}/>
          <Route path="/users/:sub_id/guest" element={<RequireAuth><Sg_As_Guest/></RequireAuth>}/>
          <Route path="/users/:sub_id/requests" element={<RequireAuth><Requests/></RequireAuth>}/>
          <Route path="/users/:sub_id/follower" element={<RequireAuth><Following_Sg/></RequireAuth>}/>
          <Route path="/users/:sub_id/follower/posts" element={<RequireAuth><Sg_Posts  setModalShow={setModalShow} show={modalShow} onHide={() => setModalShow(false)}/></RequireAuth>}/>
          <Route path="/Profile/savedPosts" element={<RequireAuth><SavedPosts /></RequireAuth>} />
          <Route path="/users/:sub_id/report" element={<RequireAuth><Report/></RequireAuth>}/>
          <Route path="/users/:sub_id/stats" element={<RequireAuth><Stats/></RequireAuth>}/>
        </Routes>
        
      </div>
    </BrowserRouter>
  )
}

export default App
