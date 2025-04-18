import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { SPAWNS } from "features/world/lib/spawn";

export const PORTAL_NAME = "easter";

// Eggs
export const EGG_SPAWN_INTERVAL = 2000;
export const EGG_SPAWN_LEFT_LIMIT = 165;
export const EGG_SPAWN_RIGHT_LIMIT = 313;
export const FRIED_EGGS_CONFIG = [
  { x: 287, y: 349 },
  { x: 177, y: 353 },
  { x: 105, y: 191 },
  { x: 283, y: 277 },
  { x: 147, y: 298 },
  { x: 187, y: 152 },
  { x: 301, y: 177 },
  { x: 102, y: 252 },
  { x: 173, y: 422 },
  { x: 353, y: 268 },
  { x: 208, y: 190 },
  { x: 198, y: 227 },
  { x: 314, y: 323 },
  { x: 331, y: 215 },
  { x: 245, y: 333 },
  { x: 357, y: 333 },
  { x: 157, y: 211 },
  { x: 312, y: 403 },
  { x: 300, y: 239 },
  { x: 255, y: 428 },
  { x: 254, y: 155 },
  { x: 263, y: 242 },
  { x: 159, y: 393 },
  { x: 101, y: 394 },
  { x: 124, y: 368 },
  { x: 203, y: 288 },
  { x: 367, y: 157 },
  { x: 353, y: 414 },
  { x: 212, y: 370 },
  { x: 168, y: 247 },
  { x: 205, y: 330 },
  { x: 226, y: 253 },
  { x: 130, y: 268 },
  { x: 127, y: 335 },
  { x: 318, y: 362 },
  { x: 366, y: 219 },
  { x: 327, y: 293 },
  { x: 335, y: 153 },
  { x: 110, y: 299 },
  { x: 276, y: 388 },
  { x: 214, y: 423 },
  { x: 359, y: 381 },
  { x: 278, y: 201 },
  { x: 233, y: 301 },
  { x: 364, y: 299 },
  { x: 133, y: 424 },
  { x: 242, y: 195 },
  { x: 142, y: 180 },
  { x: 244, y: 368 },
  { x: 274, y: 312 },
  { x: 126, y: 219 },
  { x: 180, y: 403 },
  { x: 220, y: 398 },
  { x: 255, y: 398 },
  { x: 177, y: 296 },
];

// Enemies
export const ENEMY_SPAWN_INTERVAL = 10000;

export const Y_AXIS = SPAWNS().easter.default.y - 6;
export const SPECIALHAWK_Y = 248;
export const HAWK_SCALE = 0.7;
export const SNAKE_SCALE = 0.8;
export const DIVE_POINT = 100;
export const SNAKE_CONFIGURATION = {
  snakeX_config: {
    RtoL: { x: 335 },
    LtoR: { x: 115 },
  },
  snake_jumping: {
    fromX: SPAWNS().easter.default.x - 1,
    toX: SPAWNS().easter.default.x + 1,
  },
};
export const HAWK_CONFIGURATION = {
  normalHawk: {
    RtoL: { x: 335 },
    LtoR: { x: 115 },
  },
  specialHawk: {
    RtoL: { x: 0 },
    LtoR: { x: 450 },
  },
};
export const SNAKE_INITIAL_SPEED = 30;
export const SNAKE_COLLISION_SPEED = 20;
export const SPECIAL_SNAKE_JUMP_VELOCITY_Y = -250;

// Player
export const WALKING_SPEED = 60;
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
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["hopper"];

//Sound
export const NEW_EGG_TIME_DELAY = 2500;
export const PORTAL_VOLUME = 0.3;