import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Modal from './Modal';
import Home from './Home'; // Import the Home component
import PacketSniffing from '../Packet Sniffing/PacketSniffing';
import UserDashboard from '../User Dashboard/Dashboard'; // Adjust the path as needed
import Visualization from '../Data Visualization/Visualization';
import AlertSystem from '../AlertSystem/AlertSystem';
import './App.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutDialogText, setLogoutDialogText] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:3001/verifyToken', { token });
          if (response.data.isValid) {
            setIsLoggedIn(true);
            setUsername(response.data.username);
            fetchUserData(response.data.username); 
          } else {
            sessionStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          sessionStorage.removeItem('token');
          setIsLoggedIn(false);
        }      
      }
    };

    verifyToken();
  }, []);

  const fetchUserData = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3001/getUserData/${username}`);
      setUserData(response.data);
      console.log("Fetched user data:", response.data); // Check the fetched data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  const LogoutHandler = () => {
    const navigate = useNavigate();
    useEffect(() => {
      sessionStorage.removeItem('token');
      setIsLoggedIn(false);
      setUsername('');
      setLogoutDialogText('You have successfully logged out.');
      setLogoutDialogOpen(true);
      navigate('/Home');
      setIsLoggingOut(false);
    }, [navigate]);

    return null;
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="" />;
  };

  return (
    <Router>
      {isLoggingOut && <LogoutHandler />}
      <div className="App">
        <Navbar openModal={openModal} isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
        <Routes>
        <Route exact path="/" element={<Navigate replace to="/Home" />} />
          <Route exact path="/Home" element={<Home openModal={openModal} />} />
          <Route path="/packet-sniffing" element={<PrivateRoute><PacketSniffing currentUsername={username} /></PrivateRoute>} />
          <Route path="/visualization" element={<PrivateRoute><Visualization /></PrivateRoute>} />
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard user={userData} /></PrivateRoute>} />
          <Route path="/AlertSystem" element={<PrivateRoute><AlertSystem /></PrivateRoute>} />
        </Routes>
        <Modal isVisible={isModalVisible} closeModal={closeModal} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />

        <footer className="footer">
          <div className="container-fluid">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p>Cyber Intelligence © 2023</p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <p>Developed by Soham</p>
              </div>
            </div>
          </div>
        </footer>

        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          disableScrollLock={true}
        >
          <DialogTitle id="logout-dialog-title" style={{ background: 'linear-gradient(313deg, #181835, #1b1916)', color: 'gold' }}>
            🛈 {"Logout Status"}
          </DialogTitle>
          <DialogContent style={{ background: 'linear-gradient(313deg, #181835, #1b1916)' }}>
            <DialogContentText id="logout-dialog-description" style={{ color: 'white' }}>
              {logoutDialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ background: 'linear-gradient(313deg, #181835, #1b1916)' }}>
            <Button onClick={() => setLogoutDialogOpen(false)} style={{ color: 'white' }}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Router>
  );
}

export default App;
