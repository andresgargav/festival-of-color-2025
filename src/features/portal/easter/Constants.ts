import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { SPAWNS } from "features/world/lib/spawn";
import { SUNNYSIDE } from "assets/sunnyside";

// Festival of color
import cyanBalloon from "public/world/balloon-falling-cyan.png";
import dart from "public/world/dart.gif";
import slime from "public/world/slime.gif";
import airballoon_slime from "public/world/airballoon_slime_shooting.gif";
import ground_slime from "public/world/ground_slime_shooting.gif";
import red_balloon from "public/world/balloon-falling-red.png";
import blue_balloon from "public/world/balloon-falling-blue.png";
import green_balloon from "public/world/balloon-falling-green.png";
import yellow_balloon from "public/world/balloon-falling-yellow.png";
import cyan_balloon from "public/world/balloon-falling-cyan.png";

export const PORTAL_NAME = "festival-of-colors-2025";

// Dart
export const DART_SHOOTING_DELAY = 650;
export const DART_VELOCITY = 150;

// Balloons
export const BALLOON_SPAWN_INTERVAL = 1200;
export const BALLOON_SPAWN_LEFT_LIMIT = 293;
export const BALLOON_SPAWN_RIGHT_LIMIT = 426;
export const AMOUNT_CYAN_BALLOONS = 3;

// Enemies
export const ENEMY_SPAWN_INTERVAL = 8000;
export const ENEMY_SPAWN_REDUCTION_PER_MINUTE = 5500;
export const MINIMUM_ENEMY_SPAWN_INTERVAL = 2500;
export const ENEMY_SPAWN_INTERVAL_HARD_MODE = 1500;

// Festival of Color
export const Y_AXIS = SPAWNS()[PORTAL_NAME].default.y - 6;
export const SHOOTING_SPRITE_SCALE = 1.4;
export const IDLE_SPRITE_SCALE = 1.25;
export const SIGNAL_SPRITE_SCALE = 1.3;
export const PRE_ACTION_DELAY = 1000;

export const MACHINE_DECO_CONFIG = {
  config1: { x: 230, y: 280 },
  config2: { x: 140, y: 180 },
  config3: { x: 550, y: 120 },
  config4: { x: 480, y: 230 },
};
export const BALLOON_DECO_CONFIG = { x: 32.5, y: 5 };

// Stone and sprites configuration
export const STONE_CONFIGURATION = { RtoL: 457, LtoR: 260 };
export const BOUNCING_CONFIGURATION = {
  config_1: {
    duration: 4080,
    gravityY: 260,
    velocityY: -260,
    despawnIdle: 2200,
    respawnIdle: 2900,
  },
  config_2: {
    duration: 4500,
    gravityY: 300,
    velocityY: -300,
    despawnIdle: 2400,
    respawnIdle: 3300,
  },
};

// Player
export const WALKING_SPEED = 75;
export const PLAYER_JUMP_VELOCITY_Y = -165;
export const PLAYER_PERCENTAGE_DEBUFF_VELOCITY = -0.5;
export const PLAYER_PERCENTAGE_DEBUFF_VELOCITY_HARD_MODE = -0.75;
export const TIME_DEBUFF_VELOCITY = 5000;

// Game config
export const GAME_SECONDS = 120;
export const GAME_LIVES = 4;
export const GRAVITY = 450;

// Attempts
export const INITIAL_DATE = "2025-06-30";
export const ATTEMPTS_BETA_TESTERS = 100;
export const UNLIMITED_ATTEMPTS_SFL = 100; // If this value is less than 0, the option disappears
export const FREE_DAILY_ATTEMPTS = 1;
export const RESTOCK_ATTEMPTS = [
  { attempts: 1, sfl: 3 },
  { attempts: 3, sfl: 7 },
  { attempts: 7, sfl: 14 },
  { attempts: 25, sfl: 30 },
];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Paint Splattered Hair",
  shoes: "Black Farmer Boots",
  pants: "Paint Splattered Overalls",
  tool: "Paint Spray Can",
  shirt: "Paint Splattered Shirt",
  hat: "Slime Hat",
  wings: "Slime Wings",
};

//Sound
export const NEW_BALLOON_TIME_DELAY = 2000;
export const PORTAL_VOLUME = 0.5;
export const PORTAL_BACKGROUND_VOLUME = 0.2;

// Guide
export const INSTRUCTIONS: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: cyanBalloon,
    description: t(`${PORTAL_NAME}.instructions1`),
  },
  {
    image: yellow_balloon,
    description: t(`${PORTAL_NAME}.instructions2`),
  },
  {
    image: dart,
    description: t(`${PORTAL_NAME}.instructions3`),
  },
  {
    image: red_balloon,
    description: t(`${PORTAL_NAME}.instructions4`),
  },
  {
    image: slime,
    description: t(`${PORTAL_NAME}.instructions5`),
  },
];

export const RESOURCES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: green_balloon,
    description: t(`${PORTAL_NAME}.resource1`),
  },
  {
    image: blue_balloon,
    description: t(`${PORTAL_NAME}.resource2`),
  },
  {
    image: cyan_balloon,
    description: t(`${PORTAL_NAME}.resource3`),
  },
  {
    image: yellow_balloon,
    description: t(`${PORTAL_NAME}.resource4`),
  },
];

export const ENEMIES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: airballoon_slime,
    description: t(`${PORTAL_NAME}.enemy1`),
  },
  {
    image: ground_slime,
    description: t(`${PORTAL_NAME}.enemy2`),
  },
  {
    image: red_balloon,
    description: t(`${PORTAL_NAME}.enemy3`),
  },
];

export const HARD_MODE_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: ground_slime,
    description: t(`${PORTAL_NAME}.hardMode1`),
  },
  {
    image: SUNNYSIDE.icons.heart,
    description: t(`${PORTAL_NAME}.hardMode2`),
  },
  {
    image: red_balloon,
    description: t(`${PORTAL_NAME}.hardMode3`),
  },
];

export const BETA_TESTERS = [
  29, 9609, 49035, 155026, 1181, 151471, 49035, 86, 79871, 2299, 21303, 206876,
  9239, 36214, 55626, 3249, 128122,
];
