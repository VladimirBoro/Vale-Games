import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OVERLAY_STATE } from './components/loginOverlay/constants';
import Home from "./pages/home/Home";
import LoginOverlay from "./components/loginOverlay/LoginOverlay";
import Account from "./pages/account/Account";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Snake from "./pages/snake/Snake";
import Frogger from "./pages/frogger/Frogger";
import BirdyFlap from "./pages/birdyflap/BirdyFlap";
import Minesweeper from './pages/minesweeper/Minesweeper';
import Cardmatch from './pages/cardmatch/Cardmatch';
import JumpGuy from './pages/jumpguy/JumpGuy';
import customAxios from './util/customAxios';
import './App.css';

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayState, setOverlayState] = useState(OVERLAY_STATE.LOGIN);

  useEffect(() => {
    document.title = "Vale Games";
    localStorage.setItem("currentGame", "");
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

    checkSession();
  }, []);

  const toggleLoginOverlay = () => {
    setShowOverlay(!showOverlay);
    switchOverlayState(0);
  }
  
  const switchOverlayState = (state) => {
    setOverlayState(state);
  }

  return (
    <>
      <div className="App">
        <LoginOverlay 
          showOverlay={showOverlay} 
          typeToDisplay={overlayState} 
          switchType={switchOverlayState}
          toggleOverlay={toggleLoginOverlay} 
        />
        
        <Header toggleLoginOverlay={toggleLoginOverlay}/>
        <main className="main">
          <Routes>
            <Route path={process.env.REACT_APP_HOME} element={<Home />} />
            <Route path={process.env.REACT_APP_FLAPPYBAT} element={<BirdyFlap />} />
            <Route path={process.env.REACT_APP_SNAKE} element={<Snake />} />
            <Route path={process.env.REACT_APP_FROGGER} element={<Frogger />} />
            <Route path={process.env.REACT_APP_MINESWEEPER} element={<Minesweeper />} />
            <Route path={process.env.REACT_APP_CARDMATCH} element={<Cardmatch />} />
            <Route path={process.env.REACT_APP_JUMPGUY} element={<JumpGuy />} />
            <Route path={process.env.REACT_APP_ACCOUNT} element={<Account />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
