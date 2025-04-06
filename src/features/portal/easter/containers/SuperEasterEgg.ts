import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Scene } from "../Scene";
import { MachineInterpreter } from "../lib/Machine";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

export class SuperEasterEgg extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;

  scene: Scene;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    // Super Easter Egg Sprite
    this.spriteName = "super_easter_egg";
    this.sprite = scene.add.sprite(0, 0, this.spriteName);

    // Collisions
    this.setCollisions();

    // Animation
    this.createAnimations();

    // Action - Overlap
    this.overlapWithBasket();
    this.overlapWithSword();

    this.setDepth(1000000000);
    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body)
      .setAllowGravity(false)
      .setVelocityY(50);

    scene.add.existing(this);
  }

  private get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private setCollisions() {
    this.scene.physics.add.collider(
      this,
      this.scene.ground as Phaser.GameObjects.GameObject,
      () => this.break(),
    );
  }

  private createAnimations() {
    this.scene.anims.create({
      key: `${this.spriteName}_disappear`,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.spriteName}_disappear`,
        {
          start: 1,
          end: 12,
        },
      ),
      repeat: 0,
      frameRate: 15,
    });

    this.scene.anims.create({
      key: `${this.spriteName}_break`,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.spriteName}_break`,
        {
          start: 1,
          end: 13,
        },
      ),
      repeat: 0,
      frameRate: 10,
    });
  }

  private overlapWithBasket() {
    this.scene.physics.add.overlap(
      this,
      this.player?.basket as Phaser.GameObjects.Zone,
      () => {
        if (
          (this.body as Phaser.Physics.Arcade.Body).bottom <=
          (this.player?.basket?.body as Phaser.Physics.Arcade.Body).top + 5
        ) {
          this.portalService?.send("GAIN_POINTS", {
            points: 2,
          });
          this.destroy();
        }
      },
    );
  }

  private overlapWithSword() {
    this.scene.physics.add.overlap(
      this,
      this.player?.sword as Phaser.GameObjects.Zone,
      () => {
        (this.body as Phaser.Physics.Arcade.Body).enable = false;
        this.dissapear();
      },
    );
  }

  private dissapear() {
    this.sprite.anims.play(`${this.spriteName}_disappear`, true);
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        if (anim.key === `${this.spriteName}_disappear`) {
          this.destroy();
        }
      },
    );
  }

  private break() {
    this.sprite.anims.play(`${this.spriteName}_break`, true);
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        if (anim.key === `${this.spriteName}_break`) {
          this.destroy();
        }
      },
    );
  }
}
