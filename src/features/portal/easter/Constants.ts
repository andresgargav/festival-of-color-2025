import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { SQUARE_WIDTH } from "features/game/lib/constants";

export const PORTAL_NAME = "easter";

// Enemies
export const ENEMY_SPAWN_INTERVAL = 10000;

// Snakes coordinates
export const Y_AXIS = 270;
export const HAWKSCALE = 0.7;
const ranNum: number = Math.floor(Math.random() * (290 - 170) + 170)
export const SPRITE_SCALE: number = 0.8;
export const SNAKE_CONFIGURATION = {
  snakeX_config: {
    RtoL: { x: 315 },
    LtoR: { x: 135 },
  },
  snake_jumping: {
    fromX: ranNum,
    toX: ranNum + 10,
  }
};
export const HAWK_CONFIGURATION = {
  normalHawk: {
    RtoL: { x: 325 },
    LtoR: { x: 130 },
  }
}
export const SNAKE_INITIAL_SPEED = 30;
export const SNAKE_COLLISION_SPEED = 20;

// Player
export const WALKING_SPEED = 50;
export const PLAYER_JUMP_VELOCITY_Y = -165;

// Game config
export const GAME_SECONDS = 300;
export const GAME_LIVES = 5;
export const GRAVITY = 450;

// Attempts
export const UNLIMITED_ATTEMPTS_SFL = -1; // If this value is less than 0, the option disappears
export const DAILY_ATTEMPTS = 5;
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
