import { DART_VELOCITY, PORTAL_VOLUME } from "../Constants";
import { Scene } from "../Scene";

interface Props {
  x: number;
  y: number;
  scene: Scene;
}

export class Dart extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;

  scene: Scene;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;

    // Dart Sprite
    this.spriteName = "dart";
    this.sprite = scene.add.sprite(0, 0, this.spriteName);

    // Collisions
    this.collideWithTopWall();

    // Sound
    this.playSound();

    this.setDepth(1000000000000);
    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body)
      .setAllowGravity(false)
      .setVelocityY(-DART_VELOCITY);

    scene.add.existing(this);
  }

  private playSound() {
    this.scene.sound.play("shoot", { volume: PORTAL_VOLUME });
  }

  private collideWithTopWall() {
    this.scene.physics.add.overlap(this, this.scene.topWall, () => {
      this.destroy();
    });
  }
}
