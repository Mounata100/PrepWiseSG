// export const LEVELS = [
//   { level: 1, title: 'Recruit', minXP: 0, maxXP: 99 },
//   { level: 2, title: 'Responder', minXP: 100, maxXP: 249 },
//   { level: 3, title: 'Prepared Citizen', minXP: 250, maxXP: 499 },
//   { level: 4, title: 'Safety Advocate', minXP: 500, maxXP: 999 },
//   { level: 5, title: 'Community Leader', minXP: 1000, maxXP: 1999 },
//   { level: 6, title: 'Preparedness Champion', minXP: 2000, maxXP: Infinity },
// ];

// export const getCurrentLevel = (xp) => {
//   return LEVELS.find(
//     level =>
//       xp >= level.minXP &&
//       xp <= level.maxXP
//   );
// };

// export const getLevelProgress = (xp) => {
//   const level = getCurrentLevel(xp);

//   if (!level) return 0;

//   if (level.maxXP === Infinity) return 1;

//   return (
//     (xp - level.minXP) /
//     (level.maxXP - level.minXP)
//   );
// };
export const LEVELS = [
  { level: 1, title: 'Recruit', minXP: 0, maxXP: 150},
  { level: 2, title: 'Responder', minXP: 151, maxXP: 250 },
  { level: 3, title: 'Prepared Citizen', minXP: 251, maxXP: 500 },
  { level: 4, title: 'Safety Advocate', minXP: 501, maxXP: 1000 },
  { level: 5, title: 'Community Leader', minXP: 1001, maxXP: 2000 },
  { level: 6, title: 'Preparedness Champion', minXP: 20001, maxXP: Infinity },
];

export const getCurrentLevel = (xp = 0) => {
  const safeXP = Math.max(0, Number(xp) || 0);

  return (
    LEVELS.find(
      level =>
        safeXP >= level.minXP &&
        safeXP <= level.maxXP
    ) || LEVELS[0]
  );
};

export const getLevelProgress = (xp = 0) => {
  const safeXP = Math.max(0, Number(xp) || 0);
  const level = getCurrentLevel(safeXP);

  if (!level) return 0;

  if (level.maxXP === Infinity) {
    return 1;
  }

  const range = level.maxXP - level.minXP;

  if (range <= 0) return 1;

  return Math.min(
    Math.max(
      (safeXP - level.minXP) / range,
      0
    ),
    1
  );
};
