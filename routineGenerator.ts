
import { Exercise, UserCheckIn, ExerciseType, PainLevel, RoutineItem } from '../types';
import { EXERCISE_DB } from '../constants';

export const generateRoutine = (checkIn: UserCheckIn): RoutineItem[] => {
  const { painLevel, availableTimeMin, feeling } = checkIn;
  
  let selectedExercises: Exercise[] = [];
  
  // Filter helpers
  const relaxMoves = EXERCISE_DB.filter(e => e.type === ExerciseType.RELAXATION);
  const upperMoves = EXERCISE_DB.filter(e => e.type === ExerciseType.UPPER_POSTURE);
  const coreMoves = EXERCISE_DB.filter(e => e.type === ExerciseType.CORE_PELVIS);

  // Helper to pick random
  const pick = (arr: Exercise[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 1. Select Base Exercises based on Condition
  if (painLevel >= PainLevel.HURT) {
    // Pain Mode: All Relax
    selectedExercises = pick(relaxMoves, 4);
  } else if (feeling === 'COMPRESSED') {
    // Compressed: Core Focus
    const deadBug = coreMoves.find(e => e.id === 'dead-bug');
    const specificCore = deadBug ? [deadBug] : [];
    selectedExercises = [
      ...pick(relaxMoves, 2),
      ...pick(upperMoves, 2),
      ...specificCore,
      ...pick(coreMoves.filter(e => e.id !== 'dead-bug'), 1)
    ];
  } else {
    // Standard Mix
    selectedExercises = [
      ...pick(relaxMoves, 2),
      ...pick(upperMoves, 2),
      ...pick(coreMoves, 1)
    ];
  }

  // 2. Calculate Sets to fill Available Time
  // Target Seconds = Mins * 60
  const targetSeconds = availableTimeMin * 60;
  
  // Calculate duration of one full round (sum of exercise durations) + buffer for transition (e.g., 10s)
  const oneRoundDuration = selectedExercises.reduce((acc, ex) => acc + ex.durationSec + 15, 0);
  
  // Estimate loops needed
  let estimatedLoops = Math.floor(targetSeconds / oneRoundDuration);
  if (estimatedLoops < 1) estimatedLoops = 1; // At least 1 set

  // If time is short (5 mins), usually 1 set is enough.
  // If time is long (30 mins), we might need 3-4 sets.
  
  // Refine specifically for the time blocks to avoid over-calculation quirks
  let sets = 1;
  if (availableTimeMin === 5) sets = 1;
  else if (availableTimeMin === 15) sets = 2; // ~10-12 mins actaul work
  else if (availableTimeMin === 30) sets = 4; // ~20-25 mins actual work

  // 3. Map to RoutineItem
  const routineItems: RoutineItem[] = selectedExercises.map(ex => ({
    ...ex,
    sets: sets,
    currentSet: 1
  }));

  return routineItems;
};

// AI PROMPT GENERATOR (Deliverable)
export const getSystemPromptForAI = (checkIn: UserCheckIn) => {
  return `
    ROLE: You are a high-energy "Shibuya Gyaru" fitness coach. 
    TONE: Use Traditional Chinese (zh-TW 繁體中文), excessive emojis, slang (Slay, Vibe check, Aesthetic, 水喔, 超派), and be very encouraging but strict about posture.
    
    TASK: Generate a post-workout feedback analysis based on user input.
    
    USER INPUT:
    - Difficulty: ${checkIn.painLevel}
    - Feeling: ${checkIn.feeling}
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "advice": "Short, punchy advice in Gyaru style.",
      "nextFocus": "What they should focus on tomorrow (e.g. 'Neck', 'Core')."
    }
  `;
};
