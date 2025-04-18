import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  player?: BumpkinContainer;
  removedAnim?: boolean;
}

export class Heart extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;

  scene: BaseScene;

  constructor({ x, y, scene, player, removedAnim = false }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    // Heart Sprite
    const spriteName = "heart";
    this.sprite = scene.add.sprite(0, 0, spriteName).setOrigin(0);

    if (removedAnim) {
      this.sprite.setScale(0.6).setOrigin(0.5);

      const label = this.scene.add.text(-11, -4, "-1", {
        fontSize: "3.5px",
        fontFamily: "Teeny",
        color: "#FFFFFF",
        resolution: 10,
        padding: { x: 2, y: 2 },
      });

      label.setShadow(4, 4, "#161424", 0, true, true);
      this.add(label);
      this.playRemovalAnimation();
    }

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    scene.add.existing(this);
  }

  playRemovalAnimation() {
    this.setAlpha(1);
    this.setVisible(true);
    this.scene.tweens.add({
      targets: [this],
      props: {
        x: { value: `+=-15`, duration: 1000, ease: "Power2" },
        y: {
          value: `+=5`,
          duration: 500,
          ease: "Bounce.easeOut",
        },
      },
      onComplete: () => this.destroy(),
    });
  }
}
