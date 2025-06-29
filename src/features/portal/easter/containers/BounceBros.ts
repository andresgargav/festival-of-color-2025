import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { MachineInterpreter } from "../lib/Machine";
import { Scene } from "../Scene";
import {
  STONE_CONFIGURATION,
  SHOOTING_SPRITE_SCALE,
  Y_AXIS,
  PORTAL_VOLUME,
  BOUNCING_CONFIGURATION,
} from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class BounceBros extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private ballSprite!: Phaser.GameObjects.Sprite;
  private spriteName!: string;
  private brosName: string;
  private ballBody!: Phaser.Physics.Arcade.Body;
  private overlapHandler?: Phaser.Physics.Arcade.Collider;
  private bro1Sprite!: Phaser.GameObjects.Sprite;
  private bro2Sprite!: Phaser.GameObjects.Sprite;
  private ranNumRes: boolean;

  scene: Scene;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.brosName = "ground_slime_shooting";
    this.spriteName = "stone";
    this.ballSprite = scene.add.sprite(0, 0, this.spriteName);

    this.ranNumRes = this.scene?.randomIndex == 1;

    !this.ranNumRes ? this.Bro2() : this.Bro1();

    this.setCollisions();

    // Ball movement
    this.BallRotation();
    this.scene?.time.delayedCall(400, () => this.BouncingBall());

    scene.add.existing(this);
  }

  private get portalService() {
    return this.scene?.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private BouncingBall() {
    this.scene?.sound.play("ground_slime_shoot", { volume: PORTAL_VOLUME });

    const bouncingConfig = [
      BOUNCING_CONFIGURATION.config_1,
      BOUNCING_CONFIGURATION.config_2,
    ];

    const resConfig = bouncingConfig[this.scene?.randomIndex];

    const containerX = !this.ranNumRes
      ? STONE_CONFIGURATION.LtoR
      : STONE_CONFIGURATION.RtoL;

    const targetX = containerX;
    const duration = resConfig.duration;
    const distanceX = targetX - this.x;
    const velocityX = distanceX / (duration / 1000);

    this.setDepth(1000000000);
    this.setSize(this.ballSprite?.width, this.ballSprite?.height);
    this.add(this.ballSprite);

    this.scene.physics.world.enable(this);
    this.ballBody = this.body as Phaser.Physics.Arcade.Body;
    this.ballBody
      .setAllowGravity(true)
      .setVelocityX(velocityX)
      .setBounce(1)
      .setGravityY(resConfig.gravityY)
      .setVelocityY(resConfig.velocityY);

    this.overlapHandler = this.scene?.physics.add.overlap(
      this.player as BumpkinContainer,
      this as Phaser.GameObjects.GameObject,
      () => this.handleOverlap(),
    );

    this.scene?.time.delayedCall(duration - 500, () => {
      this.scene?.sound.play("slime_whoosh", { volume: PORTAL_VOLUME });
      this.ranNumRes ? this.Bro2() : this.Bro1();
    });
    this.scene?.time.delayedCall(duration, () => {
      this.dissapear();
    });
  }

  private BallRotation() {
    this.scene?.tweens.add({
      targets: this,
      angle: !this.ranNumRes ? -360 : 360,
      duration: 500,
      repeat: -1,
      ease: "Linear",
    });
  }

  private createAnimation(
    sprite: Phaser.GameObjects.Sprite,
    spriteName: string,
    start: number,
    end: number,
  ) {
    this.scene?.anims.create({
      key: `${spriteName}_anim`,
      frames: this.scene?.anims.generateFrameNumbers(spriteName, {
        start,
        end,
      }),
      frameRate: 10,
      repeat: 0,
    });
    sprite?.play(`${spriteName}_anim`, true);
  }

  private Bro1() {
    if (!this.player) return;
    this.bro1Sprite = this.scene?.add
      .sprite(STONE_CONFIGURATION.LtoR, Y_AXIS + 5, this.brosName)
      .setDepth(10000000000000)
      .setScale(SHOOTING_SPRITE_SCALE);
    this.createAnimation(this.bro1Sprite, this.brosName, 0, 8);
    this.scene?.time.delayedCall(1000, () =>
      this.bro1Sprite?.setVisible(false).destroy(),
    );
  }

  private Bro2() {
    if (!this.player) return;
    this.bro2Sprite = this.scene?.add
      .sprite(STONE_CONFIGURATION.RtoL, Y_AXIS + 5, this.brosName)
      .setDepth(100000000000000)
      .setScale(SHOOTING_SPRITE_SCALE);
    this.createAnimation(this.bro2Sprite, this.brosName, 0, 8);
    this.scene?.time.delayedCall(1000, () =>
      this.bro2Sprite?.setVisible(false).destroy(),
    );
  }

  private setCollisions() {
    this.scene?.physics.add.collider(
      this,
      this.scene?.ground as Phaser.GameObjects.GameObject,
      () => this.scene?.sound.play("stone_bouncing", { volume: PORTAL_VOLUME }),
    );
  }

  private handleOverlap() {
    if (this.overlapHandler) {
      this.scene?.physics.world.removeCollider(this.overlapHandler);
      this.overlapHandler = undefined;
    }
    this.removeLife();
  }

  private removeLife() {
    if (this.portalService) {
      const currentLives = this.portalService?.state.context.lives;
      if (currentLives > 0) {
        this.portalService?.send({ type: "LOSE_LIFE" });
        this.player?.hurt();
        if (this.portalService?.state.context.lives <= 0) {
          this.portalService?.send({ type: "GAME_OVER" });
        }
      }
    }
  }

  private dissapear() {
    this.ballBody?.setVelocity(0, 0);
    this.ballBody?.setAllowGravity(false);
    this.ballBody?.setBounce(0);
    this.destroy();
  }
}
