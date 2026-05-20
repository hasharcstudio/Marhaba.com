// Compatibility Scoring Engine for Marhaba
// Calculates a weighted compatibility score between two users

export interface ScoringProfile {
  age?: number;
  gender?: string | null;
  profession?: string | null;
  location?: string | null;
  distance_km?: number | null;
  prompt_answer?: string | null;
}

export interface ScoringPreferences {
  min_age?: number;
  max_age?: number;
  preferred_gender?: string | null;
  preferred_religion?: string | null;
  preferred_location?: string | null;
  max_distance_km?: number;
  preferred_education?: string | null;
}

// Weight configuration — tweak these to change what matters most
const WEIGHTS = {
  age: 25,         // Age match is very important
  distance: 30,    // Proximity matters a lot in Bangladesh
  gender: 15,      // Gender preference match
  location: 15,    // Same city/area preference
  activity: 15,    // Profile completeness / engagement signals
};

/**
 * Calculate a compatibility score between 0-100
 * Higher scores = better match
 */
export function calculateCompatibilityScore(
  candidate: ScoringProfile,
  preferences: ScoringPreferences
): number {
  let totalScore = 0;

  // --- Age Score (0-25 pts) ---
  const minAge = preferences.min_age ?? 18;
  const maxAge = preferences.max_age ?? 100;
  const candidateAge = candidate.age ?? 25;

  if (candidateAge >= minAge && candidateAge <= maxAge) {
    // Perfect range = full points
    totalScore += WEIGHTS.age;
  } else {
    // Degrade gracefully: lose 5 pts per year outside range
    const diff = candidateAge < minAge
      ? minAge - candidateAge
      : candidateAge - maxAge;
    totalScore += Math.max(0, WEIGHTS.age - diff * 5);
  }

  // --- Distance Score (0-30 pts) ---
  const maxDist = preferences.max_distance_km ?? 100;
  const distance = candidate.distance_km ?? 50;

  if (distance <= maxDist) {
    // Closer = higher score. Within 5km = perfect score
    const ratio = 1 - (distance / maxDist);
    totalScore += Math.round(WEIGHTS.distance * ratio);
  } else {
    // Beyond max distance, still show but with reduced score
    const overshoot = distance - maxDist;
    totalScore += Math.max(0, WEIGHTS.distance - Math.round(overshoot / 5));
  }

  // --- Gender Preference Score (0-15 pts) ---
  if (!preferences.preferred_gender || preferences.preferred_gender === candidate.gender) {
    totalScore += WEIGHTS.gender;
  }
  // If gender doesn't match preference, 0 points for this category

  // --- Location Match Score (0-15 pts) ---
  if (preferences.preferred_location && candidate.location) {
    const prefLoc = preferences.preferred_location.toLowerCase();
    const candLoc = candidate.location.toLowerCase();
    
    if (candLoc.includes(prefLoc) || prefLoc.includes(candLoc)) {
      totalScore += WEIGHTS.location;
    } else {
      // Partial: same city but different area
      const prefCity = prefLoc.split(",").pop()?.trim() ?? "";
      const candCity = candLoc.split(",").pop()?.trim() ?? "";
      if (prefCity && candCity && prefCity === candCity) {
        totalScore += Math.round(WEIGHTS.location * 0.6);
      }
    }
  } else {
    // No location preference = neutral (half points)
    totalScore += Math.round(WEIGHTS.location * 0.5);
  }

  // --- Activity / Profile Completeness Score (0-15 pts) ---
  let activityScore = 0;
  if (candidate.profession) activityScore += 5;
  if (candidate.prompt_answer) activityScore += 5;
  if (candidate.location) activityScore += 5;
  totalScore += Math.min(activityScore, WEIGHTS.activity);

  return Math.min(100, Math.max(0, totalScore));
}

/**
 * Sort profiles by compatibility score (descending)
 */
export function rankProfiles(
  candidates: ScoringProfile[],
  preferences: ScoringPreferences
): (ScoringProfile & { compatibilityScore: number })[] {
  return candidates
    .map(candidate => ({
      ...candidate,
      compatibilityScore: calculateCompatibilityScore(candidate, preferences),
    }))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
