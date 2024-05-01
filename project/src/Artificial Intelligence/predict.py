import pandas as pd # type: ignore
from joblib import load # type: ignore

def load_model():
    model_path = r'C:\Users\soham\Final Year Project\project\src\Artificial Intelligence\new_random_forest_model.joblib'
    return load(model_path)

def preprocess_data(input_data):
    input_data['protocol_type'] = input_data['protocol_type'].str.lower()
    
    supported_protocols = ['tcp', 'udp', 'icmp']
    input_data['protocol_type'] = input_data['protocol_type'].apply(
        lambda x: x if x in supported_protocols else 'other'
    )
    
    return input_data

def predict(model, input_data):
    input_data = preprocess_data(input_data)
    required_features = ['duration', 'protocol_type', 'src_bytes', 'dst_bytes']
    
    for feature in required_features:
        if feature not in input_data.columns:
            input_data[feature] = 0
    
    predictions = model.predict(input_data[required_features])
    return predictions

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_csv_file>")
        sys.exit(1)

    csv_file_path = sys.argv[1]
    model = load_model()
    
    try:
        input_data = pd.read_csv(csv_file_path)
        predictions = predict(model, input_data)
        print("Predictions:", predictions)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)
