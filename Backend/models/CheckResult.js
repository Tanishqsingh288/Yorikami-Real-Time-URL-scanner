function evaluateResults(checks) {
  const totalPossible = checks.length;
  let pointsEarned = 0;
  const details = [];

  // Define messages that indicate critical failures
  const criticalFailureMessages = [
    "flagged as unsafe"
    // "Error checking third-party scripts"
  ];

  try {
    // Check for critical failures first
    const hasCriticalFailure = checks.some(check => {
      try {
        return criticalFailureMessages.some(msg =>
          check.message.includes(msg) && !check.passed
        );
      } catch (err) {
        // If any error while checking this, ignore for now
        return false;
      }
    });

    if (hasCriticalFailure) {
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
      try {
        pointsEarned += check.score;
        details.push(check);
      } catch (err) {
        // If error occurs in processing this check, give 3 points
        pointsEarned += 3;
        details.push({
          message: 'Error processing check',
          passed: false,
          score: 3,
          error: err.message
        });
      }
    });

    // Calculate final score scaled to 10
    const finalScore = Math.round((pointsEarned / totalPossible) * 10);
    const rating = getRating(finalScore);

    return {
      pointsEarned,
      totalPossible,
      finalScore,
      rating,
      details
    };

  } catch (error) {
    // Global catch – if something really unexpected goes wrong
    return {
      pointsEarned: 3,
      totalPossible,
      finalScore: 3,
      rating: 'UNSAFE',
      details: [{
        message: 'Critical system error during evaluation',
        passed: false,
        score: 3,
        error: error.message
      }]
    };
  }
}

function getRating(score) {
  if (score >= 7 && score <= 10) return 'SAFE';
  if (score >= 4 && score <= 6) return 'RISKY';
  if (score >= 0 && score <= 3) return 'UNSAFE';
  return 'UNSAFE';
}

module.exports = { evaluateResults };
