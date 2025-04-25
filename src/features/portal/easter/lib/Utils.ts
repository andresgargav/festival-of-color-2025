import { Minigame } from "features/game/types/game";
import {
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
  RESTOCK_ATTEMPTS,
} from "../Constants";

/**
 * Gets the number of attempts left for the minigame.
 * @param minigame The minigame.
 * @returns The number of attempts left.
 */
export const getAttemptsLeft = (minigame?: Minigame, farmId?: number) => {
  const dateKey = new Date().toISOString().slice(0, 10);

  const history = minigame?.history ?? {};
  const purchases = minigame?.purchases ?? [];
  let dailyAttempts = DAILY_ATTEMPTS;
  const specificAttemptsByDay = ["2025-04-21"];
  // Review code – I might need to change `farmId` to `id`.
  const specificAttemptsByFarmAndDate = [
    {
      farmId: 13275,
      startDate: "2025-04-25",
      endDate: "2025-04-25",
      attempts: DAILY_ATTEMPTS + 10,
    },
    {
      farmId: 30029,
      startDate: "2025-04-25",
      endDate: "2025-04-25",
      attempts: DAILY_ATTEMPTS + 10,
    },
    {
      farmId: 681,
      startDate: "2025-04-25",
      endDate: "2025-04-25",
      attempts: DAILY_ATTEMPTS + 20,
    },
    {
      farmId: 13276,
      startDate: "2025-04-25",
      endDate: "2025-04-25",
      attempts: DAILY_ATTEMPTS + 15,
    },
  ];

  const now = new Date();
  const startOfTodayUTC = getStartOfUTCDay(now);
  const endOfTodayUTC = startOfTodayUTC + 24 * 60 * 60 * 1000; // 24 hours later

  const hasUnlimitedAttempts = purchases.some(
    (purchase) =>
      purchase.sfl === UNLIMITED_ATTEMPTS_SFL &&
      purchase.purchasedAt >= startOfTodayUTC &&
      purchase.purchasedAt < endOfTodayUTC,
  );
  if (hasUnlimitedAttempts) return Infinity;

  let restockAttempts = 0;
  RESTOCK_ATTEMPTS.forEach((option) => {
    const restockedCount = purchases.filter(
      (purchase) =>
        purchase.sfl === option.sfl &&
        purchase.purchasedAt >= startOfTodayUTC &&
        purchase.purchasedAt < endOfTodayUTC,
    ).length;

    restockAttempts += option.attempts * restockedCount;
  });

  // daily attempts specific to the day
  if (specificAttemptsByDay.includes(now.toISOString().substring(0, 10))) {
    dailyAttempts = 3;
  }

  // daily attempts specific to the farm and date
  specificAttemptsByFarmAndDate.forEach((farm) => {
    const startDate = new Date(farm.startDate);
    const endDate = new Date(farm.endDate);
    const dateToCheck = new Date(now.toISOString().substring(0, 10));

    if (
      farm.farmId === farmId &&
      dateToCheck >= startDate &&
      dateToCheck <= endDate
    ) {
      dailyAttempts = farm.attempts;
    }
  });

  const attemptsToday = history[dateKey]?.attempts ?? 0;
  const attemptsLeft = dailyAttempts - attemptsToday + restockAttempts;

  return attemptsLeft;
};

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
