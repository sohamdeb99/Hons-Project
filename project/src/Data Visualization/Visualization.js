import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './Visualization.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Button, Modal, Box, Typography } from '@mui/material'; // Import Material-UI components

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function Visualization() {
  const [protocolCounts, setProtocolCounts] = useState({});
  const [anomalyData, setAnomalyData] = useState({});
  const [additionalMetrics, setAdditionalMetrics] = useState({ duration: [], src_bytes: [], dst_bytes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/get-predictions')
      .then(response => {
        const { protocol_counts, anomaly_data, additional_metrics } = response.data;
        setProtocolCounts(protocol_counts || {});
        setAnomalyData(anomaly_data || {});
        setAdditionalMetrics({
          duration: Array.isArray(additional_metrics.duration) ? additional_metrics.duration : [],
          src_bytes: Array.isArray(additional_metrics.src_bytes) ? additional_metrics.src_bytes : [],
          dst_bytes: Array.isArray(additional_metrics.dst_bytes) ? additional_metrics.dst_bytes : [],
        });
        setLoading(false);

        if (anomaly_data && anomaly_data.abnormal > 0) {
          setOpenModal(true);
        }
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
        setError(`Failed to fetch data: ${error.message}`);
        setLoading(false);
      });
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const totalProtocolsDetected = protocolCounts ? Object.values(protocolCounts).reduce((acc, count) => acc + count, 0) : 0;
  const totalEntries = (anomalyData.normal || 0) + (anomalyData.abnormal || 0);
  const anomalyPercentage = totalEntries ? ((anomalyData.abnormal / totalEntries) * 100).toFixed(2) : 0;
  const normalPercentage = totalEntries ? ((anomalyData.normal / totalEntries) * 100).toFixed(2) : 0;

  const minDuration = additionalMetrics.duration.length > 0
    ? Math.min(...additionalMetrics.duration)
    : 'N/A';

  const maxDuration = additionalMetrics.duration.length > 0
    ? Math.max(...additionalMetrics.duration)
    : 'N/A';

  const avgDuration = additionalMetrics.duration.length > 0
    ? additionalMetrics.duration.reduce((acc, cur) => acc + cur, 0) / additionalMetrics.duration.length
    : 'N/A';

  const downloadReport = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Data Visualization & Prediction Report', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    
    const reportDate = new Date().toLocaleDateString('en-GB');
    doc.text('Report Summary', 105, 40, { align: 'center' });
    doc.text(`Report generated on: ${reportDate}`, 105, 50, { align: 'center' });
  
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 60, 190, 60);
  
    doc.setFontSize(12);
    doc.text('This report provides an overview of network traffic analysis, highlighting detected protocols, network anomalies, and traffic composition.', 20, 70, { maxWidth: 170 });
    doc.text('Summary of findings:', 20, 90);
  
    doc.setFontSize(11);
    const totalProtocolsDetected = Object.values(protocolCounts).reduce((acc, cur) => acc + cur, 0);
    const anomalyPercentage = ((anomalyData.abnormal / (anomalyData.normal + anomalyData.abnormal)) * 100).toFixed(2);
    const normalPercentage = ((anomalyData.normal / (anomalyData.normal + anomalyData.abnormal)) * 100).toFixed(2);
  
    doc.text(`The machine has detected a total Protocol count of: ${totalProtocolsDetected}`, 20, 100);
    doc.text(`The machine has detected Network Anomalies percentage of: ${anomalyPercentage}%`, 20, 110);
    doc.text(`The machine has detected Normal Network percentage of: ${normalPercentage}%`, 20, 120);
    doc.text(`The machine has detected Anomalies Network count of: ${anomalyData.abnormal}`, 20, 130);
    doc.text(`The machine has detected Normal Network count of: ${anomalyData.normal}`, 20, 140);
  
    doc.setFontSize(12);
    doc.text('Analysis/Insights:', 20, 155);
    doc.setFontSize(10);
    doc.text('Based on the data, a significant portion of network traffic was analysed to identify potential anomalies and categorize normal activity. These insights are critical for improving network security measures and understanding traffic patterns.', 20, 160, { maxWidth: 170 });
  
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(0, 0, 0); // Black color
    doc.line(20, 280, 190, 280); // Footer line
    doc.setFontSize(10);
    doc.text('Confidential, All Rights Reserved to Cyber Intelligence ©', 105, 285, { align: 'center' });
  }
    // Save the PDF
    doc.save('Data_Visualization_Prediction_Report.pdf');
  };

  const protocolChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // ensuring visibility against the chart background
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    indexAxis: 'y', // Makes the chart horizontal
  };

  // Define the data for the protocol chart
  const protocolChartData = {
    labels: ['TCP', 'UDP', 'ICMP'], // Directly labeling each bar
    datasets: [
      {
        label: 'Protocol Counts', // This is a general label for the legend. You could also omit it if preferred.
        data: [protocolCounts.TCP, protocolCounts.UDP, protocolCounts.ICMP], // Order matches the labels
        backgroundColor: [
          'rgb(255,165,0)', // Color for TCP
          'rgba(54, 162, 235)', // Color for UDP
          'rgb(255,255,0)'  // Color for ICMP
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      }
    ],
  };
  

  const anomalyChartData = {
    labels: ['Normal', 'Abnormal'],
    datasets: [{
      label: 'Network Anomaly Distribution',
      data: [anomalyData.normal, anomalyData.abnormal],
      backgroundColor: [
        'rgb(0,255,255)', // Normal
        'rgb(255,0,0)' // Abnormal
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1,
    }]
  };

  const summaryStats = (data) => {
    if (!data.length) return { total: 'N/A', avg: 'N/A', max: 'N/A', min: 'N/A' };
    const total = data.reduce((acc, value) => acc + value, 0);
    const avg = total / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    return { total, avg, max, min };
  };

  const srcBytesStats = summaryStats(additionalMetrics.src_bytes);
  const dstBytesStats = summaryStats(additionalMetrics.dst_bytes);

  // Helper function to generate chart data for additional metrics
  const generateChartDataForMetric = (metricName, values) => ({
    labels: values.map((_, index) => `Instance ${index + 1}`),
    datasets: [{
      label: metricName,
      data: values,
      backgroundColor: 'rgba(153, 102, 255)',
      borderColor: 'rgba(153, 102, 255)',
      borderWidth: 1,
    }]
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // Change as needed
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        }
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        }
      }
    }
  };

  const MetricschartOptions = {
    maintainAspectRatio: true, // Ensure the aspect ratio is maintained
    aspectRatio: 2, // Adjust this value as needed to make the chart more compact
    plugins: {
      legend: {
        display: false, // Optionally hide the legend for a cleaner look
      },
    },
    scales: {
      x: {
        display: false, // Optionally hide the x-axis labels for a cleaner look
      },
      y: {
        beginAtZero: true,
        ticks: {
          // Adjust tick settings for a more compact display
          callback: function(value) {
            return `${value / 1000}k`; // Convert values to 'k' units
          }
        }
      },
    },
  };

  // Summary statistics calculation for descriptive text
  const summarizeData = (data) => ({
    total: data.reduce((acc, cur) => acc + cur, 0),
    avg: data.reduce((acc, cur) => acc + cur, 0) / data.length || 0,
    max: Math.max(...data),
    min: Math.min(...data),
  });

  const srcBytesSummary = summarizeData(additionalMetrics.src_bytes);
  const dstBytesSummary = summarizeData(additionalMetrics.dst_bytes);

  return (
    <div className="visualization-container">
      <div className="title-box">
        <h2>Data Visualization & Prediction</h2>
      </div>
      {/* Modal for displaying notification */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="notification-modal"
        aria-describedby="notification-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(313deg, #181835, #1b1916)', // Apply linear gradient background color
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxWidth: 400,
          minWidth: 300,
          textAlign: 'center',
          outline: 'none',
        }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Network Anomalies Detected
          </Typography>
          <Typography variant="body1" id="notification-modal-description">
            Your system has detected network anomalies.<br></br>
            Please check Alert Tab for more Information.
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="info-box">Protocols Detected: {totalProtocolsDetected}</div>
        <div className="info-box">Network Anomalies: {anomalyPercentage}%</div>
        <div className="info-box">Normal Network: {normalPercentage}%</div>
        <div className="info-box">Anomalies: {anomalyData.abnormal}</div>
        <div className="info-box">Normal Network: {anomalyData.normal}</div>
        <button className="download-report-btn" onClick={downloadReport}>
          Download PDF Report
        </button>
      </div>
      {loading ? <div>Loading...</div> : error ? <div>Error: {error}</div> : (
        <>
          <div className="chart-box">
            <div>
              <h3>Protocol Type Distribution</h3>
              <p>Total amount of protocol count within the uploaded dataset</p>
              <Bar data={protocolChartData} options={protocolChartOptions} />
            </div>
            <div>
              <h3>Network Anomaly Distribution</h3>
              <p>Total amount of Network Anomaly count within the uploaded dataset</p>
              <Bar data={anomalyChartData} options={chartOptions} />
            </div>
          </div>
          <div className="additional-metrics">
          <div>
      <h3>Duration Analysis</h3>
      <h4>This analysis provides a summary of the session durations within the dataset.
         Understanding the range and average of session durations.</h4>
      <p><strong>Minimum Duration:</strong> {minDuration !== 'N/A' ? minDuration.toFixed(2) : minDuration} seconds</p>
      <p><strong>Average Duration:</strong> {avgDuration !== 'N/A' ? avgDuration.toFixed(2) : avgDuration} seconds</p>
      <p><strong>Maximum Duration:</strong> {maxDuration !== 'N/A' ? maxDuration.toFixed(2) : maxDuration} seconds</p>
    </div>
    <div>
        <h3>Source Bytes</h3>
        <h4>This analysis provides a summary of the total amount of data sent from sources within the dataset. 
  Understanding the total, average, maximum, and minimum source bytes is essential for identifying 
  trends in data transmission, pinpointing potential sources of high traffic, and assessing overall 
  network load. The variations in source bytes can indicate different behaviors or activities, such as 
  potential security threats like DDoS attacks.</h4>
        <Bar data={generateChartDataForMetric('Source Bytes', additionalMetrics.src_bytes)} options={chartOptions} height={100} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Total: {srcBytesSummary.total.toLocaleString()} bytes, Avg: {srcBytesSummary.avg.toFixed(2)} bytes, Max: {srcBytesSummary.max.toLocaleString()} bytes, Min: {srcBytesSummary.min.toLocaleString()} bytes
        </Typography>
      </div>

      <div>
        <h3>Destination Bytes</h3>
        <h4> This summary focuses on the total amount of data received by destinations within the dataset. 
  Analyzing the total, average, maximum, and minimum destination bytes helps in evaluating the 
  capacity of the network to handle incoming data. It also helps in 
  recognising destinations that are frequent targets of data transfers, which could be critical 
  assets or potential threats in the network. This insight is crucial for optimizing network 
  performance and enhancing security.</h4>
        <Bar data={generateChartDataForMetric('Destination Bytes', additionalMetrics.dst_bytes)} options={chartOptions} height={100} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Total: {dstBytesSummary.total.toLocaleString()} bytes, Avg: {dstBytesSummary.avg.toFixed(2)} bytes, Max: {dstBytesSummary.max.toLocaleString()} bytes, Min: {dstBytesSummary.min.toLocaleString()} bytes
        </Typography>
      </div>
          </div>
        </>
      )}
    </div>
  );
  
}
