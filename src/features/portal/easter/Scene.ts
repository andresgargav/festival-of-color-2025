import mapJson from "assets/map/easter-test.json";
// import tilesetconfig from "assets/map/tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/Machine";
import { EventObject } from "xstate";
import { SPAWNS } from "features/world/lib/spawn";
import { isTouchDevice } from "features/world/lib/device";
import {
  PORTAL_NAME,
  SNAKE_CONFIGURATION,
  Y_AXIS,
  WALKING_SPEED,
  GRAVITY,
  PLAYER_JUMP_VELOCITY_Y,
  ENEMY_SPAWN_INTERVAL,
} from "./Constants";
import { NormalSnake } from "./containers/NormalSnake";

// export const NPCS: NPCBumpkin[] = [
//   {
//     x: 380,
//     y: 400,
//     // View NPCModals.tsx for implementation of pop up modal
//     npc: "portaller",
//   },
// ];

export class Scene extends BaseScene {
  private enemySpawnInterval!: Phaser.Time.TimerEvent;

  ground!: Phaser.GameObjects.GameObject | undefined;
  leftWall!: Phaser.GameObjects.GameObject | undefined;
  rightWall!: Phaser.GameObjects.GameObject | undefined;
  sceneId: SceneId = PORTAL_NAME;
  normalSnake!: NormalSnake;

  constructor() {
    super({
      name: PORTAL_NAME,
      map: {
        json: mapJson,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet("snake_normal", "world/snake_normal.webp", {
      frameWidth: 20,
      frameHeight: 19,
    });

    this.load.spritesheet(
      "snake_normal_collision",
      "world/snake_normal_collision.webp",
      {
        frameWidth: 20,
        frameHeight: 19,
      },
    );
  }

  async create() {
    this.map = this.make.tilemap({
      key: PORTAL_NAME,
    });
    super.create();

    // Basic config
    this.velocity = 0;
    this.physics.world.drawDebug = true;
    this.initializeControls();
    this.initializeRetryEvent();
    this.initializeStartEvent();

    // Game config
    this.physics.world.gravity.y = GRAVITY;
    this.leftWall = this.colliders?.children.entries[0];
    this.rightWall = this.colliders?.children.entries[1];
    this.ground = this.colliders?.children.entries[2];
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  private get isGamePlaying() {
    return this.portalService?.state.matches("playing") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  update() {
    if (!this.currentPlayer) return;

    const lives = this.portalService?.state.context.lives;

    if (lives === 0) {
      this.currentPlayer.death();
      this.velocity = 0;
      this.time.delayedCall(1000, () => {
        this.portalService?.send({ type: "GAME_OVER" });
      });
    } else if (this.isGamePlaying) {
      // The game has started
      this.playAnimation();
    } else if (this.isGameReady) {
      this.portalService?.send("START");
      this.velocity = WALKING_SPEED;
    }

    super.update();
  }

  private initializeControls() {
    if (isTouchDevice()) {
      this.portalService?.send("SET_JOYSTICK_ACTIVE", {
        isJoystickActive: true,
      });
    }
  }

  private initializeRetryEvent() {
    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.isCameraFading = true;
        this.cameras.main.fadeOut(500);
        this.reset();
        this.cameras.main.on(
          "camerafadeoutcomplete",
          () => {
            this.cameras.main.fadeIn(500);
            this.velocity = WALKING_SPEED;
            this.isCameraFading = false;
          },
          this,
        );
      }
    };
    this.portalService?.onEvent(onRetry);
  }

  private reset() {
    this.currentPlayer?.setPosition(
      SPAWNS()[this.sceneId].default.x,
      SPAWNS()[this.sceneId].default.y,
    );
    this.enemySpawnInterval.remove();
  }

  private initializeStartEvent() {
    let time = 0;
    const onStart = (event: EventObject) => {
      if (event.type === "START") {
        time = time + 1;
        this.enemySpawnInterval = this.time.addEvent({
          delay: ENEMY_SPAWN_INTERVAL,
          callback: () => this.createEnemy(),
          callbackScope: this,
          loop: true,
        });
      }
    };
    this.portalService?.onEvent(onStart);
  }

  private createEnemy() {
    const enemies = {
      snake: () => this.createSnake(),
      specialSnake: () => this.createSpecialSnake(),
      hawk: () => this.createHawk(),
      specialHawk: () => this.createSpecialHawk(),
    };
    const enemyNames = Object.keys(enemies) as Array<keyof typeof enemies>;
    const ranNum = Math.floor(Math.random() * enemyNames.length);
    // enemies[enemyNames[ranNum]]();
    this.createSnake();
  }

  private createSnake() {
    const startingPoint = [
      SNAKE_CONFIGURATION.normalSnake.RtoL.x,
      SNAKE_CONFIGURATION.normalSnake.LtoR.x,
    ];
    const ranNum = Math.floor(Math.random() * startingPoint.length);

    this.normalSnake = new NormalSnake({
      x: startingPoint[ranNum],
      y: Y_AXIS,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createSpecialSnake() {
    console.log("createSpecialSnake");
  }

  private createHawk() {
    console.log("createHawk");
  }

  private createSpecialHawk() {
    console.log("createSpecialHawk");
  }

  private playAnimation() {
    if (!this.currentPlayer) return;
    if (this.currentPlayer.isHurt) return;

    if (
      this.currentPlayer.y >= SPAWNS()[this.sceneId].default.y &&
      !this.currentPlayer.isHurt
    ) {
      if (this.isMoving) {
        this.currentPlayer.carry();
      } else {
        this.currentPlayer.carryIdle();
      }
    }

    if (
      this.cursorKeys?.space.isDown &&
      this.currentPlayer.y >= SPAWNS()[this.sceneId].default.y &&
      !this.currentPlayer.isHurt
    ) {
      this.currentPlayer.attack();
      const currentPlayerBody = this.currentPlayer
        .body as Phaser.Physics.Arcade.Body;
      currentPlayerBody.setVelocityY(PLAYER_JUMP_VELOCITY_Y);
    }
  }
}
