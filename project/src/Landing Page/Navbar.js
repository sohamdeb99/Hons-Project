import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Ensure this path is correct
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Navbar({ openModal, isLoggedIn, username, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const performLogout = () => {
    setDropdownOpen(false);
    handleLogout();
  };

  const handleLinkClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setDialogOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <nav>
      <div className="logo">
        <img src="logo.jpg" alt="Logo" />
      </div>
      <ul className="nav__links">
        <li className="link"><Link to="/Home">HOME</Link></li>
        <li className="link" onClick={(e) => handleLinkClick(e, '/packet-sniffing')}>
          <Link to="/packet-sniffing">Upload Packet Sniffing</Link>
        </li>
        <li className="link" onClick={(e) => handleLinkClick(e, '/Visualization')}>
          <Link to="/Visualization">Data Visualization</Link>
          </li>
        <li className="link" onClick={(e) => handleLinkClick(e, '/user-dashboard')}>
          <Link to="/user-dashboard">User Dashboard</Link>
        </li>
        <li className="link" onClick={(e) => handleLinkClick(e, '/AlertSystem')}>
          <Link to="/AlertSystem">Alerts</Link> 
        </li>
      </ul>

      {isLoggedIn ? (
        <div className="nav-user-menu">
          <Button onClick={handleToggleDropdown}>
            Welcome, {username}
          </Button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={performLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" onClick={openModal}>Login/Register</button>
      )}

      {/* Dialog for restricted access */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableScrollLock={true}
      >
        <DialogTitle style={{ background: 'linear-gradient(313deg, #181835, #1b1916)', color: 'gold' }}>
          {"⚠️ Access Restricted"}
        </DialogTitle>
        <DialogContent style={{ background: 'linear-gradient(313deg, #181835, #1b1916)' }}>
          <DialogContentText style={{ color: 'white' }}>
            Please login in order to access this page.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ background: 'linear-gradient(313deg, #181835, #1b1916)' }}>
          <Button onClick={() => setDialogOpen(false)} style={{ color: 'white' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
}

export default Navbar;
