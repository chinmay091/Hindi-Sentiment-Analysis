import React, { useState } from 'react';
import axios from 'axios';
import './frontend.css';

const SentimentAnalysis = () => {
  const [reviews, setReviews] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);

  const analyzeSentiment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-sentiment', {
        text: reviews
      },
      { headers: { 'Content-Type': 'application/json' } });
      
      setSentimentResult(response.data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentimentResult({ error: 'Failed to analyze sentiment. Please try again.' });
    }
  };

  const renderStars = (positiveCount, negativeCount) => {
    let stars;

    // Calculate the sentiment score using the same logic as calculate_sentiment_score
    const score = positiveCount - negativeCount;

    // Determine star rating based on the calculated score
    if (score >= 2) {
        stars = 5;  // Very Positive
    } else if (score === 1) {
        stars = 4;  // Positive
    } else if (score === 0) {
        stars = 3;  // Neutral
    } else if (score === -1) {
        stars = 2;  // Negative
    } else {
        stars = 1;  // Very Negative
    }

    return '⭐'.repeat(stars);
};


  return (
    <div className="container">
      <h1 className="title">Hindi Sentiment Analysis</h1>
      <textarea
        id='textbutton'
        value={reviews}
        onChange={(e) => setReviews(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Enter Reviews in Hindi..."
        className="textarea"
      />
      <br />
      <button onClick={analyzeSentiment} id='sentimentbutton' className="button">Submit</button>
      {sentimentResult && (
        <div className="result">
          {sentimentResult.is_hindi ? (
            <div>
              <p className="thank-you-message">
                Thank You for Reviewing!!!
                {renderStars(sentimentResult.positive_count, sentimentResult.negative_count)}
              </p>
              <p>Predicted Sentiment: 
                {sentimentResult.sentiment_based_on_words === 'Very Positive' && ' 😊 Very Positive'}
                {sentimentResult.sentiment_based_on_words === 'Positive' && ' 🙂 Positive'}
                {sentimentResult.sentiment_based_on_words === 'Neutral' && ' 😐 Neutral'}
                {sentimentResult.sentiment_based_on_words === 'Negative' && ' 🙁 Negative'}
                {sentimentResult.sentiment_based_on_words === 'Very Negative' && ' 😢 Very Negative'}
              </p>
            </div>
          ) : (
            <p className="error-message">Sorry, the input text is not in Hindi. Please enter a review in Hindi.</p>
          )}
          {sentimentResult.error && (
            <p className="error-message">{sentimentResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
