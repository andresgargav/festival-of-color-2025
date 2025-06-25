import { Scene } from "../Scene";
import { NEW_BALLOON_TIME_DELAY, PORTAL_VOLUME } from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  spriteName: string;
  onPop?: () => void;
  onDebuff?: () => void;
}

export class Balloon extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private onPop?: () => void;
  private onDebuff?: () => void;
  private isDeflated = false;
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  scene: Scene;

  constructor({ x, y, scene, spriteName, onPop, onDebuff }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.onPop = onPop;
    this.onDebuff = onDebuff;

    // Balloon blue Sprite
    this.spriteName = spriteName;
    this.sprite = scene.add.sprite(0, 0, this.spriteName);

    // Animation
    this.createAnimations();

    // Collisions
    this.collideWithDart();
    this.collideWithDeflator();

    // Sound
    this.playSound();

    this.setDepth(1000000000);
    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body)
      .setAllowGravity(false)
      .setVelocityY(40);

    scene.add.existing(this);
  }

  private createAnimations() {
    // Flying animation
    this.scene.anims.create({
      key: `flying_${this.spriteName}`,
      frames: this.scene.anims.generateFrameNumbers(
        `flying_${this.spriteName}`,
        {
          start: 0,
          end: 15,
        },
      ),
      repeat: -1,
      frameRate: 12,
    });
    this.sprite.anims.play(`flying_${this.spriteName}`, true);

    // Explosive animation
    this.scene.anims.create({
      key: `explosive_${this.spriteName}`,
      frames: this.scene.anims.generateFrameNumbers(
        `explosive_${this.spriteName}`,
        {
          start: 0,
          end: 4,
        },
      ),
      repeat: 0,
      frameRate: 10,
    });

    // Deflating animation
    this.scene.anims.create({
      key: `deflating_${this.spriteName}`,
      frames: this.scene.anims.generateFrameNumbers(
        `deflating_${this.spriteName}`,
        {
          start: 0,
          end: 6,
        },
      ),
      repeat: 0,
      frameRate: 10,
    });
  }

  private playSound() {
    this.scene.time.delayedCall(NEW_BALLOON_TIME_DELAY, () => {
      this.scene?.sound.play("new_balloon", { volume: PORTAL_VOLUME });
    });
  }

  private collideWithDart() {
    const dartCollider = this.scene.physics.add.collider(
      this,
      this.scene.darts,
      (_, dart) => {
        this.onPop?.();
        dart.destroy();
        this.pop();
      },
    );
    this.colliders.push(dartCollider);
  }

  private collideWithDeflator() {
    const deflatorCollider = this.scene.physics.add.overlap(
      this,
      this.scene.deflator as Phaser.GameObjects.GameObject,
      () => {
        if (!this.isDeflated) {
          this.isDeflated = true;
          this.onDebuff?.();
          this.deflate();
          this.colliders.forEach((collider) => collider.destroy());
        }
      },
    );
    this.colliders.push(deflatorCollider);
  }

  private pop() {
    this.scene.sound.play("burst_balloon", { volume: PORTAL_VOLUME });
    this.sprite.anims.play(`explosive_${this.spriteName}`, true);
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        if (anim.key === `explosive_${this.spriteName}`) {
          this.destroy();
        }
      },
    );
  }

  private deflate() {
    this.scene.sound.play("deflating_balloon", {
      volume: PORTAL_VOLUME,
      rate: 2,
    });
    this.sprite.anims.play(`deflating_${this.spriteName}`, true);
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        if (anim.key === `deflating_${this.spriteName}`) {
          this.destroy();
        }
      },
    );
  }
}
