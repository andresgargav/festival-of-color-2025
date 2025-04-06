import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { MachineInterpreter } from "../lib/Machine";
import {
  GRAVITY,
  SNAKE_COLLISION_SPEED,
  SNAKE_CONFIGURATION,
  SNAKE_INITIAL_SPEED,
  SPRITE_SCALE,
} from "../Constants";
import { Scene } from "../Scene";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class SpecialSnake extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  scene: Scene;
  public sprite!: Phaser.GameObjects.Sprite;
  private collisionSprite!: Phaser.GameObjects.Sprite;
  private overlapHandler?: Phaser.Physics.Arcade.Collider;
  public isActive = false; // Flag to track active
  private snake: string;
  private numRes!: number;
  private Xaxis!: number;
  private RtoL_X!: number;
  private LtoR_X!: number;
  private isCollide: boolean = false;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.RtoL_X = SNAKE_CONFIGURATION.snakeX_config.RtoL.x;
    this.LtoR_X = SNAKE_CONFIGURATION.snakeX_config.LtoR.x;

    this.Xaxis = this.x;

    this.snake = "snake_special";
    if (x == this.RtoL_X) {
      this.sprite = scene.add
        .sprite(0, 0, this.snake)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(true)
        .setScale(SPRITE_SCALE);
      this.numRes = this.LtoR_X;
    } else {
      this.sprite = scene.add
        .sprite(0, 0, this.snake)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(false)
        .setScale(SPRITE_SCALE);
      this.numRes = this.RtoL_X;
    }

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.Snake();

    scene.add.existing(this);
  }

  public get snakeBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public update() {
    if (!this.snakeBody) return;
    const { fromX, toX} = SNAKE_CONFIGURATION.snake_jumping;
    if(this.snakeBody.x > fromX && this.snakeBody.x < toX) {
      this.jumpingAnim();
    } else if (!this.isCollide)  {
      this.SnakeAnim();
    }
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private Snake() {
    if (!this.player) return;

    this.scene.physics.world.enable(this);

    const snakeBody = this.body as Phaser.Physics.Arcade.Body;

    snakeBody
      .setSize(this.sprite.width - 4, this.sprite.height - 5)
      .setOffset(this.sprite.width / 2, this.sprite.width / 2)
      .setCollideWorldBounds(true)
      .setGravityY(GRAVITY);

    if (this.Xaxis == this.RtoL_X) {
      snakeBody.setVelocityX(SNAKE_INITIAL_SPEED * -1);
      this.destroySnake(this.scene.leftWall as Phaser.GameObjects.GameObject);
    } else {
      snakeBody.setVelocityX(SNAKE_INITIAL_SPEED);
      this.destroySnake(this.scene.rightWall as Phaser.GameObjects.GameObject);
    }

    this.scene.physics.add.collider(
      this,
      this.scene.ground as Phaser.GameObjects.GameObject,
      () => {
        const lives = this.portalService?.state.context.lives;
        lives === 0 && this.destroy();
      },
    );

    this.overlapHandler = this.scene.physics.add.overlap(
      this.player as BumpkinContainer,
      this as Phaser.GameObjects.GameObject,
      () => this.handleOverlap(),
    );
  }

  public SnakeAnim() {
    this.scene.anims.create({
      key: `${this.snake}_anim`,
      frames: this.scene.anims.generateFrameNumbers(this.snake, {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.sprite.play(`${this.snake}_anim`, true);
  }

  private handleOverlap() {
    if (this.overlapHandler) {
      this.scene.physics.world.removeCollider(this.overlapHandler);
      this.overlapHandler = undefined;
    }
    this.removeLife();
    this.collisionAnim();
  }

  private removeLife() {
    if (this.portalService) {
      const currentLives = this.portalService.state.context.lives;
      if (currentLives > 0) {
        this.portalService.send({ type: "LOSE_LIFE" });
        this.player?.hurt();
      }
    }
  }

  private collisionAnim() {
    this.isCollide = true;
    if(this.isCollide)
    this.scene.anims.create({
      key: `${this.snake}_col_anim`,
      frames: this.scene.anims.generateFrameNumbers("snake_special_col", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    
    this.sprite.anims.play(`${this.snake}_col_anim`, true);
    
    const collisionSnakeBody = this.body as Phaser.Physics.Arcade.Body;
    
    if (this.Xaxis == this.RtoL_X) {
      collisionSnakeBody.setVelocityX(SNAKE_COLLISION_SPEED * -1);
    } else {
      collisionSnakeBody.setVelocityX(SNAKE_COLLISION_SPEED);
    }
  }
  
  public jumpingAnim() {
    this.scene.anims.create({
      key: `${this.snake}_jump_anim`,
      frames: this.scene.anims.generateFrameNumbers(`${this.snake}_jump`, {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.sprite.anims.play(`${this.snake}_jump_anim`, true);

    const jumpingSnake = this.body as Phaser.Physics.Arcade.Body;

    if (this.Xaxis == this.RtoL_X) {
      jumpingSnake.setVelocityX(SNAKE_INITIAL_SPEED * -1);
    } else {
      jumpingSnake.setVelocityX(SNAKE_INITIAL_SPEED);
    }
  }

  private destroySnake(object: Phaser.GameObjects.GameObject) {
    this.scene.physics.add.overlap(this, object, () => {
      this.scene.time.delayedCall(1000, () => this.destroy());
    });
  }
}