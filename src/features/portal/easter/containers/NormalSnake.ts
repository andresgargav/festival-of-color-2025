import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "../lib/Machine";
import { SNAKE_CONFIGURATION, Y_axis } from "../Constants";

interface Props {
    x: number;
    y: number;
    scene: BaseScene;
    player?: BumpkinContainer;
}

export class NormalSnake extends Phaser.GameObjects.Container {
    private player?: BumpkinContainer;
    scene: BaseScene;
    public sprite!: Phaser.GameObjects.Sprite;
    private collisionSprite!: Phaser.GameObjects.Sprite;
    private overlapHandler?: Phaser.Physics.Arcade.Collider;
    public isActive = true; // Flag to track active
    private snake: string;
    private numRes!: number;
    private Xaxis!: number;
    private moveRight!: boolean;
    private RtoL_X!: number;
    private LtoR_X!: number;
    
    constructor({x, y, scene, player}: Props) {
        super(scene, x, y);
        this.scene = scene;
        this.player = player;

        this.RtoL_X = SNAKE_CONFIGURATION.normalSnake.RtoL.x;
        this.LtoR_X = SNAKE_CONFIGURATION.normalSnake.LtoR.x;

        this.Xaxis = this.x;

        this.snake = "snake_normal";
        if(x == this.RtoL_X) {
            this.sprite = scene.add.sprite(0, 0, this.snake).setOrigin(0).setDepth(1000).setFlipX(true)
            this.numRes = this.LtoR_X;
        } else {
            this.sprite = scene.add.sprite(0, 0, this.snake).setOrigin(0).setDepth(1000).setFlipX(false)
            this.numRes = this.RtoL_X;
        }
 
        this.setSize(this.sprite.width, this.sprite.height);
        this.add(this.sprite);
        
        this.SnakeAnim();
        this.Snake();
        
        scene.add.existing(this);
    }
    
    public get portalService() {
        return this.scene.registry.get("portalService") as
          | MachineInterpreter
          | undefined;
    }

    private Snake() {
        if (!this.player) return;

        this.scene.physics.world.enable(this);

        (this.body as Phaser.Physics.Arcade.Body)
        .setSize(this.sprite.width, this.sprite.height)
        .setOffset(this.sprite.width / 2, this.sprite.width / 2)
        .setImmovable(true)
        .setCollideWorldBounds(true);

        this.overlapHandler = this.scene.physics.add.overlap(
            this.player as Phaser.GameObjects.GameObject,
            this as Phaser.GameObjects.GameObject,
            () => this.handleOverlap(),
        );
    }

    private SnakeAnim() {
        this.scene.anims.create({
            key: `snake_anim`,
                frames: this.scene.anims.generateFrameNumbers(this.snake, {
                    start: 0,
                    end: 8,
                }),
                repeat: -1,
                frameRate: 10
        })
        this.sprite.play(`snake_anim`, true) 

        this.scene.tweens.add({
            targets: this,
            x: this.numRes,
            y: Y_axis,
            duration: 15000,
            ease: "Linear",
            repeat: 0,
            onComplete: () => {
                this.sprite.setVisible(false)
                this.scene.physics.world.disable(this);
                this.scene.tweens.killTweensOf(this.sprite)
                this.sprite.stop();
            }
        })
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
              }
            }
          }

    private collisionAnim() {
        this.sprite.setVisible(false)
        console.log(this.Xaxis)

        if(this.Xaxis == this.RtoL_X){
            this.collisionSprite = this.scene.add.sprite(this.x, this.y, "snake_normal_collision").setOrigin(0).setDepth(1000).setFlipX(true);
            this.moveRight = true;
        } else {
            this.collisionSprite = this.scene.add.sprite(this.x, this.y, "snake_normal_collision").setOrigin(0).setDepth(1000);
            this.moveRight = false;
        }

        this.scene.anims.create({
            key: `snake_normal_collision_anim`,
                frames: this.scene.anims.generateFrameNumbers("snake_normal_collision", {
                    start: 0,
                    end: 8,
                }),
                repeat: -1,
                frameRate: 10
        })

        this.collisionSprite.play(`snake_normal_collision_anim`, true);

        this.scene.tweens.add({
            targets: this.collisionSprite,
            x: this.moveRight ? this.x - 40 : this.x + 40,
            y: Y_axis,
            duration: 3000,
            ease: "Linear",
            repeat: 0,
            onComplete: () => {
                this.collisionSprite.setVisible(false);
                this.sprite.setVisible(true)
            }
        })
    }
    
}


