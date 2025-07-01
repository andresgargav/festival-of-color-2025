import mapJson from "assets/map/festival_of_colors.json";
import tilesetconfig from "assets/map/festival_of_colors_tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/Machine";
import { EventObject } from "xstate";
import { SPAWNS } from "features/world/lib/spawn";
import { isTouchDevice } from "features/world/lib/device";
import VirtualJoystick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import {
  PORTAL_NAME,
  Y_AXIS,
  WALKING_SPEED,
  GRAVITY,
  ENEMY_SPAWN_INTERVAL,
  BALLOON_SPAWN_INTERVAL,
  BALLOON_SPAWN_LEFT_LIMIT,
  BALLOON_SPAWN_RIGHT_LIMIT,
  GAME_SECONDS,
  ENEMY_SPAWN_REDUCTION_PER_MINUTE,
  MINIMUM_ENEMY_SPAWN_INTERVAL,
  PORTAL_VOLUME,
  STONE_CONFIGURATION,
  IDLE_SPRITE_SCALE,
  SIGNAL_SPRITE_SCALE,
  PRE_ACTION_DELAY,
  PORTAL_BACKGROUND_VOLUME,
  BOUNCING_CONFIGURATION,
  TIME_DEBUFF_VELOCITY,
  PLAYER_PERCENTAGE_DEBUFF_VELOCITY,
  AMOUNT_CYAN_BALLOONS,
  MACHINE_DECO_CONFIG,
  BALLOON_DECO_CONFIG,
  ENEMY_SPAWN_INTERVAL_HARD_MODE,
  PLAYER_PERCENTAGE_DEBUFF_VELOCITY_HARD_MODE,
} from "./Constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { SQUARE_WIDTH } from "features/game/lib/constants";
//Festival-of-color-2025
import { Balloon } from "./containers/Balloon";
import { BounceBros } from "./containers/BounceBros";
import { BlastBros } from "./containers/BlastBros";
import { Dart } from "./containers/Dart";

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
  private balloonSpawnInterval!: Phaser.Time.TimerEvent;
  private balloonCounter = 0;
  private cyanBalloonInitCount = -1000;
  private leftButton!: Phaser.GameObjects.Image;
  private rightButton!: Phaser.GameObjects.Image;
  private timeRedBalloonDebuff!: Phaser.Time.TimerEvent | null;
  private hasShownHardModeTitle = false;

  ground!: Phaser.GameObjects.GameObject | undefined;
  leftWall!: Phaser.GameObjects.GameObject | undefined;
  rightWall!: Phaser.GameObjects.GameObject | undefined;
  deflator!: Phaser.GameObjects.GameObject | undefined;
  topWall!: Phaser.GameObjects.Zone;

  // Balloons
  balloons!: Phaser.GameObjects.Group;

  // Darts
  darts!: Phaser.GameObjects.Group;

  // Festival-of-color-2025 Enemies
  bounceBro!: BounceBros;
  bounceBrosGroup!: Phaser.GameObjects.Group;
  blastBros!: BlastBros;
  blastBrosGroup!: Phaser.GameObjects.Group;
  // Idle Sprite
  blastBro1!: Phaser.GameObjects.Sprite;
  blastBro2!: Phaser.GameObjects.Sprite;
  blastBro1Blue!: Phaser.GameObjects.Sprite;
  blastBro2Red!: Phaser.GameObjects.Sprite;
  bounceBro1!: Phaser.GameObjects.Sprite;
  bounceBro2!: Phaser.GameObjects.Sprite;
  greenSlime1!: Phaser.GameObjects.Sprite;
  greenSlime2!: Phaser.GameObjects.Sprite;

  public randomIndex!: number;

  // Times
  currentEnemySpawnInterval = ENEMY_SPAWN_INTERVAL;

  sceneId: SceneId = PORTAL_NAME;

  constructor() {
    super({
      name: PORTAL_NAME,
      map: {
        json: mapJson,
        imageKey: "festival-of-colors-tileset",
        defaultTilesetConfig: tilesetconfig,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Balloons
    const balloons = ["blue", "green", "yellow", "red", "cyan"];
    balloons.forEach((color) => {
      this.load.spritesheet(
        `flying_balloon_${color}`,
        `world/flying-balloon-${color}.png`,
        {
          frameWidth: 14,
          frameHeight: 25,
        },
      );
      this.load.spritesheet(
        `deflating_balloon_${color}`,
        `world/deflating-balloon-${color}.png`,
        {
          frameWidth: 14,
          frameHeight: 24,
        },
      );
      this.load.spritesheet(
        `explosive_balloon_${color}`,
        `world/explosive-balloon-${color}.png`,
        {
          frameWidth: 27,
          frameHeight: 25,
        },
      );
    });

    // Dart
    this.load.image("dart", "world/dart.png");

    // Launcher
    this.load.spritesheet("launcher_idle", "world/launcher-idle.png", {
      frameWidth: 21,
      frameHeight: 29,
    });
    this.load.spritesheet("launcher_shoot", "world/launcher-shoot.png", {
      frameWidth: 21,
      frameHeight: 29,
    });

    // Heart
    this.load.image("heart", SUNNYSIDE.icons.heart);

    // Enemies
    this.load.spritesheet("stone", "world/slime_grey_ball.webp", {
      frameWidth: 10,
      frameHeight: 10,
    });

    this.load.spritesheet("breaking_ball", "world/grey_ball_break.webp", {
      frameWidth: 10,
      frameHeight: 10,
    });

    this.load.spritesheet(
      "airballoon_slime_blue",
      "world/airballoon_slime_blue.png",
      {
        frameWidth: 19,
        frameHeight: 36,
      },
    );

    this.load.spritesheet(
      "airballoon_slime_red",
      "world/airballoon_slime_red.webp",
      {
        frameWidth: 19,
        frameHeight: 36,
      },
    );

    this.load.spritesheet("airballoon_slime", "world/airballoon_slime.webp", {
      frameWidth: 19,
      frameHeight: 36,
    });

    this.load.spritesheet(
      "shooting_slime",
      "world/airballoon_slime_shooting.webp",
      {
        frameWidth: 19,
        frameHeight: 36,
      },
    );

    this.load.spritesheet("ground_slime", "world/ground_slime_idle.webp", {
      frameWidth: 19,
      frameHeight: 20,
    });

    this.load.spritesheet(
      "ground_slime_shooting",
      "world/ground_slime_shooting.webp",
      {
        frameWidth: 19,
        frameHeight: 20,
      },
    );

    this.load.spritesheet(
      "ground_slime_green",
      "world/ground_slime_green.webp",
      {
        frameWidth: 19,
        frameHeight: 20,
      },
    );

    // Mobile buttons
    this.load.image("left_button", "world/left_button.png");
    this.load.image("left_button_pressed", "world/left_button_pressed.png");
    this.load.image("red_button", "world/red_button.png");
    this.load.image("red_button_pressed", "world/red_button_pressed.png");

    // Decorations
    this.load.image("river", "world/river.png");
    this.load.spritesheet("balloon_machine", "world/balloonMachine.png", {
      frameWidth: 52,
      frameHeight: 55,
    });

    const machineBalloons = ["red", "blue", "green", "yellow"];
    machineBalloons.forEach((colors) => {
      this.load.spritesheet(
        `machine_balloon_${colors}`,
        `world/machine_balloon_${colors}.png`,
        {
          frameWidth: 16,
          frameHeight: 25,
        },
      );
    });

    // Slime and sotne sound effects
    this.load.audio(
      "ground_slime_shoot",
      "world/Festival-of-color-sound-effects/ground_slime_shoot_1.wav",
    );
    this.load.audio(
      "slime_whoosh",
      "world/Festival-of-color-sound-effects/slime_whoosh.wav",
    );
    this.load.audio(
      "airballoon_slime_shoot",
      "world/Festival-of-color-sound-effects/airballoon_slime_shoot.wav",
    );
    this.load.audio(
      "stone_crack",
      "world/Festival-of-color-sound-effects/stone_crack.wav",
    );
    this.load.audio(
      "stone_bouncing",
      "world/Festival-of-color-sound-effects/stone_bounce.wav",
    );

    // Player sounds
    this.load.audio("sword", "world/sound-effects/sword.mp3");
    this.load.audio("lose_life", "world/sound-effects/lose_life.mp3");
    this.load.audio("ambience", "world/sound-effects/ambience.mp3");
    this.load.audio("shoot", "world/Festival-of-color-sound-effects/shoot.wav");

    // Balloons sound effects
    this.load.audio(
      "new_balloon",
      "world/Festival-of-color-sound-effects/new_balloon.wav",
    );
    this.load.audio(
      "burst_balloon",
      "world/Festival-of-color-sound-effects/burst_balloon.wav",
    );
    this.load.audio(
      "deflating_balloon",
      "world/Festival-of-color-sound-effects/deflating_balloon.mp3",
    );
    this.load.audio(
      "debuff_velocity",
      "world/Festival-of-color-sound-effects/debuff.wav",
    );
    this.load.audio(
      "earn_life",
      "world/Festival-of-color-sound-effects/earn_life.mp3",
    );
    this.load.audio(
      "enable_special_balloons",
      "world/Festival-of-color-sound-effects/plus3.wav",
    );
    this.load.audio(
      "earn_point",
      "world/Festival-of-color-sound-effects/plus1.wav",
    );
    this.load.audio(
      "earn_super_point",
      "world/Festival-of-color-sound-effects/plus2.wav",
    );
    this.load.audio(
      "minus_point",
      "world/Festival-of-color-sound-effects/minus1.wav",
    );

    // Target reached sound
    this.load.audio(
      "target_reached",
      "world/Festival-of-color-sound-effects/target_reached.mp3",
    );

    // Background music
    this.load.audio(
      "background_music",
      "world/Festival-of-color-sound-effects/country_fair.mp3",
    );
  }

  async create() {
    this.map = this.make.tilemap({
      key: PORTAL_NAME,
    });
    super.create();

    // Basic config
    this.velocity = 0;
    this.balloons = this.add.group();
    this.darts = this.add.group();
    this.bounceBrosGroup = this.add.group();
    this.blastBrosGroup = this.add.group();
    this.physics.world.drawDebug = false;
    this.initializeControls();
    this.initializeRetryEvent();
    this.initializeStartEvent();
    this.initializeGameOverEvent();
    this.initializeFontFamily();

    // Game config
    this.currentPlayer?.createLauncher();
    this.input.addPointer(3);
    this.physics.world.gravity.y = GRAVITY;
    this.createInvisibleWalls();

    // Festival of color 2025 idle
    this.festivalOfColorIdle();

    this.sound.play("background_music", {
      volume: PORTAL_BACKGROUND_VOLUME,
      loop: true,
    });
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

    if (this.isGameReady) {
      this.portalService?.send("START");
      this.velocity = WALKING_SPEED;
    } else if (this.isGamePlaying) {
      // The game has started
      this.playAnimation();
      if (this.isHardMode && !this.hasShownHardModeTitle) {
        this.showHardModeTitle();
        this.hasShownHardModeTitle = true;
      }
    }

    // Controls
    this.setControls();

    super.update();
  }

  private initializeControls() {
    if (isTouchDevice()) {
      const buttonY = this.map.height * SQUARE_WIDTH - 3.5 * SQUARE_WIDTH;
      const leftButtonX =
        (this.map.width * SQUARE_WIDTH) / 2 -
        window.innerWidth / (2 * this.zoom) +
        15 +
        SQUARE_WIDTH;

      this.leftButton = this.add
        .image(leftButtonX, buttonY, "left_button")
        .setAlpha(0.8)
        .setInteractive()
        .setDepth(1000)
        .setVisible(false)
        .on("pointerdown", () => {
          this.mobileKeys.left = true;
          this.leftButton.setTexture("left_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.left = false;
          this.leftButton.setTexture("left_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.left = false;
          this.leftButton.setTexture("left_button");
        });

      this.rightButton = this.add
        .image(leftButtonX + this.leftButton.width + 5, buttonY, "left_button")
        .setAlpha(0.8)
        .setInteractive()
        .setDepth(1000)
        .setVisible(false)
        .on("pointerdown", () => {
          this.mobileKeys.right = true;
          this.rightButton.setTexture("left_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.right = false;
          this.rightButton.setTexture("left_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.right = false;
          this.rightButton.setTexture("left_button");
        });

      this.rightButton.flipX = true;

      // Shoot
      const jumpButton = this.add
        .image(leftButtonX, buttonY, "red_button")
        .setInteractive()
        .setDepth(1000)
        .on("pointerdown", () => {
          this.mobileKeys.space = true;
          jumpButton.setTexture("red_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.space = false;
          jumpButton.setTexture("red_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.space = false;
          jumpButton.setTexture("red_button");
        });

      jumpButton.setPosition(
        (this.map.width * SQUARE_WIDTH) / 2 +
          window.innerWidth / (2 * this.zoom) +
          6 -
          SQUARE_WIDTH -
          jumpButton.width,
        buttonY,
      );

      // Joystick
      this.joystick = new VirtualJoystick(this, {
        x:
          (this.map.width * this.zoom * SQUARE_WIDTH) / 2 -
          window.innerWidth / (2 * this.zoom) +
          +15 +
          2.5 * SQUARE_WIDTH,
        y: (this.map.height * this.zoom * SQUARE_WIDTH) / 2 + 180,
        radius: 15,
        base: this.add.circle(0, 0, 27, 0x000000, 0.5).setDepth(1000000000),
        thumb: this.add.circle(0, 0, 12, 0xffffff, 0.5).setDepth(1000000000),
        forceMin: 2,
      }).setVisible(false);

      this.leftButton.setDepth(1000000000000);
      this.rightButton.setDepth(1000000000000);
      jumpButton.setDepth(1000000000000);

      this.portalService?.send("SET_JOYSTICK_ACTIVE", {
        isJoystickActive: true,
      });
    }
  }

  private initializeRetryEvent() {
    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "CONTINUE_TRAINING") {
        this.reset();
      }
    };
    this.portalService?.onEvent(onRetry);
  }

  private initializeGameOverEvent() {
    const onGameOver = (event: EventObject) => {
      if (event.type === "GAME_OVER") {
        this.gameOver();
      }
    };
    this.portalService?.onEvent(onGameOver);
  }

  private initializeStartEvent() {
    const onStart = (event: EventObject) => {
      if (event.type === "START") {
        this.reset();
        this.balloonSpawnInterval = this.time.addEvent({
          delay: BALLOON_SPAWN_INTERVAL,
          callback: () => this.createBalloon(),
          callbackScope: this,
          repeat: -1,
        });
        this.enemySpawnInterval = this.time.addEvent({
          delay: this.currentEnemySpawnInterval,
          callback: () => this.createEnemy(),
          callbackScope: this,
          repeat: -1,
        });
      }
    };
    this.portalService?.onEvent(onStart);
  }

  private initializeFontFamily() {
    this.add
      .text(0, 0, ".", {
        fontFamily: "Teeny",
        fontSize: "1px",
        color: "#000000",
      })
      .setAlpha(0);
  }

  private gameOver() {
    if (!this.currentPlayer) return;
    this.balloonSpawnInterval.remove();
    this.enemySpawnInterval.remove();
    this.balloons.clear(true, true);
    this.darts.clear(true, true);
    this.bounceBrosGroup.clear(true, true);
    this.blastBrosGroup.clear(true, true);
    this.velocity = 0;
  }

  private setControls() {
    const joystickEnabled = this.portalService?.state.context.isJoystickEnabled;
    if (joystickEnabled) {
      this.joystick?.setVisible(true);
      this.leftButton?.setVisible(false);
      this.rightButton?.setVisible(false);
    } else {
      this.joystick?.setVisible(false);
      this.leftButton?.setVisible(true);
      this.rightButton?.setVisible(true);
    }
  }

  private reset() {
    this.currentPlayer?.setPosition(
      SPAWNS()[this.sceneId].default.x,
      SPAWNS()[this.sceneId].default.y,
    );
    this.enemySpawnInterval?.remove();
    this.balloonSpawnInterval?.remove();
    this.balloonCounter = 0;
    this.cyanBalloonInitCount = -1000;
    this.timeRedBalloonDebuff = null;
    this.hasShownHardModeTitle = false;
    this.sound.setRate(1);
    this.currentPlayer?.setIsShooting(false);
    this.currentPlayer?.setIsHurt(false);
    this.currentEnemySpawnInterval = ENEMY_SPAWN_INTERVAL;
  }

  private createInvisibleWalls() {
    this.ground = this.colliders?.children.entries[0];
    this.leftWall = this.colliders?.children.entries[1];
    this.rightWall = this.colliders?.children.entries[2];
    this.deflator = this.colliders?.children.entries[3];
    this.topWall = this.add.zone(0, 0, this.map.widthInPixels * 2, 30);
    this.physics.world.enable(this.topWall);
    (this.topWall.body as Phaser.Physics.Arcade.Body)?.setAllowGravity(false);
  }

  private playAnimation() {
    if (!this.currentPlayer) return;
    if (this.currentPlayer.isHurt) return;

    // Move
    if (this.isMoving) {
      this.currentPlayer.carry();
    } else {
      this.currentPlayer.carryIdle();
    }

    // Throw dart
    if (
      (this.cursorKeys?.space.isDown || this.mobileKeys.space) &&
      !this.currentPlayer.isShooting
    ) {
      this.shootDart();
    }
  }

  private shootDart() {
    if (!this.currentPlayer) return;

    this.currentPlayer.shootLauncher();
    const offset = 0.8;
    const offsetX =
      this.currentPlayer.directionFacing === "right" ? offset : -offset;

    const dart = new Dart({
      x: this.currentPlayer.x + offsetX,
      y: this.currentPlayer.y - 10,
      scene: this,
    });

    this.darts.add(dart);
  }

  private showHardModeTitle() {
    this.sound.setRate(1.5);
    const hardModeTitle = this.add
      .text(
        (this.map.width * SQUARE_WIDTH) / 2,
        (this.map.height * SQUARE_WIDTH) / 2 + 20,
        "Hard Mode",
        {
          // fontSize: "15px",
          fontFamily: "Teeny",
          color: "#FFFFFF",
          resolution: 10,
          padding: { x: 2, y: 2 },
        },
      )
      .setFontSize(0)
      .setOrigin(0.5);

    hardModeTitle.setShadow(4, 4, "#161424", 0, true, true);

    const fadeDestroy = () => {
      this.tweens?.add({
        targets: hardModeTitle,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          hardModeTitle.destroy();
        },
      });
    };

    this.tweens.addCounter({
      from: 0,
      to: 15,
      duration: 1000,
      onUpdate: (tween) => {
        const value = tween.getValue();
        hardModeTitle.setFontSize(value);
      },
      onComplete: () => {
        this.time.delayedCall(2000, () => fadeDestroy());
      },
    });
  }

  private createBalloon() {
    this.balloonCounter += 1;
    const minX = BALLOON_SPAWN_LEFT_LIMIT;
    const maxX = BALLOON_SPAWN_RIGHT_LIMIT;
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

    if (
      this.balloonCounter - this.cyanBalloonInitCount <=
      AMOUNT_CYAN_BALLOONS
    ) {
      this.createCyanBalloon(randomX);
    } else if (this.balloonCounter >= 25 && this.balloonCounter % 20 === 5) {
      this.createGreenBalloon(randomX);
    } else if ((this.balloonCounter - 10) % 20 === 0) {
      this.createYellowBalloon(randomX);
    } else if (
      this.balloonCounter % 20 === 0 ||
      (this.isHardMode && (this.balloonCounter - 13) % 20 === 0) ||
      (this.isHardMode && (this.balloonCounter - 9) % 20 === 0)
    ) {
      this.createRedBalloon(randomX);
    } else {
      this.createBlueBalloon(randomX);
    }
  }

  private createBlueBalloon(x: number) {
    const balloon = new Balloon({
      x: x,
      y: -1,
      scene: this,
      spriteName: "balloon_blue",
      onPop: (balloon?: Balloon) => {
        this.portalService?.send("GAIN_POINTS", {
          points: 1,
        });
        balloon?.addLabel(1);
        this.sound.play("earn_point", { volume: PORTAL_VOLUME });
      },
      onDebuff: () => this.loseLife(),
    });
    this.balloons.add(balloon);
  }

  private createRedBalloon(x: number) {
    const balloon = new Balloon({
      x: x,
      y: -1,
      scene: this,
      spriteName: "balloon_red",
      onPop: (balloon?: Balloon) => {
        this.sound.play("minus_point", { volume: PORTAL_VOLUME });
        this.portalService?.send("GAIN_POINTS", {
          points: -1,
        });
        balloon?.addLabel(-1, "#F5B7BA");
      },
      onDebuff: () => {
        if (this.timeRedBalloonDebuff) {
          this.timeRedBalloonDebuff.remove(false);
          this.timeRedBalloonDebuff = null;
        }
        const percentageDebuff = this.isHardMode
          ? PLAYER_PERCENTAGE_DEBUFF_VELOCITY_HARD_MODE
          : PLAYER_PERCENTAGE_DEBUFF_VELOCITY;
        this.velocity = WALKING_SPEED * (1 + percentageDebuff);
        this.timeRedBalloonDebuff = this.time.delayedCall(
          TIME_DEBUFF_VELOCITY,
          () => {
            this.velocity = WALKING_SPEED;
          },
        );
        this.sound.play("debuff_velocity", { volume: PORTAL_VOLUME });
      },
    });
    this.balloons.add(balloon);
  }

  private createYellowBalloon(x: number) {
    const balloon = new Balloon({
      x: x,
      y: -1,
      scene: this,
      spriteName: "balloon_yellow",
      onPop: (balloon?: Balloon) => {
        this.portalService?.send("GAIN_POINTS", {
          points: 3,
        });
        balloon?.addLabel(3, "#FDF787");
        this.cyanBalloonInitCount = this.balloonCounter;
        this.sound.play("enable_special_balloons", { volume: PORTAL_VOLUME });
      },
      onDebuff: () => this.loseLife(),
    });
    this.balloons.add(balloon);
  }

  private createGreenBalloon(x: number) {
    const balloon = new Balloon({
      x: x,
      y: -1,
      scene: this,
      spriteName: "balloon_green",
      onPop: (balloon?: Balloon) => {
        this.portalService?.send("GAIN_LIFE");
        balloon?.addLabel(1, "", "heart");
        this.sound.play("earn_life", { volume: PORTAL_VOLUME });
      },
      onDebuff: () => this.loseLife(),
    });
    this.balloons.add(balloon);
  }

  private createCyanBalloon(x: number) {
    const balloon = new Balloon({
      x: x,
      y: -1,
      scene: this,
      spriteName: "balloon_cyan",
      onPop: (balloon?: Balloon) => {
        this.portalService?.send("GAIN_POINTS", {
          points: 2,
        });
        balloon?.addLabel(2, "#ADFFFF");
        this.sound.play("earn_super_point", { volume: PORTAL_VOLUME });
      },
      onDebuff: () => this.loseLife(),
    });
    this.balloons.add(balloon);
  }

  private loseLife() {
    if (!this.portalService) return;
    const loseLives = this.isHardMode ? 2 : 1;
    this.portalService?.send("LOSE_LIFE", { lives: loseLives });
    this.currentPlayer?.hurt();
    if (this.portalService.state.context.lives <= 0) {
      this.portalService.send({ type: "GAME_OVER" });
    }
  }

  private updateEnemySpawnInterval() {
    const minutesElapsed = Math.floor(this.secondsElapsed / 60);
    let newEnemySpawnInterval = Math.max(
      ENEMY_SPAWN_INTERVAL - minutesElapsed * ENEMY_SPAWN_REDUCTION_PER_MINUTE,
      MINIMUM_ENEMY_SPAWN_INTERVAL,
    );
    if (this.isHardMode) {
      newEnemySpawnInterval = ENEMY_SPAWN_INTERVAL_HARD_MODE;
    }
    if (this.currentEnemySpawnInterval !== newEnemySpawnInterval) {
      this.currentEnemySpawnInterval = newEnemySpawnInterval;
      this.enemySpawnInterval.remove();
      this.enemySpawnInterval = this.time.addEvent({
        delay: this.currentEnemySpawnInterval,
        callback: () => this.createEnemy(),
        callbackScope: this,
        repeat: -1,
      });
    }
  }

  private createEnemy() {
    this.updateEnemySpawnInterval();

    const enemies = {
      blastBros: () => this.createBlastBros(),
      bounceBros: () => this.createBounceBros(),
    };
    const enemyNames = Object.keys(enemies) as Array<keyof typeof enemies>;
    const ranNum = Math.floor(Math.random() * enemyNames.length);
    enemies[enemyNames[ranNum]]();
  }

  private createBounceBros() {
    const startingPoint = [STONE_CONFIGURATION.RtoL, STONE_CONFIGURATION.LtoR];
    const bounceBallConfig = [
      BOUNCING_CONFIGURATION.config_1,
      BOUNCING_CONFIGURATION.config_2,
    ];

    this.randomIndex = Math.floor(Math.random() * startingPoint.length);
    const randomSpawn = startingPoint[this.randomIndex];
    const randomConfig = bounceBallConfig[this.randomIndex];
    const finalX = this.randomIndex == 0;

    !finalX
      ? this.greenSlime1.setVisible(true)
      : this.greenSlime2.setVisible(true);

    this.time.delayedCall(PRE_ACTION_DELAY, () => {
      this.greenSlime1.setVisible(false);
      this.greenSlime2.setVisible(false);
    });

    this.time.delayedCall(PRE_ACTION_DELAY, () => {
      finalX
        ? this.bounceBro2.setVisible(false)
        : this.bounceBro1.setVisible(false);

      this.bounceBro = new BounceBros({
        x: randomSpawn,
        y: Y_AXIS - 10,
        scene: this,
        player: this.currentPlayer,
      });
      this.bounceBrosGroup.add(this.bounceBro);
    });

    this.time.delayedCall(1000 + PRE_ACTION_DELAY, () => {
      this.bounceBro1.setVisible(true);
      this.bounceBro2.setVisible(true);

      this.time.delayedCall(randomConfig.despawnIdle + PRE_ACTION_DELAY, () => {
        finalX
          ? this.bounceBro1.setVisible(false)
          : this.bounceBro2.setVisible(false);
      });

      this.time.delayedCall(randomConfig.respawnIdle + PRE_ACTION_DELAY, () => {
        this.bounceBro1.setVisible(true);
        this.bounceBro2.setVisible(true);
      });
    });
  }

  private createBlastBros() {
    const startingPoint = [STONE_CONFIGURATION.RtoL, STONE_CONFIGURATION.LtoR];
    this.randomIndex = Math.floor(Math.random() * startingPoint.length);
    const randomSpawn = startingPoint[this.randomIndex];
    const finalX = this.randomIndex == 0;

    !finalX
      ? this.blastBro1Blue.setVisible(true)
      : this.blastBro2Red.setVisible(true);

    this.time.delayedCall(PRE_ACTION_DELAY, () => {
      this.blastBro1Blue.setVisible(false);
      this.blastBro2Red.setVisible(false);
    });

    this.time.delayedCall(PRE_ACTION_DELAY, () => {
      finalX
        ? this.blastBro2.setVisible(false)
        : this.blastBro1.setVisible(false);

      this.blastBros = new BlastBros({
        x: randomSpawn,
        y: Y_AXIS - 220,
        scene: this,
        player: this.currentPlayer,
      });
      this.blastBrosGroup.add(this.blastBros);
    });

    this.time.delayedCall(1000 + PRE_ACTION_DELAY, () => {
      this.blastBro1.setVisible(true);
      this.blastBro2.setVisible(true);
    });
  }

  private get secondsLeft() {
    const endAt = this.portalService?.state.context.endAt;
    const secondsLeft = !endAt
      ? GAME_SECONDS
      : Math.max(endAt - Date.now(), 0) / 1000;
    return secondsLeft;
  }

  private get secondsElapsed() {
    return GAME_SECONDS - this.secondsLeft;
  }

  public get isHardMode() {
    const dateKey = new Date().toISOString().slice(0, 10);
    const initialDateHardMode = "2025-07-02";
    return (
      dateKey >= initialDateHardMode &&
      this.secondsLeft >= 0 &&
      this.secondsLeft <= 30
    );
  }

  // Festival-of-color-2025 Idle
  private festivalOfColorIdle() {
    const riverName = "river";
    const blastBrosName = "airballoon_slime";
    const bounceBrosName = "ground_slime";
    const airballoon_blue = "airballoon_slime_blue";
    const airballoon_red = "airballoon_slime_red";
    const slime_green = "ground_slime_green";
    const balloonNames = {
      red: "machine_balloon_red",
      blue: "machine_balloon_blue",
      green: "machine_balloon_green",
      yellow: "machine_balloon_yellow",
    };

    type MachineConfigKey = keyof typeof MACHINE_DECO_CONFIG;
    // Define keys used
    const configKeys: MachineConfigKey[] = [
      "config1",
      "config2",
      "config3",
      "config4",
    ];

    // Map each machine config to a specific balloon color
    const machineBalloonColors: Record<
      MachineConfigKey,
      "red" | "blue" | "green" | "yellow"
    > = {
      config1: "red",
      config2: "blue",
      config3: "green",
      config4: "yellow",
    };

    configKeys.forEach((key) => {
      const machineConfig = MACHINE_DECO_CONFIG[key];

      // Add the base machine sprite
      const balloon_machine_name = "balloon_machine";
      const balloon_machine = this.add
        .sprite(machineConfig.x, machineConfig.y, balloon_machine_name)
        .setOrigin(0)
        .setDepth(100000000);

      this.createAnimation(balloon_machine, balloon_machine_name, 0, 8);

      // Get the balloon color for this machine
      const balloonColor = machineBalloonColors[key];
      const balloonName = balloonNames[balloonColor];

      const balloonConfig = {
        x: machineConfig.x + BALLOON_DECO_CONFIG.x,
        y: machineConfig.y + BALLOON_DECO_CONFIG.y,
      };

      const balloonSprite = this.add
        .sprite(balloonConfig.x, balloonConfig.y, balloonName)
        .setOrigin(0)
        .setDepth(1000000000)
        .setScale(0.8);

      this.createAnimation(balloonSprite, balloonName, 0, 17);
    });

    // Sprite
    this.add.sprite(1, 1, riverName).setOrigin(0).setDepth(1000);
    this.blastBro1 = this.add
      .sprite(STONE_CONFIGURATION.LtoR, Y_AXIS - 230, blastBrosName)
      .setDepth(1000000000)
      .setScale(IDLE_SPRITE_SCALE);
    this.blastBro2 = this.add
      .sprite(STONE_CONFIGURATION.RtoL, Y_AXIS - 230, blastBrosName)
      .setDepth(1000000000)
      .setFlipX(true)
      .setScale(IDLE_SPRITE_SCALE);
    this.bounceBro1 = this.add
      .sprite(STONE_CONFIGURATION.LtoR, Y_AXIS + 5, bounceBrosName)
      .setDepth(10000000)
      .setScale(IDLE_SPRITE_SCALE);
    this.bounceBro2 = this.add
      .sprite(STONE_CONFIGURATION.RtoL, Y_AXIS + 5, bounceBrosName)
      .setDepth(10000000)
      .setFlipX(true)
      .setScale(IDLE_SPRITE_SCALE);

    // Colored signal sprite
    this.blastBro1Blue = this.add
      .sprite(STONE_CONFIGURATION.LtoR, Y_AXIS - 230, airballoon_blue)
      .setDepth(1000000000)
      .setScale(SIGNAL_SPRITE_SCALE)
      .setVisible(false);
    this.blastBro2Red = this.add
      .sprite(STONE_CONFIGURATION.RtoL, Y_AXIS - 230, airballoon_red)
      .setDepth(1000000000)
      .setScale(SIGNAL_SPRITE_SCALE)
      .setVisible(false);
    this.greenSlime1 = this.add
      .sprite(STONE_CONFIGURATION.LtoR, Y_AXIS + 5, slime_green)
      .setDepth(10000000)
      .setScale(SIGNAL_SPRITE_SCALE)
      .setVisible(false);
    this.greenSlime2 = this.add
      .sprite(STONE_CONFIGURATION.RtoL, Y_AXIS + 5, slime_green)
      .setDepth(10000000)
      .setScale(SIGNAL_SPRITE_SCALE)
      .setVisible(false);

    // Idle animation
    this.createAnimation(this.blastBro1, blastBrosName, 0, 8);
    this.createAnimation(this.blastBro2, blastBrosName, 0, 8);
    this.createAnimation(this.bounceBro1, bounceBrosName, 0, 8);
    this.createAnimation(this.bounceBro2, bounceBrosName, 0, 8);
    this.createAnimation(this.blastBro1Blue, airballoon_blue, 0, 8);
    this.createAnimation(this.blastBro2Red, airballoon_red, 0, 8);
    this.createAnimation(this.greenSlime1, slime_green, 0, 8);
    this.createAnimation(this.greenSlime2, slime_green, 0, 8);
  }

  private createAnimation(
    sprite: Phaser.GameObjects.Sprite,
    spriteName: string,
    start: number,
    end: number,
  ) {
    this.anims.create({
      key: `${spriteName}_anim`,
      frames: this.anims.generateFrameNumbers(spriteName, {
        start,
        end,
      }),
      frameRate: 10,
      repeat: -1,
    });
    sprite.play(`${spriteName}_anim`, true);
  }
}
