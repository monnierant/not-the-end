import { id } from "../system.json";

export const defaultLenght = {
  talent: 5,
  quality: 6,
  ability: 12,
};

export const difficultyLevels = [
  { value: 0, label: "easy" },
  { value: -10, label: "medium" },
  { value: -20, label: "hard" },
  { value: -30, label: "veryhard" },
  { value: -40, label: "impossible" },
];

export const moduleId: string = id;
