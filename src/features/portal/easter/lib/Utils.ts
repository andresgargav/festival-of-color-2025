import { Minigame } from "features/game/types/game";
import {
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
  RESTOCK_ATTEMPTS,
  BETA_TESTERS,
} from "../Constants";

/**
 * Gets the number of attempts left for the minigame.
 * @param minigame The minigame.
 * @returns The number of attempts left.
 */
export const getAttemptsLeft = (minigame?: Minigame, farmId = 0) => {
  // const dateKey = new Date().toISOString().slice(0, 10);

  const history = minigame?.history ?? {};
  const purchases = minigame?.purchases ?? [];
  let dailyAttempts = DAILY_ATTEMPTS;
  const specificAttemptsByDay = ["2025-04-21"];
  const initialDate = "2025-06-30"; // The date when the minigame started
  const freeAttemptsPerDay = 1; // The number of free attempts per day
  const attemptsBeta = 100;
  // Review code – I might need to change `farmId` to `id`.
  // const specificAttemptsByFarmAndDate = [
  //   {
  //     farmId: 13275,
  //     startDate: "2025-04-25",
  //     endDate: "2025-04-25",
  //     attempts: DAILY_ATTEMPTS + 10,
  //   },
  // ];

  const now = new Date();
  // const startOfTodayUTC = getStartOfUTCDay(now);
  // const endOfTodayUTC = startOfTodayUTC + 24 * 60 * 60 * 1000; // 24 hours later

  const hasUnlimitedAttempts = hasRecentUnlimitedAttempts(purchases);
  if (hasUnlimitedAttempts) return Infinity;

  let restockAttempts = 0;
  RESTOCK_ATTEMPTS.forEach((option) => {
    const restockedCount = purchases.filter(
      (purchase) =>
        purchase.sfl === option.sfl && isWithinRange(purchase.purchasedAt),
    ).length;

    restockAttempts += option.attempts * restockedCount;
  });

  // daily attempts specific to the day
  if (specificAttemptsByDay.includes(now.toISOString().substring(0, 10))) {
    dailyAttempts = 3;
  }

  // daily attempts specific to the farm and date
  // specificAttemptsByFarmAndDate.forEach((farm) => {
  //   const startDate = new Date(farm.startDate);
  //   const endDate = new Date(farm.endDate);
  //   const dateToCheck = new Date(now.toISOString().substring(0, 10));

  //   if (
  //     farm.farmId === farmId &&
  //     dateToCheck >= startDate &&
  //     dateToCheck <= endDate
  //   ) {
  //     dailyAttempts = farm.attempts;
  //   }
  // });

  // const attemptsToday = history[dateKey]?.attempts ?? 0;
  const totalAttemptsUsed = getTotalAttemptsInSurroundingMonths(history);

  const freeTotalAttempts =
    getDaysPassedSince(initialDate) * freeAttemptsPerDay;

  let attemptsLeft = freeTotalAttempts - totalAttemptsUsed + restockAttempts;

  if (BETA_TESTERS.includes(farmId)) {
    attemptsLeft += attemptsBeta;
  }

  return attemptsLeft;
};

/**
 * Checks if there are any recent purchases of unlimited attempts.
 * @param purchases The list of purchases made in the minigame.
 * @returns True if there are recent purchases of unlimited attempts, false otherwise.
 */
const hasRecentUnlimitedAttempts = (
  purchases: { purchasedAt: number; sfl: number }[],
): boolean => {
  return purchases.some((purchase) => {
    const isPurchaseWithinRange = isWithinRange(purchase.purchasedAt);
    return isPurchaseWithinRange && purchase.sfl === UNLIMITED_ATTEMPTS_SFL;
  });
};

/**
 * Calculates the total number of attempts used in the current month, previous month, and next month.
 * @param history The history of attempts, where keys are date strings and values are objects with an `attempts` property.
 * @returns The total number of attempts used in the surrounding months.
 */
const getTotalAttemptsInSurroundingMonths = (
  history: Record<string, { attempts: number }>,
) => {
  return Object.entries(history).reduce((sum, [dateString, entry]) => {
    return isWithinRange(dateString) ? sum + entry.attempts : sum;
  }, 0);
};

/**
 * Checks if a given date is within the range of the current month, the previous month, or the next month.
 * @param date The date to check, can be a string or a number (timestamp).
 * @returns True if the date is within the range, false otherwise.
 */
const isWithinRange = (date: string | number) => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentYear = now.getFullYear();
  const entryDate = new Date(date);
  const year = entryDate.getFullYear();
  const month = entryDate.getMonth();
  const monthDiff = (year - currentYear) * 12 + (month - currentMonth);
  return monthDiff >= -1 && monthDiff <= 1;
};

/**
 * Calculates the number of days passed since a given UTC start date.s
 * @param utcStartDate The UTC start date in the format "YYYY-MM-DD".
 * @returns The number of days passed since the start date, including today as day 1.
 */
function getDaysPassedSince(utcStartDate: string): number {
  const start = new Date(utcStartDate); // ej: "2025-04-21"
  const now = new Date();

  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const msPerDay = 1000 * 60 * 60 * 24;

  const diffInDays = Math.floor((nowUTC - startUTC) / msPerDay);

  return Math.max(0, diffInDays + 1);
}

/**
 * Gets the start of the UTC day for a given date.
 * @param date The date.
 * @returns The start of the UTC day for the given date.
 */
const getStartOfUTCDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0); // set time to midnight UTC
  return startOfDay.getTime();
};
