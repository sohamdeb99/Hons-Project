import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box'; // <-- Add this line
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css'; // Ensure the path is correct for your project structure

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Modal({ isVisible, closeModal, setIsLoggedIn, setUsername }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [passwordError, setPasswordError] = useState('');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setPasswordError('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const username = document.getElementById('usernameInput').value;
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
      const repeatPassword = document.getElementById('repeatPasswordInput').value;

      if (!username || !email || !password || !repeatPassword) {
        setSnackbarMessage('All fields are required');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      if (!validateEmail(email)) {
        setSnackbarMessage('Invalid email format');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      if (password !== repeatPassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      // Registration API call
      try {
        const response = await fetch('http://localhost:3001/Auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();

        if (response.status === 200) {
          setSnackbarMessage(data.message || 'Registration successful!');
          setSnackbarType('success');
          setIsSignUp(false); // Switch to login after successful registration
        } else {
          setSnackbarMessage(data.message || 'Registration failed');
          setSnackbarType('error');
        }
      } catch (error) {
        setSnackbarMessage('Registration request failed');
        setSnackbarType('error');
      }
    } else {
      const identifier = document.getElementById('loginInput').value;
      const password = document.getElementById('passwordInput').value;

      if (!identifier || !password) {
        setSnackbarMessage('Username/Email and Password are required');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      // Login API call
      try {
        const response = await fetch('http://localhost:3001/Auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier, password }),
        });
        const data = await response.json();

        if (response.status === 200) {
          sessionStorage.setItem('token', data.token);
          setIsLoggedIn(true);
          setUsername(data.username);
          closeModal();
        } else {
          setSnackbarMessage(data.message || 'Login failed');
          setSnackbarType('error');
        }
      } catch (error) {
        setSnackbarMessage('Login request failed');
        setSnackbarType('error');
      }
    }

    setSnackbarOpen(true);
  };

  const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(313deg, #181835, #1b1916)', // Applied linear gradient
    padding: '50px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    width: 'fit-content',
    margin: 'auto',
    marginTop: '115px',
    paddingRight: '30px',
    paddingLeft: '30px',
    '& .MuiTextField-root': { 
      m: 1, 
      width: '300px',
      backgroundColor: '#515151',
      borderRadius: '5px',
      input: {
        color: 'white',
      },
      '& label': {
        color: 'white',
      },
      '& label.Mui-focused': {
        color: '#fff',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#fff',
        },
        '&:hover fieldset': {
          borderColor: 'lightgray',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#fff',
        },
      },
    },
    '& .submit-button': {
      marginTop: '10px',
      background: 'linear-gradient(313deg, #181835, #1b1916)',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#145DA0',
      }
    }
  };
  

   // Continue from the previous part of the function
   return (
    <div id="modal" className={`modal ${isVisible ? 'show' : ''}`} onClick={closeModal}>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        onClick={(e) => e.stopPropagation()}
        sx={modalStyle}
        noValidate
        autoComplete="off"
      >
        <span className="close" title="Close Modal" onClick={closeModal}>&times;</span>
        <h1 id="formTitle" style={{ margin: '30px 0', marginTop: 'auto' }}>{isSignUp ? 'Sign Up' : 'Login'}</h1>
        {isSignUp ? (
          <>
            <TextField required id="usernameInput" label="Username" variant="outlined" />
            <TextField required id="emailInput" label="Email" variant="outlined" />
            <TextField required id="passwordInput" label="Password" type="password" variant="outlined" />
            <TextField required id="repeatPasswordInput" label="Repeat Password" type="password" variant="outlined" />
            {passwordError && <div style={{ color: 'red', marginTop: '10px' }}>{passwordError}</div>}
          </>
        ) : (
          <>
            <TextField required id="loginInput" label="Username or Email" variant="outlined" />
            <TextField required id="passwordInput" label="Password" type="password" variant="outlined" />
          </>
        )}
        {!isSignUp && <a href="#" className="forgot-password" id="forgotPassword">Forgotten password?</a>}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px', marginBottom: '10px' }}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <div className="toggle-section" style={{ marginTop: '15px', marginBottom: '5px'}}>
          {!isSignUp ? (
            <span id="toggleSignup" onClick={toggleForm}>Don't have an account? Sign Up</span>
          ) : (
            <span id="toggleLogin" onClick={toggleForm}>Already have an account? Login</span>
          )}
        </div>
      </Box>
    </div>
  );
  
}

export default Modal;
