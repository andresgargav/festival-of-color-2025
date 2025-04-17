import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { MachineInterpreter } from "../lib/Machine";
import {
  GRAVITY,
  HAWK_SCALE,
  HAWK_CONFIGURATION,
  SNAKE_INITIAL_SPEED,
  PORTAL_VOLUME
} from "../Constants";
import { Scene } from "../Scene";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class NormalHawk extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  scene: Scene;
  public sprite!: Phaser.GameObjects.Sprite;
  private overlapHandler?: Phaser.Physics.Arcade.Collider;
  public isActive = false; // Flag to track active
  private hawk: string;
  private numRes!: number;
  private moveRight!: boolean;
  private Xaxis!: number;
  private RtoL_X!: number;
  private LtoR_X!: number;
  private hawkSound?: Phaser.Sound.BaseSound;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.RtoL_X = HAWK_CONFIGURATION.normalHawk.RtoL.x;
    this.LtoR_X = HAWK_CONFIGURATION.normalHawk.LtoR.x;

    this.Xaxis = this.x;

    this.hawk = "hawk_flying";
    if (x == this.RtoL_X) {
      this.sprite = scene.add
        .sprite(0, 0, this.hawk)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(true)
        .setScale(HAWK_SCALE);
      this.numRes = this.LtoR_X;
    } else {
      this.sprite = scene.add
        .sprite(0, 0, this.hawk)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(false)
        .setScale(HAWK_SCALE);
      this.numRes = this.RtoL_X;
    }

    this.sprite.setAlpha(0);

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.Hawk();
    this.HawkAnim();
    this.hawkSound = this.scene.sound.add("wings_flap", { loop: true, rate: 1.5, volume: PORTAL_VOLUME });
    this.hawkSound.play();
    
    scene.add.existing(this);
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private Hawk() {
    if (!this.player) return;

    this.scene.physics.world.enable(this);

    const hawkBody = this.body as Phaser.Physics.Arcade.Body;

    hawkBody
      .setSize(this.sprite.width / 3.5, this.sprite.height)
      .setOffset(this.sprite.width / 1.4, this.sprite.height / 2)
      .setCollideWorldBounds(true)
      .setGravityY(GRAVITY);

    if (this.Xaxis == this.RtoL_X) {
      hawkBody.setVelocityX(SNAKE_INITIAL_SPEED * -1);
      this.destroyHawk(this.scene.leftWall as Phaser.GameObjects.GameObject);
    } else {
      hawkBody.setVelocityX(SNAKE_INITIAL_SPEED);
      this.destroyHawk(this.scene.rightWall as Phaser.GameObjects.GameObject);
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

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 1000,
      ease: "Linear",
    });
  }

  private HawkAnim() {
    this.scene.anims.create({
      key: `${this.hawk}_anim`,
      frames: this.scene.anims.generateFrameNumbers(this.hawk, {
        start: 0,
        end: 5,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.sprite.play(`${this.hawk}_anim`, true);
  }

  private handleOverlap() {
    if (this.overlapHandler) {
      this.scene.physics.world.removeCollider(this.overlapHandler);
      this.overlapHandler = undefined;
    }
    this.removeLife();
    this.collisionAnim();
    this.hawkSound?.stop();
    this.scene.sound.play("fly_away", {volume: 1.5})
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
    if (this.Xaxis == this.RtoL_X) {
      this.moveRight = true;
    } else {
      this.moveRight = false;
    }

    const scapeDirection = this.x + 100;

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.moveRight ? -scapeDirection : scapeDirection,
      y: -250,
      duration: 4000,
      ease: "Linear",
      repeat: 0,
    });
  }

  private destroyHawk(object: Phaser.GameObjects.GameObject) {
    this.scene.physics.add.overlap(this, object, () => {
      this.fadeDestroy();
    });
  }

  private fadeDestroy() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.destroy();
        this.hawkSound?.stop();
      },
    });
  }
}
