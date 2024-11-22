import { id } from "../system.json";

export const defaultLenght = {
  talent: 5,
  quality: 6,
  ability: 12,
};

export const difficultyLevels = [
  { value: 1, label: "veryeasy" },
  { value: 2, label: "easy" },
  { value: 3, label: "normal" },
  { value: 4, label: "hard" },
  { value: 5, label: "veryhard" },
  { value: 6, label: "impossible" },
];

export const drawLevels = [1, 2, 3, 4, 5];

export const moduleId: string = id;
