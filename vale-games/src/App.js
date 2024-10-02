import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { OVERLAY_STATE } from './components/loginOverlay/constants';
import Home from "./pages/home/Home";
import LoginOverlay from "./components/loginOverlay/LoginOverlay";
import Logout from "./pages/logout/Logout";
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
      <LoginOverlay 
        showOverlay={showOverlay} 
        typeToDisplay={overlayState} 
        switchType={switchOverlayState}
        toggleOverlay={toggleLoginOverlay} 
      />

      {/* OTHER OVERLAYS HERE TOO, WHICH IS BOTH TYPES OF REGISTERING */}
    
      <div className="App">
        <Header toggleLoginOverlay={toggleLoginOverlay}/>
        <main className="main">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/game/birdyflap' element={<BirdyFlap />} />
            <Route path='/game/snake' element={<Snake />} />
            <Route path='/game/frogger' element={<Frogger />} />
            <Route path='/game/minesweeper' element={<Minesweeper />} />
            <Route path='/game/cardmatch' element={<Cardmatch />} />
            <Route path='/game/jumpguy' element={<JumpGuy />} />
            <Route path='/account' element={<Account />} />
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
