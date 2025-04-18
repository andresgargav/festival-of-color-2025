import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { SPAWNS } from "features/world/lib/spawn";
import easterEgg from "public/world/easter_egg.png";
import superEasterEgg from "public/world/super_easter_egg.png";
import goldenEgg from "public/world/golden_egg.png";
import badEgg from "public/world/bad_egg.png";
import snake from "public/world/snake.gif";
import specialSnake from "public/world/special_snake.gif";
import hawk from "public/world/hawk.png";
import specialHawk from "public/world/special_hawk.png";

export const PORTAL_NAME = "easter";

// Eggs
export const EGG_SPAWN_INTERVAL = 2000;
export const EGG_SPAWN_LEFT_LIMIT = 276;
export const EGG_SPAWN_RIGHT_LIMIT = 426;
export const FRIED_EGGS_CONFIG = [
  { x: 348, y: 37 },
  { x: 164, y: 41 },
  { x: 326, y: 232 },
  { x: 680, y: 136 },
  { x: 265, y: 44 },
  { x: 166, y: 7 },
  { x: 566, y: 198 },
  { x: 218, y: 192 },
  { x: 639, y: 34 },
  { x: 410, y: 285 },
  { x: 613, y: 133 },
  { x: 200, y: 6 },
  { x: 365, y: 234 },
  { x: 304, y: 379 },
  { x: 507, y: 357 },
  { x: 183, y: 338 },
  { x: 57, y: 320 },
  { x: 121, y: 172 },
  { x: 458, y: 8 },
  { x: 32, y: 139 },
  { x: 585, y: 277 },
  { x: 570, y: 153 },
  { x: 269, y: 293 },
  { x: 596, y: 343 },
  { x: 407, y: 84 },
  { x: 395, y: 255 },
  { x: 571, y: 385 },
  { x: 421, y: 201 },
  { x: 118, y: 10 },
  { x: 510, y: 287 },
  { x: 6, y: 172 },
  { x: 157, y: 277 },
  { x: 252, y: 216 },
  { x: 471, y: 322 },
  { x: 309, y: 87 },
  { x: 437, y: 335 },
  { x: 222, y: 81 },
  { x: 385, y: 374 },
  { x: 93, y: 247 },
  { x: 130, y: 353 },
  { x: 645, y: 288 },
  { x: 671, y: 264 },
  { x: 578, y: 68 },
  { x: 680, y: 3 },
  { x: 38, y: 85 },
  { x: 612, y: 230 },
  { x: 387, y: 313 },
  { x: 22, y: 285 },
  { x: 200, y: 40 },
  { x: 362, y: 182 },
  { x: 96, y: 382 },
  { x: 451, y: 365 },
  { x: 670, y: 219 },
  { x: 80, y: 150 },
  { x: 402, y: 345 },
  { x: 199, y: 308 },
  { x: 349, y: 1 },
  { x: 479, y: 190 },
  { x: 663, y: 337 },
  { x: 462, y: 106 },
  { x: 507, y: 43 },
  { x: 446, y: 157 },
  { x: 510, y: 159 },
  { x: 107, y: 86 },
  { x: 218, y: 248 },
  { x: 115, y: 217 },
  { x: 137, y: 128 },
  { x: 182, y: 208 },
  { x: 163, y: 89 },
  { x: 163, y: 243 },
  { x: 302, y: 152 },
  { x: 35, y: 216 },
  { x: 237, y: 10 },
  { x: 413, y: 25 },
  { x: 9, y: 390 },
  { x: 604, y: 100 },
  { x: 545, y: 88 },
  { x: 686, y: 366 },
  { x: 79, y: 281 },
  { x: 538, y: 120 },
  { x: 599, y: 177 },
  { x: 676, y: 66 },
  { x: 199, y: 371 },
  { x: 267, y: 139 },
  { x: 229, y: 320 },
  { x: 319, y: 337 },
  { x: 352, y: 95 },
  { x: 275, y: 95 },
  { x: 12, y: 45 },
  { x: 487, y: 236 },
  { x: 137, y: 319 },
  { x: 64, y: 118 },
  { x: 397, y: 169 },
  { x: 151, y: 385 },
  { x: 228, y: 145 },
  { x: 321, y: 57 },
  { x: 171, y: 145 },
  { x: 52, y: 354 },
  { x: 448, y: 284 },
  { x: 384, y: 110 },
  { x: 344, y: 303 },
  { x: 522, y: 317 },
  { x: 103, y: 334 },
  { x: 77, y: 203 },
  { x: 320, y: 15 },
  { x: 573, y: 108 },
  { x: 577, y: 29 },
  { x: 529, y: 247 },
  { x: 388, y: 46 },
  { x: 115, y: 282 },
  { x: 521, y: 389 },
  { x: 474, y: 61 },
  { x: 52, y: 249 },
  { x: 358, y: 335 },
  { x: 76, y: 36 },
  { x: 453, y: 227 },
  { x: 3, y: 209 },
  { x: 659, y: 106 },
  { x: 517, y: 1 },
  { x: 649, y: 162 },
  { x: 264, y: 371 },
  { x: 528, y: 191 },
  { x: 251, y: 263 },
  { x: 631, y: 204 },
  { x: 284, y: 233 },
  { x: 48, y: 172 },
  { x: 290, y: 197 },
  { x: 1, y: 256 },
  { x: 610, y: 378 },
  { x: 547, y: 347 },
  { x: 230, y: 359 },
  { x: 415, y: 141 },
  { x: 538, y: 54 },
  { x: 682, y: 309 },
  { x: 339, y: 132 },
  { x: 146, y: 206 },
  { x: 304, y: 272 },
  { x: 644, y: 387 },
  { x: 346, y: 374 },
  { x: 123, y: 49 },
  { x: 299, y: 119 },
  { x: 10, y: 7 },
  { x: 360, y: 272 },
  { x: 19, y: 354 },
  { x: 558, y: 298 },
  { x: 199, y: 113 },
  { x: 301, y: 309 },
  { x: 232, y: 42 },
  { x: 436, y: 54 },
  { x: 331, y: 196 },
  { x: 257, y: 172 },
  { x: 495, y: 93 },
  { x: 642, y: 72 },
  { x: 610, y: 65 },
  { x: 275, y: 334 },
  { x: 48, y: 390 },
  { x: 630, y: 343 },
  { x: 680, y: 183 },
  { x: 3, y: 324 },
  { x: 480, y: 380 },
  { x: 416, y: 384 },
  { x: 371, y: 149 },
  { x: 330, y: 167 },
  { x: 382, y: 209 },
];

// Enemies
export const ENEMY_SPAWN_INTERVAL = 10000;
export const ENEMY_SPAWN_REDUCTION_PER_MINUTE = 2000;
export const MINIMUM_ENEMY_SPAWN_INTERVAL = 2000;

// Snakes coordinates
export const Y_AXIS = SPAWNS().easter.default.y - 6;
export const SPECIALHAWK_Y = 184;
export const HAWK_SCALE = 0.7;
export const SNAKE_SCALE = 0.8;
export const DIVE_POINT = 210;
export const SNAKE_CONFIGURATION = {
  snakeX_config: {
    RtoL: { x: 464 },
    LtoR: { x: 232 },
  },
  snake_jumping: {
    fromX: SPAWNS().easter.default.x - 1,
    toX: SPAWNS().easter.default.x + 1,
  },
};
export const HAWK_CONFIGURATION = {
  normalHawk: {
    RtoL: { x: 464 },
    LtoR: { x: 232 },
  },
  specialHawk: {
    RtoL: { x: 0 },
    LtoR: { x: 690 },
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
export const UNLIMITED_ATTEMPTS_SFL = 20; // If this value is less than 0, the option disappears
export const DAILY_ATTEMPTS = 1;
export const RESTOCK_ATTEMPTS = [
  { attempts: 1, sfl: 3 },
  { attempts: 3, sfl: 7 },
  { attempts: 7, sfl: 14 },
];

// Guide
export const INSTRUCTIONS: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: easterEgg,
    description: t(`${PORTAL_NAME}.instructions1`),
  },
  {
    image: goldenEgg,
    description: t(`${PORTAL_NAME}.instructions2`),
  },
  {
    image: ITEM_DETAILS["Carrot Sword"].image,
    description: t(`${PORTAL_NAME}.instructions3`),
  },
  {
    image: badEgg,
    description: t(`${PORTAL_NAME}.instructions4`),
  },
  {
    image: snake,
    description: t(`${PORTAL_NAME}.instructions5`),
  },
];

export const RESOURCES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: easterEgg,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: superEasterEgg,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: goldenEgg,
    description: t(`${PORTAL_NAME}.resource3`),
  },
];

export const ENEMIES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: snake,
    description: t(`${PORTAL_NAME}.enemy1`),
  },
  {
    image: specialSnake,
    description: t(`${PORTAL_NAME}.enemy2`),
  },
  {
    image: hawk,
    description: t(`${PORTAL_NAME}.enemy3`),
  },
  {
    image: specialHawk,
    description: t(`${PORTAL_NAME}.enemy4`),
    width: 16,
  },
];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["hopper"];
