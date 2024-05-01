from flask import Flask, request, jsonify # type: ignore
from werkzeug.utils import secure_filename # type: ignore
from flask_cors import CORS # type: ignore
import pandas as pd # type: ignore
import os

app = Flask(__name__)
CORS(app)

protocol_counts = {"TCP": 0, "UDP": 0, "ICMP": 0}
anomaly_data = {"normal": 0, "abnormal": 0}
additional_metrics = {"duration": 0, "src_bytes": 0, "dst_bytes": 0}
# Initialize a global variable for detailed anomaly data
detailed_anomaly_data = []

@app.route('/upload', methods=['POST'])
def upload_file():
    global protocol_counts, anomaly_data, additional_metrics, detailed_anomaly_data

    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join('uploads', filename)
    file.save(filepath)

    try:
        df = pd.read_csv(filepath)
        if 'class' not in df.columns:
            df['class'] = 'normal'
        
        protocol_counts = count_protocol_types(df)
        anomaly_data = detect_anomalies(df)
        additional_metrics = calculate_additional_metrics(df)
        detailed_anomaly_data = prepare_detailed_anomaly_data(df)
        return jsonify({'message': 'File uploaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

def calculate_additional_metrics(df):
    if 'duration' not in df.columns:
        df['duration'] = [0] * len(df)
    if 'src_bytes' not in df.columns:
        df['src_bytes'] = [0] * len(df)
    if 'dst_bytes' not in df.columns:
        df['dst_bytes'] = [0] * len(df)
    
    duration = df['duration'].tolist()
    src_bytes = df['src_bytes'].tolist()
    dst_bytes = df['dst_bytes'].tolist()

    return {"duration": duration, "src_bytes": src_bytes, "dst_bytes": dst_bytes}

@app.route('/get-predictions', methods=['GET'])
def get_predictions():
    global protocol_counts, anomaly_data, additional_metrics, detailed_anomaly_data
    return jsonify({
        "protocol_counts": protocol_counts, 
        "anomaly_data": anomaly_data,
        "additional_metrics": additional_metrics,
        "detailed_anomaly_data": detailed_anomaly_data  
    })

def count_protocol_types(df):
    protocol_counts = {"TCP": 0, "UDP": 0, "ICMP": 0}

    if 'protocol_type' in df.columns:
        df['protocol_type'] = df['protocol_type'].str.upper()
        for protocol in protocol_counts.keys():
            protocol_counts[protocol] += df[df['protocol_type'] == protocol].shape[0]

    return protocol_counts


def detect_anomalies(df):
    if 'class' in df.columns:
        normal_count = df[df['class'] == 'normal'].shape[0]
        abnormal_count = df[df['class'] != 'normal'].shape[0]
    else:
        normal_count = df.shape[0]
        abnormal_count = 0

    return {"normal": normal_count, "abnormal": abnormal_count}

# Alert System to detect attack location
def prepare_detailed_anomaly_data(df):
    expected_columns = ['Anomaly Type', 'Origin Country', 'Latitude', 'Longitude', 'Severity Level']
    
    for column in expected_columns:
        if column not in df.columns:
            df[column] = 'N/A'  
    
    
    if 'class' in df.columns:
        detailed_data = df[df['class'] != 'normal'][expected_columns].to_dict(orient='records')
    else:
        detailed_data = []
    
    return detailed_data


if __name__ == '__main__':
    app.run(debug=True)