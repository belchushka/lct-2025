import { Character, type CharacterConstructorParams } from "./base";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class Volk extends Character {
  
  constructor({scene, markerController, dispatchEvent}: CharacterConstructorParams) {
    super({scene, markerController, dispatchEvent})
  }

  protected getFilePath(): string {
      return "/volk_sitting.glb"
  }

  public async showRobotWithAudio(): Promise<void> {
    const loader = new GLTFLoader();

    return new Promise((resolve) => {
      loader.load("/robot.glb", (robotModel) => {
        // Position robot near Volk
        robotModel.scene.position.set(-10, 0, 0); 
        robotModel.scene.scale.set(4, 4, 4);

        robotModel.scene.rotation.y = -Math.PI / 2;
        robotModel.scene.rotation.x = -Math.PI;
        robotModel.scene.rotation.z = -Math.PI / 2;

        this.scene.add(robotModel.scene);

        // Play robot audio
        const robotAudio = new Audio("/audio/robot.mp3");
        robotAudio.play();

        robotAudio.addEventListener("ended", () => {
          // Play volk goodbye audio
          const volkGoodbyeAudio = new Audio("/audio/volk_goodbye.mp3");
          volkGoodbyeAudio.play();

          volkGoodbyeAudio.addEventListener("ended", () => {
            resolve();
          });
        });
      });
    });
  }

  protected async script(): Promise<void> {
    console.log(this.model)

    if (this.model == null) {
      return;
    }

    this.model.scene.rotation.y = -Math.PI / 2;
    this.model.scene.rotation.x = -Math.PI;
    this.model.scene.rotation.z = -Math.PI / 2;

    this.model.scene.scale.set(10, 10, 10);

    this.model.scene.position.set(0, 0, 7);

    const audio = new Audio("/audio/volk_hello.mp3");
    audio.play();

    audio.addEventListener("ended", () => {
      this.dispatchEvent("helloEnded", null);
    });

    await this.runAnimation("Armature|Sit_Cross_Legged|baselayer")
    //stop()
  }
}
