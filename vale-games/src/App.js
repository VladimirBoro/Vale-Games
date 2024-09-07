import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Logout from "./pages/logout/Logout";
import Register from "./pages/register/Register";
import RegisterGoogler from "./pages/register/RegisterGoogler";
import Account from "./pages/account/Account";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Snake from "./pages/snake/Snake";
import Frogger from "./pages/frogger/Frogger";
import BirdyFlap from "./pages/birdyflap/BirdyFlap";
import Minesweeper from './pages/minesweeper/Minesweeper';
import Cardmatch from './pages/cardmatch/Cardmatch';
import customAxios from './util/customAxios';
import { fetchProfilePic } from './util/restful';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "Vale Games";
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const URL = process.env.REACT_APP_SERVER_URL;
      
      if (localStorage.getItem("user")) {
        await customAxios.get(URL, { withCredentials: true })
        .then(response => {
          console.log(response);
        });        
      }
    }

    const fetchProfilePicture = async (currentUser) => {
      await fetchProfilePic(currentUser);
      const profilePic = localStorage.getItem("profilePic");  // Wait for the image to be fetched
      if (profilePic) {
        console.log("Profile picture fetched!");
      }
      else {
        console.log("Failed to fetch profile picture.");
      }
    }

    checkSession();

    const currentUser = localStorage.getItem("user");
    // const profilePic = localStorage.getItem("profilePic");
    console.log("right b4!!");
    if (currentUser !== null) {
      console.log("fetching profile pic!!");
      fetchProfilePicture(currentUser);
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <main className="main">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/game/birdyflap' element={<BirdyFlap />} />
          <Route path='/game/snake' element={<Snake />} />
          <Route path='/game/frogger' element={<Frogger />} />
          <Route path='/game/minesweeper' element={<Minesweeper />} />
          <Route path='/game/cardmatch' element={<Cardmatch />} />
          <Route path='/login' element={<Login />} />
          <Route path='/account' element={<Account />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<Register />} />
          <Route path='/registerGoogler' element={<RegisterGoogler />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
