import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { MachineInterpreter } from "../lib/Machine";
import { Scene } from "../Scene";
import { BALL_CONFIGURATION, SHOOTING_SPRITE_SCALE, Y_AXIS } from "../Constants";
import confetti from "canvas-confetti";
import { SQUARE_WIDTH } from "features/game/lib/constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class BlastBros extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private ballSprite!: Phaser.GameObjects.Sprite;
  private spriteName!: string;
  private brosName: string;
  private ballBody!: Phaser.Physics.Arcade.Body;
  private overlapHandler?: Phaser.Physics.Arcade.Collider;
  private bro1Sprite!: Phaser.GameObjects.Sprite;
  private bro2Sprite!: Phaser.GameObjects.Sprite;
  private ranNumFall!: number;
  private ranNumRes: boolean;
  private target!: number;
  private ballRotationTween?: Phaser.Tweens.Tween;

  scene: Scene;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.brosName = "shooting_slime";
    this.spriteName = "bouncingball";
    this.ballSprite = scene.add.sprite(0, 0, this.spriteName);

    this.ranNumRes = this.scene.randomIndex == 1;

    !this.ranNumRes ? this.Bro2() : this.Bro1();

    this.setCollisions();
    
    // Ball movement
    this.BallRotation();
    this.scene.time.delayedCall(400, () => {
      this.FallingBall();
    });

    scene.add.existing(this);
  }

  private get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private FallingBall() {
    if (!this.player) return;

    this.ranNumFall = Math.floor(Math.random() * (150 - 15 + 1)) + 15;
    this.target = !this.ranNumRes ? -this.ranNumFall : this.ranNumFall

    this.setDepth(10000000000000);
    this.setSize(this.ballSprite.width, this.ballSprite.height);
    this.add(this.ballSprite);

    let positionX = this.player.x - 260
    this.target = this.ranNumRes ? positionX : positionX - 170;

    this.scene.physics.world.enable(this);
    this.ballBody = this.body as Phaser.Physics.Arcade.Body;
    this.ballBody
      .setAllowGravity(true)
      .setGravityY(200)
      .setDragY(500)
      .setVelocityX(this.target)
      .setVelocityY(130);

      this.overlapHandler = this.scene.physics.add.overlap(
        this.player as BumpkinContainer,
        this as Phaser.GameObjects.GameObject,
        () => this.handleOverlap(),
      );
  }

  private BallRotation() {
    this.ballRotationTween = this.scene.tweens.add({
      targets: this,
      angle: !this.ranNumRes ? -360 : 360,
      duration: 500,
      repeat: -1,
      ease: "Linear",
    });
  }

  private BreakingBall() {
    const ballBreaking = "breaking_ball"

    this.scene.tweens.add({
      targets: this,
      angle: 0,
      duration: 200,
      ease: "Linear",
    })

    this.ballRotationTween?.stop();

    this.ballBody
    .setAllowGravity(true)
    .setGravityY(0)
    .setDragY(0)
    .setVelocityX(0)
    .setVelocityY(0)

    this.scene.anims.create({
      key: `${ballBreaking}_anim`,
      frames: this.scene.anims.generateFrameNumbers(ballBreaking, {
        start: 0,
        end: 7,
      }),
      repeat: 0,
      frameRate: 10
    })  
    
    this.ballSprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        if (anim.key === `${ballBreaking}_anim`) {
          this.destroy();
        }
      },
    );

    this.ballSprite.play(`${ballBreaking}_anim`, true)
  }

  private createAnimation(
    sprite: Phaser.GameObjects.Sprite,
    spriteName: string,
    start: number,
    end: number,
  ) {
    this.scene.anims.create({
      key: `${spriteName}_anim`,
      frames: this.scene.anims.generateFrameNumbers(spriteName, {
        start,
        end,
      }),
      frameRate: 10,
      repeat: 0,
    });
    sprite.play(`${spriteName}_anim`, true);
  }

  private Bro1() {
    if (!this.player) return;
    this.bro1Sprite = this.scene.add
      .sprite(BALL_CONFIGURATION.LtoR, Y_AXIS - 230, this.brosName)
      .setDepth(1000000000)
      .setScale(SHOOTING_SPRITE_SCALE)
    this.createAnimation(this.bro1Sprite, this.brosName, 0, 8);
    this.scene.time.delayedCall(1000, () =>
      this.bro1Sprite.setVisible(false).destroy(),
    );
  }

  private Bro2() {
    if (!this.player) return;
    this.bro2Sprite = this.scene.add
      .sprite(BALL_CONFIGURATION.RtoL, Y_AXIS - 230, this.brosName)
      .setDepth(1000000000)
      .setScale(SHOOTING_SPRITE_SCALE)
    this.createAnimation(this.bro2Sprite, this.brosName, 0, 8);
    this.scene.time.delayedCall(1000, () =>
      this.bro2Sprite.setVisible(false).destroy(),
    );
  }

  private setCollisions() {
    this.scene.physics.add.collider(
      this,
      this.scene.ground as Phaser.GameObjects.GameObject,
      () => this.BreakingBall()
    );
  }

  private handleOverlap() {
    if (this.overlapHandler) {
      this.scene.physics.world.removeCollider(this.overlapHandler);
      this.overlapHandler = undefined;
    }
    this.removeLife();
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
}
