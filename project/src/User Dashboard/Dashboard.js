import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Dashboard.css'; // Ensure the CSS path is correct

const Dashboard = ({ user, isLoading }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (user) { 
            axios.get('http://localhost:3001/api/files')
                .then(response => {
                    setFiles(response.data);
                })
                .catch(error => {
                    console.error('Error fetching files:', error);
                });
        }
    }, [user]); 

    const fileColumns = [
        { field: 'fileName', headerName: 'File Name', width: 150 },
        { field: 'uploader', headerName: 'Uploaded By', width: 150 },
        { field: 'uploadDate', headerName: 'Upload Date', width: 150, valueGetter: (params) => `${new Date(params.value).toLocaleString()}` },
        { field: 'fileType', headerName: 'File Type', width: 150 },
    ];

    const fileRows = files.map((file, index) => ({
        id: index,
        fileName: file.fileName,
        uploader: file.uploader,
        uploadDate: file.uploadDate,
        fileType: file.fileType,
    }));

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
                <p>Loading user information...</p>
            </Box>
        );
    }

    if (!user) {
        return <div>User data is not available</div>;
    }

    return (
        <section>
            <div className="profile">
                <div className="profile-pic">
                    <img src={user.profilePicture || 'bot.png'} alt="Profile" />
                </div>
                <div className="profile-container">
                    <h2>User Profile</h2>
                    <div className="profile-info">
                        <p><strong>Username:</strong> <span>{user.username || 'Not available'}</span></p>
                        <p><strong>Email:</strong> <span>{user.email || 'Not available'}</span></p>
                    </div>
                </div>
            </div>
            {/* Network Data File Log Section */}
            <div className="log-section">
                <h2>Network Data File Log</h2>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={fileRows}
                        columns={fileColumns}
                        pageSize={5}
                        checkboxSelection
                        sx={{ backgroundColor: 'white' }}
                    />
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
