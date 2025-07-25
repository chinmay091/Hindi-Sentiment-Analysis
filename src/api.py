from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from langdetect import detect

# Load positive and negative sentiment words
with open("../positive sentiment words.txt", "r", encoding="utf-8") as f:
    positive_words = f.read().splitlines()

with open("../negative sentiment words.txt", "r", encoding="utf-8") as f:
    negative_words = f.read().splitlines()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained sentiment model and vectorizer
model = joblib.load('../sentiment_model.pkl')
vectorizer = joblib.load('../tfidf_vectorizer.pkl')

@app.route('/')
def home():
    return 'Welcome to the sentiment analysis API!'

def count_sentiment_words(text, positive_words, negative_words):
    positive_count = sum(1 for word in text.split() if word in positive_words)
    negative_count = sum(1 for word in text.split() if word in negative_words)
    return positive_count, negative_count

def calculate_sentiment_score(positive_count, negative_count):
    score = positive_count - negative_count

    if score >= 2:
        return "Very Positive"
    elif score == 1:
        return "Positive"
    elif score == 0:
        return "Neutral"
    elif score == -1:
        return "Negative"
    else:
        return "Very Negative"

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.json
        text = data.get('text')
        
        # Detect language
        lang = detect(text)
        if lang != 'hi':
            return jsonify({
                'error': 'The input text is not in Hindi.',
                'is_hindi': False
            }), 400

        # Transform the text using the vectorizer
        text_tfidf = vectorizer.transform([text])

        # Predict sentiment using the loaded model
        model_sentiment = model.predict(text_tfidf)[0]
        
        # Count sentiment words
        positive_count, negative_count = count_sentiment_words(text, positive_words, negative_words)

        # Calculate sentiment based on word counts
        sentiment_score = calculate_sentiment_score(positive_count, negative_count)

        return jsonify({
            'sentiment_based_on_words': sentiment_score,
            'model_sentiment': model_sentiment,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'is_hindi': True
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
