// utils/scoreUtils.ts
export const createScoreKey = (
  userId: string,
  materialName: string,
  quizName: string
) => {
  return `${userId}_${materialName}_${quizName}`.replace(/[.#$\/\[\]]/g, "_");
};
