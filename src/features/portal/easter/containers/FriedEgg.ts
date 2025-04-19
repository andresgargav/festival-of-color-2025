import { Scene } from "../Scene";

interface Props {
  x: number;
  y: number;
  scene: Scene;
}

export class FriedEgg extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;

  scene: Scene;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;

    const randomNum = Math.floor(Math.random() * 3) + 1;

    // Fried Egg Sprite
    this.spriteName = `fried_egg_${randomNum}`;
    this.sprite = scene.add.sprite(0, 0, this.spriteName).setScale(0);

    // Animation
    this.createAnimations();

    this.setDepth(100000000000);
    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.appear();

    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    scene.add.existing(this);
  }

  private createAnimations() {
    this.scene.anims.create({
      key: `${this.spriteName}_disappear`,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.spriteName}_disappear`,
        {
          start: 1,
          end: 14,
        },
      ),
      repeat: 0,
      frameRate: 10,
    });
  }

  private appear() {
    const randScale = Math.round((Math.random() * (2.5 - 1) + 1) * 10) / 10;
    const duration = 300;
    const onUpdate = (tween: Phaser.Tweens.Tween) => {
      const value = tween.getValue();
      this.sprite.setScale(value);
    };

    this.scene.tweens.addCounter({
      from: 0,
      to: randScale,
      duration: duration,
      onUpdate: (tween) => onUpdate(tween),
      onComplete: () => {
        this.scene.tweens.addCounter({
          from: randScale,
          to: randScale / 2,
          duration: duration,
          yoyo: true,
          repeat: 1,
          onUpdate: (tween) => {
            const value = tween.getValue();
            this.sprite.setScale(value);
          },
        });
      },
    });

    this.scene.time.delayedCall(20000, () => this?.fadeDestroy());
  }

  fadeDestroy() {
    this?.scene?.tweens?.add({
      targets: this,
      alpha: 0,
      duration: 3000,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
