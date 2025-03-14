import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";

export const PORTAL_NAME = "easter";

// Game config
export const GAME_SECONDS = 300;
export const GAME_LIVES = 5;

// Attempts
export const UNLIMITED_ATTEMPTS_SFL = -1; // If this value is less than 0, the option disappears
export const DAILY_ATTEMPTS = 1;
export const RESTOCK_ATTEMPTS = [
  { attempts: 1, sfl: 3 },
  { attempts: 5, sfl: 12 },
  { attempts: 10, sfl: 20 },
];

// Guide
export const INSTRUCTIONS: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource3`),
  },
];

export const RESOURCES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.resource3`),
  },
];

export const ENEMIES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.enemy1`),
  },
  {
    image: ITEM_DETAILS["Abandoned Bear"].image,
    description: t(`${PORTAL_NAME}.enemy2`),
  },
];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["elf"];

//Snakes coordinates
export const Y_axis = 270;
export const SNAKE_CONFIGURATION = {
  normalSnake: {
    RtoL: {x: 325, y: Y_axis},
    LtoR: {x: 130, y: Y_axis},
  },
}
