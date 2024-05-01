import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, Paper, Box, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AlertSystem.css'; // Make sure this import is correct

// Define a custom icon using Leaflet's icon
// Function to create a custom icon based on the severity
const createRippleIcon = (severity) => {
  let className = `marker-icon-${severity.toLowerCase()}`;
  let iconHtml = `<div class='${className}'>`;

  for (let i = 1; i <= 3; i++) { // Create 3 layers
    iconHtml += `<div class='pulse-layer'></div>`;
  }

  iconHtml += `</div>`;

  return L.divIcon({
    html: iconHtml,
    className: '', // This will prevent Leaflet's default icon styling
    // Adjust the icon size if needed based on the pulsing effect
    iconSize: [0, 0], // Adjust based on your actual ripple effect size
    iconAnchor: [0, 0], // Center point of the ripple
  });
};

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('');

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/get-predictions')
      .then(response => {
        setAlerts(response.data.detailed_anomaly_data || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching alerts:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSeverityChange = (event) => {
    setSelectedSeverity(event.target.value);
  };

  const filteredAlerts = selectedSeverity
    ? alerts.filter(alert => alert['Severity Level'].toLowerCase() === selectedSeverity.toLowerCase())
    : alerts;

    const detailedTopCountryBySeverity = (severity) => {
      const severityAlerts = alerts.filter(alert => alert['Severity Level'] === severity);
      let attackDetails = {};
    
      severityAlerts.forEach(alert => {
        const { 'Origin Country': country, 'Anomaly Type': type } = alert;
        const key = type; 
    
        if (!attackDetails[key]) {
          attackDetails[key] = { countries: new Set([country]), count: 1 };
        } else {
          attackDetails[key].countries.add(country);
          attackDetails[key].count += 1;
        }
      });
    
      return Object.entries(attackDetails).map(([type, details]) => {
        const countries = Array.from(details.countries).join(', ');
        return `${type} attacks originating from ${countries} - Total: ${details.count}`;
      }).join('\n') || 'No data available for this severity';
    };
    
    

  return (
    <div>
      {isLoading ? <CircularProgress /> : (
        <>
  <Box sx={{
  paddingRight: '20px',
  paddingLeft: '20px',
  paddingTop: '20px',
  background: 'linear-gradient(313deg, #181835, #1b1916)',
  textAlign: 'center',
  color: 'white', // Ensures text color within the Box is white
}}>
  <Typography variant="h4" gutterBottom sx={{ color: 'gold' }}>
    Alert System
  </Typography>
  <FormControl sx={{ width: 300, marginBottom: '20px', mx: 'auto' }}>
    <InputLabel
      id="severity-select-label"
      sx={{
        color: 'white', // Label color
        '&.Mui-focused': { // Maintains the label color when focused
          color: 'white',
        },
      }}
    >
      Severity
    </InputLabel>
    <Select
      labelId="severity-select-label"
      id="severity-select"
      value={selectedSeverity}
      label="Severity"
      onChange={handleSeverityChange}
      sx={{
        color: 'white', // Text color for the selected item
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'white', // Border color
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white', // Border color on focus
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white', // Border color on hover
        },
        '&.Mui-focused': {
          borderColor: 'white', // Border color when the component is focused
        },
      }}
    >
      <MenuItem value="" sx={{ color: 'black' }}><em>All Severity</em></MenuItem>
      <MenuItem value="Low" sx={{ color: 'black' }}>Low Severity</MenuItem>
      <MenuItem value="Medium" sx={{ color: 'black' }}>Medium Severity</MenuItem>
      <MenuItem value="High" sx={{ color: 'black' }}>High Severity</MenuItem>
    </Select>
  </FormControl>
</Box>

  <MapContainer center={[0, 0]} zoom={2} style={{ height: 500, width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {filteredAlerts.map((alert, index) => (
      <Marker 
        key={index} 
        position={[Number(alert.Latitude), Number(alert.Longitude)]}
        icon={createRippleIcon(alert['Severity Level'])}
      >
        <Popup>
          Detailed Attack Information:
          <br/>Type: {alert['Anomaly Type']}
          <br/>Origin: {alert['Origin Country']}
          <br/>Severity: {alert['Severity Level']}
        </Popup>
      </Marker>
    ))}
  </MapContainer>

  <Box sx={{ display: 'flex', justifyContent: 'space-around', background: 'linear-gradient(313deg, #181835, #1b1916)', padding: '20px' }}>
  {['High', 'Medium', 'Low'].map((severity, index) => (
    <Paper key={index} elevation={3} sx={{ padding: '20px', flex: 1, margin: '0 10px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6">Severity: {severity}</Typography>
      <Typography component="div" variant="body2">
        {detailedTopCountryBySeverity(severity).split('\n').map((line, key) => (
          <div key={key}>{line}</div>
        ))}
      </Typography>
    </Paper>
  ))}
</Box>


      </>
    )}
  </div>
);
};

export default AlertSystem;

