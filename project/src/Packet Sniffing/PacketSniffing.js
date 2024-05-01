import React, { useState, useRef } from 'react';
import './PacketSniffing.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InputFileUpload({ currentUsername }) {
    const [file, setFile] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [predictDialogOpen, setPredictDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            setShowConfirmation(true);
        } else {
            setSnackbar({ open: true, message: 'Please upload a CSV file.', severity: 'warning' });
        }
        event.target.value = null;
    };

    const handleSave = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', currentUsername);

        try {
            await axios.post('http://localhost:3001/upload/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            setShowConfirmation(false);
            setFile(null);
            setPredictDialogOpen(true);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error uploading file', severity: 'error' });
            setIsLoading(false);
            setShowConfirmation(false);
            setFile(null);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setShowConfirmation(false);
        setSnackbar({ open: true, message: 'Upload cancelled', severity: 'info' });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handlePredictConfirmation = (confirm) => {
        setPredictDialogOpen(false);
        if (confirm) {
            navigate('/visualization');
        } else {
            setSnackbar({ open: true, message: 'Prediction canceled', severity: 'info' });
        }
    };

    return (
        <>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput 
                    type="file" 
                    onChange={handleFileChange} 
                    ref={fileInputRef} 
                    accept=".csv" 
                />
            </Button>
            {showConfirmation && !isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <p>{`Selected file: ${file?.name}`}</p>
                    <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
                        Save & Proceed
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}
            {isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <CircularProgress />
                    <p>Saving file...</p>
                </div>
            )}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={predictDialogOpen}
                onClose={() => setPredictDialogOpen(false)}
                aria-labelledby="predict-dialog-title"
                aria-describedby="predict-dialog-description"
            >
                <DialogTitle id="predict-dialog-title" style={{ background: 'linear-gradient(313deg, #181835, #326291)', color: 'gold' }}>
                   {"Predict Dataset?"}</DialogTitle>
                <DialogContent style={{ background: 'linear-gradient(313deg, #181835, #326291)' }}>
                    <DialogContentText id="predict-dialog-description" style={{ color: 'white' }}>
                        Would you like to predict this dataset?
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ background: 'linear-gradient(313deg, #181835, #326291)' }}>
                    <Button onClick={() => handlePredictConfirmation(true)} style={{ color: 'white' }}>
                        Yes
                    </Button>
                    <Button onClick={() => handlePredictConfirmation(false)} style={{ color: 'white' }}>
                        No
                    </Button>
                </DialogActions>                
            </Dialog>
        </>
    );
}

function MainPage({ currentUsername }) {
    return (
        <article>
            <div className="upload-section">
                <h2>Upload CSV File from Packet Sniffer</h2>
                <InputFileUpload currentUsername={currentUsername} />
            </div>
        </article>
    );
}

export default MainPage;
