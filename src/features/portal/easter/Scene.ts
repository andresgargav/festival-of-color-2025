import mapJson from "assets/map/easter-test.json";
// import tilesetconfig from "assets/map/tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, WALKING_SPEED } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/Machine";
import { EventObject } from "xstate";
import { SPAWNS } from "features/world/lib/spawn";
import { isTouchDevice } from "features/world/lib/device";
import { PORTAL_NAME, SNAKE_CONFIGURATION, Y_axis } from "./Constants";
import { NormalSnake } from "./containers/NormalSnake";

// export const NPCS: NPCBumpkin[] = [
//   {
//     x: 380,
//     y: 400,
//     // View NPCModals.tsx for implementation of pop up modal
//     npc: "portaller",
//   },
// ];

export class Scene extends BaseScene {
  sceneId: SceneId = PORTAL_NAME;
  snake!: NormalSnake;


  constructor() {
    super({
      name: PORTAL_NAME,
      map: {
        json: mapJson,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet("snake_normal", "world/snake_normal.webp", {
      frameWidth: 20,
      frameHeight: 19,
    })

    this.load.spritesheet("snake_normal_collision", "world/snake_normal_collision.webp", {
      frameWidth: 20,
      frameHeight: 19,
    })
  }

  async create() {
    this.map = this.make.tilemap({
      key: PORTAL_NAME,
    });
    super.create();

    this.velocity = 0;
    this.initializeControls();
    this.initializeRetryEvent();

    // console.log(`Player X position ${this.currentPlayer?.x}`)

    this.createSnake();
    
    this.physics.world.drawDebug = false;
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  private get isGamePlaying() {
    return this.portalService?.state.matches("playing") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  update() {
    super.update();

    this.createSnake

    if (this.isGamePlaying) {
      // The game has started
    } else if (this.isGameReady) {
      this.portalService?.send("START");
      this.velocity = WALKING_SPEED;
    }
  }

    private createSnake() {
      const startingPoint = [SNAKE_CONFIGURATION.normalSnake.RtoL.x, SNAKE_CONFIGURATION.normalSnake.LtoR.x]
      const ranNum = Math.floor(Math.random() * startingPoint.length);

        this.snake = new NormalSnake({
          x: startingPoint[ranNum],
          y: Y_axis,
          scene: this,
          player: this.currentPlayer,
        })
    }

  private initializeControls() {
    if (isTouchDevice()) {
      this.portalService?.send("SET_JOYSTICK_ACTIVE", {
        isJoystickActive: true,
      });
    }
  }

  private initializeRetryEvent() {
    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.isCameraFading = true;
        this.cameras.main.fadeOut(500);
        this.reset();
        this.cameras.main.on(
          "camerafadeoutcomplete",
          () => {
            this.cameras.main.fadeIn(500);
            this.velocity = WALKING_SPEED;
            this.isCameraFading = false;
          },
          this,
        );
      }
    };
    this.portalService?.onEvent(onRetry);
  }

  private reset() {
    this.currentPlayer?.setPosition(
      SPAWNS()[this.sceneId].default.x,
      SPAWNS()[this.sceneId].default.y,
    );
  }
}
