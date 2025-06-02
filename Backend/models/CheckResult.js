function evaluateResults(checks) {
  const totalPossible = checks.length;
  let pointsEarned = 0;
  const details = [];

  // Define messages that indicate critical failures
  const criticalFailureMessages = [
    "flagged as unsafe",
    //"Error checking third-party scripts"
  ];

  // Check for critical failures first
  const hasCriticalFailure = checks.some(check =>
    criticalFailureMessages.some(msg =>
      check.message.includes(msg) && !check.passed
    )
  );

  if (hasCriticalFailure) {
    // Return immediately with UNSAFE rating if critical failure found
    return {
      pointsEarned: 0,
      totalPossible,
      finalScore: 0,
      rating: 'UNSAFE',
      details: checks
    };
  }

  // If no critical failures, continue scoring normally
  checks.forEach(check => {
    pointsEarned += check.score;
    details.push(check);
  });

  // Calculate final score scaled to 10
  const finalScore = Math.round((pointsEarned / totalPossible) * 10);

  // Use the updated getRating function to map score to rating
  const rating = getRating(finalScore);

  return {
    pointsEarned,
    totalPossible,
    finalScore,
    rating,
    details
  };
}

function getRating(score) {
  if (score >= 7 && score <= 10) return 'SAFE';
  if (score >= 4 && score <= 6) return 'RISKY';
  if (score >= 0 && score <= 3) return 'UNSAFE';
  // fallback if score is out of range
  return 'UNSAFE';
}

module.exports = { evaluateResults };
