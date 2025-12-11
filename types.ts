
export enum ExerciseType {
  RELAXATION = 'RELAXATION',
  UPPER_POSTURE = 'UPPER_POSTURE',
  CORE_PELVIS = 'CORE_PELVIS'
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  durationSec: number;
  description: string;
  gyaruTip: string; // The fun commentary
}

// Wrapper for the routine to include sets calculation
export interface RoutineItem extends Exercise {
  sets: number;
  currentSet: number; // For tracking progress
}

export enum PainLevel {
  GREAT = 1,    // 😃
  SORE = 4,     // 🥲
  HURT = 7,     // 😫
  ZOMBIE = 10   // 🧟‍♀️
}

export enum TightnessArea {
  NECK = 'NECK',
  UPPER_BACK = 'UPPER_BACK',
  LOWER_BACK = 'LOWER_BACK',
  HIPS = 'HIPS'
}

export interface UserCheckIn {
  painLevel: PainLevel;
  tightness: TightnessArea[];
  availableTimeMin: number;
  feeling: 'NORMAL' | 'COMPRESSED' | 'STIFF';
}

export interface PostWorkoutFeedback {
  difficulty: 'TOO_EASY' | 'PERFECT' | 'TOO_HARD';
  feelingAfter: 'RELAXED' | 'TIRED' | 'PAIN';
  comment: string;
}

export type AppView = 'SPLASH' | 'CHECK_IN' | 'ROUTINE_PREVIEW' | 'PLAYING' | 'SUCCESS' | 'FEEDBACK' | 'HISTORY';

export interface DailyLog {
  id: string;
  date: string; // ISO String
  durationMin: number;
  exercisesCompleted: number;
  feedback?: PostWorkoutFeedback;
}
