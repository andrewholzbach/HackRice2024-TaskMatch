import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline

# Sample function to build a model based on user features and suggest tasks
def train_task_recommendation_model(user_data, task_data):
    """
    Trains a machine learning model to recommend tasks based on user features.
    
    Parameters:
    user_data (DataFrame): User features and past task preferences
    task_data (DataFrame): Task information
    
    Returns:
    model (RandomForestClassifier): Trained model to recommend tasks
    """
    
    # Preprocessing: Define the features and labels
    X = user_data.drop(columns=['task_selected'])  # Features like user preferences, demographics, etc.
    y = user_data['task_selected']                # Target: The task the user was interested in
    
    # Split the data for training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Build a preprocessing pipeline for encoding and scaling
    preprocessing_pipeline = Pipeline([
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse=False)),
        ('scaler', StandardScaler())
    ])
    
    # Apply the pipeline to the input data
    X_train_transformed = preprocessing_pipeline.fit_transform(X_train)
    X_test_transformed = preprocessing_pipeline.transform(X_test)
    
    # Train a RandomForest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_transformed, y_train)
    
    # Evaluate the model (optional)
    accuracy = model.score(X_test_transformed, y_test)
    print(f"Model Accuracy: {accuracy:.2f}")
    
    return model

def recommend_tasks(user_features, trained_model, task_data):
    """
    Recommends tasks based on user features and trained model.
    
    Parameters:
    user_features (dict): Selected user features like category, time commitment, etc.
    trained_model (RandomForestClassifier): Pre-trained model for task recommendation
    task_data (DataFrame): Available tasks
    
    Returns:
    recommended_tasks (DataFrame): Tasks that are predicted to match the user's interest
    """
    
    # Convert the user features to a DataFrame for model prediction
    user_features_df = pd.DataFrame([user_features])
    
    # Preprocess the user's selected features
    processed_user_features = preprocessing_pipeline.transform(user_features_df)
    
    # Predict the probabilities of user interest in each task
    task_data['predicted_interest'] = trained_model.predict_proba(processed_user_features)[:, 1]
    
    # Sort tasks by predicted interest (descending)
    recommended_tasks = task_data.sort_values(by='predicted_interest', ascending=False)
    
    return recommended_tasks

# Example usage:
# Suppose we have some sample data for users and tasks
user_data = pd.DataFrame({
    'category': ['Cleaning', 'Delivery', 'Tutoring', 'Gardening'],
    'time_commitment': [2, 5, 1, 3],
    'reward': [20, 50, 10, 30],
    'task_selected': [1, 0, 1, 1]  # 1 means user was interested, 0 means not interested
})

task_data = pd.DataFrame({
    'task_id': [101, 102, 103, 104],
    'category': ['Cleaning', 'Tutoring', 'Delivery', 'Gardening'],
    'time_commitment': [2, 1, 5, 3],
    'reward': [20, 10, 50, 30]
})

# Train the model
model = train_task_recommendation_model(user_data, task_data)

# Example user feature selection
user_features = {
    'category': 'Tutoring',
    'time_commitment': 1,
    'reward': 15
}

# Get recommended tasks
recommended_tasks = recommend_tasks(user_features, model, task_data)

# Display the recommended tasks




user_data = pd.DataFrame({
    'category': ['Cleaning', 'Delivery', 'Tutoring', 'Gardening', 'Shopping', 'Cleaning'],
    'time_commitment': [2, 5, 1, 3, 4, 2],
    'reward': [20, 50, 10, 30, 25, 15],
    'task_selected': [1, 0, 1, 1, 0, 1]  # 1 means user selected the task, 0 means they did not
})


task_data = pd.DataFrame({
    'task_id': [201, 202, 203, 204, 205],
    'category': ['Cleaning', 'Tutoring', 'Delivery', 'Gardening', 'Shopping'],
    'time_commitment': [2, 1, 5, 3, 4],
    'reward': [20, 10, 50, 30, 25]
})

user_features = {
    'category': 'Cleaning',  # Category the user selected
    'time_commitment': 2,    # How much time the user can commit
    'reward': 20             # Reward the user is seeking
}

# Train the model with the user data
model = train_task_recommendation_model(user_data, task_data)

# Test with user input features
recommended_tasks = recommend_tasks(user_features, model, task_data)

# Display the recommended tasks
print(recommended_tasks)