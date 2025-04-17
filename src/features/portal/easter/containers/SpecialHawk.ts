import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { MachineInterpreter } from "../lib/Machine";
import {
  HAWK_SCALE,
  HAWK_CONFIGURATION,
  DIVE_POINT,
  Y_AXIS,
  PORTAL_VOLUME
} from "../Constants";
import { Scene } from "../Scene";
import { SQUARE_WIDTH } from "features/game/lib/constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class SpecialHawk extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  scene: Scene;
  public sprite!: Phaser.GameObjects.Sprite;
  private attackSprite!: Phaser.GameObjects.Sprite;
  private overlapHandler?: Phaser.Physics.Arcade.Collider;
  public isActive = false; // Flag to track active
  private hawk: string;
  private numRes!: number;
  private RtoL_X!: number;
  private LtoR_X!: number;
  private ranNumDive!: number;
  private hawkSound?: Phaser.Sound.BaseSound;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.RtoL_X = HAWK_CONFIGURATION.specialHawk.RtoL.x;
    this.LtoR_X = HAWK_CONFIGURATION.specialHawk.LtoR.x;

    this.hawk = "hawk_flying";
    if (x == this.RtoL_X) {
      this.sprite = scene.add
        .sprite(0, 0, this.hawk)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(false)
        .setScale(HAWK_SCALE);
      this.numRes = this.RtoL_X;
    } else {
      this.sprite = scene.add
        .sprite(0, 0, this.hawk)
        .setOrigin(0)
        .setDepth(1000)
        .setFlipX(true)
        .setScale(HAWK_SCALE);
      this.numRes = this.LtoR_X;
    }

    this.sprite.setAlpha(0);

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.hawkSound = this.scene.sound.add("wings_flap", { loop: true, rate: 2, volume: PORTAL_VOLUME});
    this.hawkSound.play();

    this.Hawk();
    scene.add.existing(this);
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private HawkAnim(
    key: string,
    frameName: string,
    end: number,
    repeat: number,
    frameRate: number,
    targetSprite: Phaser.GameObjects.Sprite,
  ): void {
    this.scene.anims.create({
      key: key,
      frames: this.scene.anims.generateFrameNumbers(frameName, {
        start: 0,
        end: end,
      }),
      repeat: repeat,
      frameRate: frameRate,
    });
    targetSprite.play(key, true);
  }

  private Hawk() {
    if (!this.player) return;

    this.HawkAnim(`${this.hawk}_anim`, this.hawk, 5, -1, 15, this.sprite);

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 500,
      ease: "Linear",
    });

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.numRes == 0 ? DIVE_POINT : -DIVE_POINT,
      duration: 3000,
      ease: "Linear",
      onComplete: () => {
        this.ReadyToDive();
      },
    });
  }

  private ReadyToDive() {
    const hawkDive = "hawk_readydive";
    this.scene.sound.play("hawk_sound", {volume: PORTAL_VOLUME})

    this.HawkAnim(`${hawkDive}_anim`, hawkDive, 4, 0, 15, this.sprite);

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 333,
      ease: "Linear",
      onComplete: () => {
        this.Dive();
        this.hawkSound?.stop();
      },
    });
  }

  private Dive() {
    const hawkDive = "hawk_dive";
    this.scene.sound.play("dive", {volume: PORTAL_VOLUME})

    this.HawkAnim(`${hawkDive}_anim`, hawkDive, 1, -1, 15, this.sprite);

    this.ranNumDive = Math.floor(Math.random() * (300 - 165 + 1)) + 165;

    let positionX;
    if (this.player) {
      positionX = !this.numRes
        ? this.player.x - 10
        : this.player.x - this.scene.map.width * SQUARE_WIDTH + 10;
    } else {
      positionX = !this.numRes ? this.ranNumDive : -this.ranNumDive;
    }

    this.scene.tweens.add({
      targets: this.sprite,
      x: positionX,
      y: 130,
      duration: 1200,
      ease: "Linear",
      onComplete: () => {
        this.sprite.setVisible(false);
        this.Attack();
      },
    });
  }

  private Attack() {
    const hawkAttack = "hawk_collision";
    this.scene.sound.play("attack", {volume: PORTAL_VOLUME})

    if (this.x == this.RtoL_X) {
      this.attackSprite = this.scene.add
        .sprite(0, 0, hawkAttack)
        .setOrigin(0, 0)
        .setDepth(1000)
        .setFlipX(false)
        .setScale(HAWK_SCALE);
      this.numRes = this.RtoL_X;
    } else {
      this.attackSprite = this.scene.add
        .sprite(0, 0, hawkAttack)
        .setOrigin(0, 0)
        .setDepth(1000)
        .setFlipX(true)
        .setScale(HAWK_SCALE);
      this.numRes = this.LtoR_X;
    }

    this.attackSprite.setPosition(
      this.numRes == 0 ? this.sprite.x : 225 + (225 + this.sprite.x),
      Y_AXIS,
    );

    this.scene.physics.world.enable(this.attackSprite);

    const hawkBody = this.attackSprite.body as Phaser.Physics.Arcade.Body;

    hawkBody
      .setSize(this.attackSprite.width / 2.5, this.attackSprite.height)
      .setOffset(this.attackSprite.width / 3.5, this.attackSprite.height / 15)
      .setAllowGravity(false);

    this.HawkAnim(
      `${hawkAttack}_anim`,
      hawkAttack,
      5,
      0,
      10,
      this.attackSprite,
    );

    this.attackSprite.scene.physics.add.collider(
      this.attackSprite,
      this.scene.ground as Phaser.GameObjects.GameObject,
      () => {
        const lives = this.portalService?.state.context.lives;
        lives === 0 && this.destroy();
      },
    );

    this.overlapHandler = this.attackSprite.scene.physics.add.overlap(
      this.player as BumpkinContainer,
      this.attackSprite,
      () => this.handleOverlap(),
    );

    this.scene.time.delayedCall(500, () => this.collisionAnim());
  }

  private handleOverlap() {
    if (this.overlapHandler) {
      this.scene.physics.world.removeCollider(this.overlapHandler);
      this.overlapHandler = undefined;
    }
    this.removeLife();
    this.collisionAnim();
    this.attackSprite.setVisible(false);
    this.scene.physics.world.disable(this.attackSprite);
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
    this.sprite.setVisible(true);
    this.HawkAnim(`${this.hawk}_anim`, this.hawk, 5, -1, 15, this.sprite);
    this.scene.sound.play("fly_away", {volume: 1.5})

    const scapeDirection = this.x + 100;

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.numRes == 0 ? 225 + (225 + scapeDirection) : -scapeDirection,
      y: -250,
      duration: 4000,
      ease: "Linear",
      repeat: 0,
    });

    this.attackSprite.setVisible(false);
    this.scene.physics.world.disable(this.attackSprite);
    this.fadeDestroy();
  }

  private fadeDestroy() {
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 5000,
      onComplete: () => {
        this.sprite.setVisible(false);
        this.scene.tweens.killTweensOf(this.sprite);
        this.sprite.stop();
      },
    });
  }
}
