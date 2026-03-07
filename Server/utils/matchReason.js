export const generateMatchReason = (breakdown, dominantEmotion) => {

  if (!breakdown) {
    return "You may benefit from sharing experiences with each other.";
  }

  const { emotion_similarity, stability_alignment, sentiment_alignment } = breakdown;

  // Strong emotional similarity
  if (emotion_similarity > 0.85) {
    return `You both frequently experience similar emotions like ${dominantEmotion}, making it easier to relate to each other's journey.`;
  }

  // Emotional stability alignment
  if (stability_alignment > 0.8) {
    return "You both show similar emotional stability patterns, which can create a supportive connection.";
  }

  // Sentiment alignment
  if (sentiment_alignment > 0.75) {
    return "Your overall emotional outlook appears similar, which may help you understand each other better.";
  }

  // Complementary personalities
  return "Your emotional journeys complement each other and may offer balanced perspectives.";
};