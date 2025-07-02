export const bodyParts = [
  "back", "cardio", "chest", "lower arms", "lower legs", "neck",
  "shoulders", "upper arms", "upper legs", "waist", "all"
];

export const equipments = [
  "assisted", "band", "barbell", "body weight", "bosu ball", "cable",
  "dumbbell", "elliptical machine", "ez barbell", "hammer", "kettlebell",
  "leverage machine", "medicine ball", "olympic barbell", "resistance band",
  "roller", "rope", "skierg machine", "sled machine", "smith machine",
  "stability ball", "stationary bike", "stepmill machine", "tire", "trap bar",
  "upper body ergometer", "weighted", "wheel roller", "all"
];

export const targets = [
  "abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system",
  "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae",
  "pectorals", "quads", "serratus anterior", "spine", "traps", "triceps", "upper back"
];

export type BodyPart = typeof bodyParts[number];
export type Equipment = typeof equipments[number];
export type Target = typeof targets[number];
