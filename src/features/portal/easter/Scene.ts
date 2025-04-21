import mapJson from "assets/map/easter.json";
import tilesetconfig from "assets/map/easter_tileset.json";
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
  EGG_SPAWN_INTERVAL,
  EGG_SPAWN_LEFT_LIMIT,
  EGG_SPAWN_RIGHT_LIMIT,
  HAWK_CONFIGURATION,
  SPECIALHAWK_Y,
  GAME_SECONDS,
  ENEMY_SPAWN_REDUCTION_PER_MINUTE,
  MINIMUM_ENEMY_SPAWN_INTERVAL,
  PORTAL_VOLUME,
} from "./Constants";
import { NormalSnake } from "./containers/NormalSnake";
import { NormalHawk } from "./containers/NormalHawk";
import { SpecialSnake } from "./containers/SpecialSnake";
import { SpecialHawk } from "./containers/SpecialHawk";
import { EasterEgg } from "./containers/EasterEgg";
import { BadEgg } from "./containers/BadEgg";
import { GoldenEgg } from "./containers/GoldenEgg";
import { SuperEasterEgg } from "./containers/SuperEasterEgg";
import { SUNNYSIDE } from "assets/sunnyside";
import { SQUARE_WIDTH } from "features/game/lib/constants";

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
  private eggSpawnInterval!: Phaser.Time.TimerEvent;
  private eggCounter = 0;
  private superEggInitCount = -1000;

  ground!: Phaser.GameObjects.GameObject | undefined;
  leftWall!: Phaser.GameObjects.GameObject | undefined;
  rightWall!: Phaser.GameObjects.GameObject | undefined;

  // Eggs
  easterEgg!: EasterEgg;
  badEgg!: BadEgg;
  goldenEgg!: GoldenEgg;
  superEasterEgg!: SuperEasterEgg;

  // Enemies
  normalSnake!: NormalSnake;
  normalHawk!: NormalHawk;
  specialSnake!: SpecialSnake;
  specialHawk!: SpecialHawk;

  // Times
  currentEnemySpawnInterval = ENEMY_SPAWN_INTERVAL;

  sceneId: SceneId = PORTAL_NAME;

  constructor() {
    super({
      name: PORTAL_NAME,
      map: {
        json: mapJson,
        imageKey: "easter-tileset",
        defaultTilesetConfig: tilesetconfig,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Eggs
    this.load.image("easter_egg", "world/easter_egg.png");
    this.load.spritesheet(
      "easter_egg_disappear",
      "world/easter_egg_disappear.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet("easter_egg_break", "world/easter_egg_break.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("super_easter_egg", "world/super_easter_egg.png");
    this.load.spritesheet(
      "super_easter_egg_disappear",
      "world/super_easter_egg_disappear.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "super_easter_egg_break",
      "world/super_easter_egg_break.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.image("golden_egg", "world/golden_egg.png");
    this.load.spritesheet(
      "golden_egg_disappear",
      "world/golden_egg_disappear.png",
      {
        frameWidth: 20,
        frameHeight: 16,
      },
    );
    this.load.spritesheet("golden_egg_break", "world/golden_egg_break.png", {
      frameWidth: 20,
      frameHeight: 16,
    });

    this.load.image("bad_egg", "world/bad_egg.png");
    this.load.spritesheet("bad_egg_disappear", "world/bad_egg_disappear.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bad_egg_break", "world/bad_egg_break.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("fried_egg_1", "world/fried_egg_1.png");
    this.load.spritesheet(
      "fried_egg_1_disappear",
      "world/fried_egg_1_disappear.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.image("fried_egg_2", "world/fried_egg_2.png");
    this.load.spritesheet(
      "fried_egg_2_disappear",
      "world/fried_egg_2_disappear.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.image("fried_egg_3", "world/fried_egg_3.png");
    this.load.spritesheet(
      "fried_egg_3_disappear",
      "world/fried_egg_3_disappear.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    // Heart
    this.load.image("heart", SUNNYSIDE.icons.heart);

    // Enemies
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

    this.load.spritesheet("hawk_flying", "world/hawk_flying.png", {
      frameWidth: 48,
      frameHeight: 19,
    });

    this.load.spritesheet("hawk_collision", "world/hawk_collision.png", {
      frameWidth: 48,
      frameHeight: 19,
    });
    this.load.spritesheet("snake_special", "world/snake_special.png", {
      frameWidth: 20,
      frameHeight: 19,
    });

    this.load.spritesheet(
      "snake_special_col",
      "world/snake_special_collision.webp",
      {
        frameWidth: 20,
        frameHeight: 19,
      },
    );

    this.load.spritesheet(
      "snake_special_jump",
      "world/snake_special_jump.webp",
      {
        frameWidth: 20,
        frameHeight: 19,
      },
    );

    this.load.spritesheet("hawk_readydive", "world/hawk_readydive.png", {
      frameWidth: 48,
      frameHeight: 22,
    });

    this.load.spritesheet("hawk_dive", "world/hawk_dive.png", {
      frameWidth: 48,
      frameHeight: 35,
    });

    this.load.spritesheet("hawk_attack", "world/hawk_attack.png", {
      frameWidth: 48,
      frameHeight: 21,
    });

    // Mobile buttons
    this.load.image("left_button", "world/left_button.png");
    this.load.image("left_button_pressed", "world/left_button_pressed.png");
    this.load.image("up_button", "world/up_button.png");
    this.load.image("up_button_pressed", "world/up_button_pressed.png");

    // Decorations
    this.load.spritesheet("goblin_farting", "world/goblin_farting.png", {
      frameWidth: 29,
      frameHeight: 22,
    });
    this.load.spritesheet("goblin_snorkling", "world/goblin_snorkling.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet("dragonfly", "world/dragonfly.png", {
      frameWidth: 13,
      frameHeight: 4,
    });
    this.load.spritesheet("snake_jump", "world/snake_jump.png", {
      frameWidth: 20,
      frameHeight: 19,
    });
    this.load.spritesheet(
      "egg_central_island",
      "world/egg_central_island.png",
      {
        frameWidth: 52,
        frameHeight: 64,
      },
    );
    this.load.spritesheet(
      "thematic_decoration",
      "world/thematic_decoration.png",
      {
        frameWidth: 16,
        frameHeight: 32,
      },
    );
    this.load.spritesheet("bunny_shop", "world/bunny_shop.png", {
      frameWidth: 20,
      frameHeight: 24,
    });

    //Egg sounds
    this.load.audio("golden_egg", "world/sound-effects/golden_egg.mp3");
    this.load.audio("normal_egg", "world/sound-effects/normal_egg.mp3");
    this.load.audio("egg_break", "world/sound-effects/egg_break.mp3");
    this.load.audio("egg_crack", "world/sound-effects/egg_crack.mp3");
    this.load.audio("new_egg", "world/sound-effects/new_egg.mp3");
    this.load.audio("fried_egg", "world/sound-effects/fried_egg.mp3");
    //Snake sounds
    this.load.audio("jump_snake", "world/sound-effects/jump_snake.mp3");
    this.load.audio("snake", "world/sound-effects/snake.mp3");
    //Hawk sounds
    this.load.audio("wings_flap", "world/sound-effects/wings_flap.mp3");
    this.load.audio("dive", "world/sound-effects/dive.mp3");
    this.load.audio("fly_away", "world/sound-effects/fly_away.mp3");
    this.load.audio("attack", "world/sound-effects/attack.mp3");
    this.load.audio("hawk_sound", "world/sound-effects/hawk_sound.mp3");
    //Player sounds
    this.load.audio("sword", "world/sound-effects/sword.mp3");
    this.load.audio("lose_life", "world/sound-effects/lose_life.mp3");
    this.load.audio("ambience", "world/sound-effects/ambience.mp3");
  }

  async create() {
    this.map = this.make.tilemap({
      key: PORTAL_NAME,
    });
    super.create();

    // Basic config
    this.velocity = 0;
    this.physics.world.drawDebug = false;
    this.addDecorations();
    this.initializeControls();
    this.initializeRetryEvent();
    this.initializeStartEvent();
    this.initializeEndGameEarlyEvent();
    this.initializeFontFamily();

    // Game config
    this.currentPlayer?.createBasket();
    this.currentPlayer?.createSword();
    this.input.addPointer(3);
    this.physics.world.gravity.y = GRAVITY;
    this.ground = this.colliders?.children.entries[0];
    this.leftWall = this.colliders?.children.entries[1];
    this.rightWall = this.colliders?.children.entries[2];

    this.sound.play("ambience", { volume: PORTAL_VOLUME, loop: true });
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  private get isGamePlaying() {
    return this.portalService?.state.matches("playing") === true;
  }

  private get isGameIntroduction() {
    return this.portalService?.state.matches("introduction") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  update() {
    if (!this.currentPlayer) return;

    const lives = this.portalService?.state.context.lives;

    if (this.isGameReady) {
      this.portalService?.send("START");
      this.velocity = WALKING_SPEED;
    } else if (this.isGameIntroduction) {
      this.velocity = 0;
    } else if (lives === 0) {
      this.gameOverAnimation();
      this.time.delayedCall(1000, () => {
        this.portalService?.send({ type: "GAME_OVER" });
      });
    } else if (this.isGamePlaying) {
      // The game has started
      this.playAnimation();
      this.specialSnake?.update();
    }

    super.update();
  }

  private initializeControls() {
    if (isTouchDevice()) {
      const buttonY = this.map.height * SQUARE_WIDTH - 3.5 * SQUARE_WIDTH;
      const leftButtonX =
        (this.map.width * SQUARE_WIDTH) / 2 -
        window.innerWidth / (2 * this.zoom) +
        6 +
        SQUARE_WIDTH;

      const leftButton = this.add
        .image(leftButtonX, buttonY, "left_button")
        .setAlpha(0.8)
        .setInteractive()
        .setDepth(1000)
        .on("pointerdown", () => {
          this.mobileKeys.left = true;
          leftButton.setTexture("left_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.left = false;
          leftButton.setTexture("left_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.left = false;
          leftButton.setTexture("left_button");
        });

      const rightButton = this.add
        .image(leftButtonX + leftButton.width + 5, buttonY, "left_button")
        .setAlpha(0.8)
        .setInteractive()
        .setDepth(1000)
        .on("pointerdown", () => {
          this.mobileKeys.right = true;
          rightButton.setTexture("left_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.right = false;
          rightButton.setTexture("left_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.right = false;
          rightButton.setTexture("left_button");
        });

      rightButton.flipX = true;

      // Jump
      const jumpButton = this.add
        .image(leftButtonX, buttonY, "up_button")
        .setAlpha(0.8)
        .setInteractive()
        .setDepth(1000)
        .on("pointerdown", () => {
          this.mobileKeys.jump = true;
          jumpButton.setTexture("up_button_pressed");
        })
        .on("pointerup", () => {
          this.mobileKeys.jump = false;
          jumpButton.setTexture("up_button");
        })
        .on("pointerout", () => {
          this.mobileKeys.jump = false;
          jumpButton.setTexture("up_button");
        });

      jumpButton.setPosition(
        (this.map.width * SQUARE_WIDTH) / 2 +
          window.innerWidth / (2 * this.zoom) +
          6 -
          SQUARE_WIDTH -
          jumpButton.width,
        buttonY,
      );

      leftButton.setDepth(1000000000000);
      rightButton.setDepth(1000000000000);
      jumpButton.setDepth(1000000000000);

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

  private initializeEndGameEarlyEvent() {
    const onEndGameEarly = (event: EventObject) => {
      if (event.type === "END_GAME_EARLY") {
        this.gameOverAnimation();
      }
    };
    this.portalService?.onEvent(onEndGameEarly);
  }

  private gameOverAnimation() {
    if (!this.currentPlayer) return;
    this.currentPlayer.death();
    this.eggSpawnInterval.remove();
    this.enemySpawnInterval.remove();
    this.badEgg.destroyAllFriedEggs();
    this.velocity = 0;
  }

  private reset() {
    this.currentPlayer?.setPosition(
      SPAWNS()[this.sceneId].default.x,
      SPAWNS()[this.sceneId].default.y,
    );
    this.enemySpawnInterval.remove();
    this.eggSpawnInterval.remove();
    this.eggCounter = 0;
    this.superEggInitCount = -1000;
    this.currentPlayer?.setIsHurt(false);
    this.currentEnemySpawnInterval = ENEMY_SPAWN_INTERVAL;
  }

  private initializeStartEvent() {
    const onStart = (event: EventObject) => {
      if (event.type === "START") {
        this.eggSpawnInterval = this.time.addEvent({
          delay: EGG_SPAWN_INTERVAL,
          callback: () => this.createEgg(),
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

  private playAnimation() {
    if (!this.currentPlayer) return;
    if (this.currentPlayer.isHurt) return;
    const swordBody = this.currentPlayer.sword
      ?.body as Phaser.Physics.Arcade.Body;

    if (
      this.currentPlayer.y >= SPAWNS()[this.sceneId].default.y &&
      !this.currentPlayer.isHurt
    ) {
      this.currentPlayer.enableBasket(true);
      this.currentPlayer.enableSword(false);
      if (this.isMoving) {
        this.currentPlayer.carry();
      } else {
        this.currentPlayer.carryIdle();
      }
    }

    if (
      (this.cursorKeys?.space.isDown || this.mobileKeys.jump) &&
      this.currentPlayer.y >= SPAWNS()[this.sceneId].default.y &&
      !this.currentPlayer.isHurt
    ) {
      this.currentPlayer.enableBasket(false);
      this.currentPlayer.enableSword(true);
      this.currentPlayer.attack();
      const currentPlayerBody = this.currentPlayer
        .body as Phaser.Physics.Arcade.Body;
      currentPlayerBody.setVelocityY(PLAYER_JUMP_VELOCITY_Y);
    }

    if (swordBody.enable && this.currentPlayer.directionFacing === "right") {
      this.currentPlayer.sword?.setPosition(-12, -17);
    } else if (
      swordBody.enable &&
      this.currentPlayer.directionFacing === "left"
    ) {
      this.currentPlayer.sword?.setPosition(-22, -17);
    }
  }

  private setSuperEggInitCount() {
    this.superEggInitCount = this.eggCounter;
  }

  private createEgg() {
    this.eggCounter += 1;
    const minX = EGG_SPAWN_LEFT_LIMIT;
    const maxX = EGG_SPAWN_RIGHT_LIMIT;
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

    if (this.eggCounter - this.superEggInitCount <= 5) {
      this.createSuperEasterEgg(randomX);
    } else if ((this.eggCounter - 10) % 20 === 0) {
      this.createGoldenEgg(randomX);
    } else if (this.eggCounter % 20 === 0) {
      this.createBadEgg(randomX);
    } else {
      this.createEasterEgg(randomX);
    }
  }

  private createEasterEgg(x: number) {
    this.easterEgg = new EasterEgg({
      x: x,
      y: -1,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createSuperEasterEgg(x: number) {
    this.superEasterEgg = new SuperEasterEgg({
      x: x,
      y: -1,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createBadEgg(x: number) {
    this.badEgg = new BadEgg({
      x: x,
      y: -1,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createGoldenEgg(x: number) {
    this.goldenEgg = new GoldenEgg({
      x: x,
      y: -1,
      scene: this,
      player: this.currentPlayer,
      action: () => this.setSuperEggInitCount(),
    });
  }

  private updateEnemySpawnInterval() {
    const minutesElapsed = Math.floor(this.secondsElapsed / 60);
    const newEnemySpawnInterval = Math.max(
      ENEMY_SPAWN_INTERVAL - minutesElapsed * ENEMY_SPAWN_REDUCTION_PER_MINUTE,
      MINIMUM_ENEMY_SPAWN_INTERVAL,
    );
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
      snake: () => this.createSnake(),
      specialSnake: () => this.createSpecialSnake(),
      hawk: () => this.createHawk(),
      specialHawk: () => this.createSpecialHawk(),
    };
    const enemyNames = Object.keys(enemies) as Array<keyof typeof enemies>;
    const ranNum = Math.floor(Math.random() * enemyNames.length);
    enemies[enemyNames[ranNum]]();
  }

  private createSnake() {
    const startingPoint = [
      SNAKE_CONFIGURATION.snakeX_config.RtoL.x,
      SNAKE_CONFIGURATION.snakeX_config.LtoR.x,
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
    const startingPoint = [
      SNAKE_CONFIGURATION.snakeX_config.RtoL.x,
      SNAKE_CONFIGURATION.snakeX_config.LtoR.x,
    ];
    const ranNum = Math.floor(Math.random() * startingPoint.length);

    this.specialSnake = new SpecialSnake({
      x: startingPoint[ranNum],
      y: Y_AXIS,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createHawk() {
    const startingPoint = [
      HAWK_CONFIGURATION.normalHawk.RtoL.x,
      HAWK_CONFIGURATION.normalHawk.LtoR.x,
    ];
    const ranNum = Math.floor(Math.random() * startingPoint.length);

    this.normalHawk = new NormalHawk({
      x: startingPoint[ranNum],
      y: Y_AXIS,
      scene: this,
      player: this.currentPlayer,
    });
  }

  private createSpecialHawk() {
    const startingPoint = [
      HAWK_CONFIGURATION.specialHawk.RtoL.x,
      HAWK_CONFIGURATION.specialHawk.LtoR.x,
    ];
    const ranNum = Math.floor(Math.random() * startingPoint.length);

    this.specialHawk = new SpecialHawk({
      x: startingPoint[ranNum],
      y: SPECIALHAWK_Y,
      scene: this,
      player: this.currentPlayer,
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

  private addDecorations() {
    const goblinFartingName = "goblin_farting";
    const goblinSnorklingName = "goblin_snorkling";
    const dragonflyName = "dragonfly";
    const snakeJumpName = "snake_jump";
    const eggCentralIslandName = "egg_central_island";
    const thematicDecorationName = "thematic_decoration";
    const bunnyShopName = "bunny_shop";

    const goblinFarting = this.add.sprite(378, 34, goblinFartingName);
    const goblinSnorkling = this.add.sprite(278, 17, goblinSnorklingName);
    const dragonfly = this.add.sprite(374, 146, dragonflyName);
    const snakeJump = this.add.sprite(228, 157, snakeJumpName);
    const eggCentralIsland = this.add.sprite(340, 141, eggCentralIslandName);
    const thematicDecoration = this.add.sprite(
      408,
      100,
      thematicDecorationName,
    );
    const bunnyShop = this.add.sprite(344, 249, thematicDecorationName);

    this.createAnimation(goblinFarting, goblinFartingName, 0, 62);
    this.createAnimation(goblinSnorkling, goblinSnorklingName, 0, 45);
    this.createAnimation(dragonfly, dragonflyName, 0, 1);
    this.createAnimation(snakeJump, snakeJumpName, 0, 8);
    this.createAnimation(eggCentralIsland, eggCentralIslandName, 0, 35);
    this.createAnimation(thematicDecoration, thematicDecorationName, 0, 8);
    this.createAnimation(bunnyShop, bunnyShopName, 0, 8);
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
