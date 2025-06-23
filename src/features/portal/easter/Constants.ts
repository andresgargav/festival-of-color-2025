import { Equipped } from "features/game/types/bumpkin";
import { translate as t } from "lib/i18n/translate";
import { NPC_WEARABLES } from "lib/npcs";
import { SPAWNS } from "features/world/lib/spawn";
import { SUNNYSIDE } from "assets/sunnyside";

// Festival of color
import cyanBalloon from "public/world/balloon-falling-cyan.png";
import dart from "public/world/dart.gif";
import slime from "public/world/slime.gif";
import airballoon_slime from "public/world/airballoon_slime_shooting.gif";
import ground_slime from "public/world/ground_slime_shooting.gif";

export const PORTAL_NAME = "festival-of-colors-2025";

// Dart
export const DART_SHOOTING_DELAY = 300;
export const DART_VELOCITY = 100;

// Balloons
export const BALLOON_SPAWN_INTERVAL = 2000;
export const BALLOON_SPAWN_LEFT_LIMIT = 293;
export const BALLOON_SPAWN_RIGHT_LIMIT = 426;
export const AMOUNT_CYAN_BALLOONS = 3;

// Enemies
export const ENEMY_SPAWN_INTERVAL = 10000;
export const ENEMY_SPAWN_REDUCTION_PER_MINUTE = 3500;
export const MINIMUM_ENEMY_SPAWN_INTERVAL = 3000;

// Festival of Color
export const Y_AXIS = SPAWNS()[PORTAL_NAME].default.y - 6;
export const SHOOTING_SPRITE_SCALE = 1.4;
export const IDLE_SPRITE_SCALE = 1.25;
export const SIGNAL_SPRITE_SCALE = 1.3;
export const PRE_ACTION_DELAY = 1000;

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
export const WALKING_SPEED = 60;
export const PLAYER_JUMP_VELOCITY_Y = -165;
export const PLAYER_PERCENTAGE_DEBUFF_VELOCITY = 0.5;
export const TIME_DEBUFF_VELOCITY = 5000;

// Game config
export const GAME_SECONDS = 180;
export const GAME_LIVES = 3;
export const GRAVITY = 450;

// Attempts
export const UNLIMITED_ATTEMPTS_SFL = 150; // If this value is less than 0, the option disappears
export const DAILY_ATTEMPTS = 1;
export const RESTOCK_ATTEMPTS = [
  { attempts: 1, sfl: 3 },
  { attempts: 3, sfl: 7 },
  { attempts: 7, sfl: 14 },
  { attempts: 25, sfl: 30 },
];

// Panel
export const PANEL_NPC_WEARABLES: Equipped = NPC_WEARABLES["hopper"];

//Sound
export const NEW_BALLOON_TIME_DELAY = 2500;
export const PORTAL_VOLUME = 0.3;
export const PORTAL_BACKGROUND_VOLUME = 0.1;

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
    image: dart,
    description: t(`${PORTAL_NAME}.instructions2`),
  },
  {
    image: slime,
    description: t(`${PORTAL_NAME}.instructions3`),
  },
];

export const RESOURCES_TABLE: {
  image: string;
  description: string;
  width?: number;
}[] = [
  {
    image: SUNNYSIDE.icons.stopwatch,
    description: t(`${PORTAL_NAME}.resource1`),
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
];
