import { Character, type CharacterConstructorParams } from "./base";

export class Gena extends Character {
  constructor({ scene, dispatchEvent, markerController }: CharacterConstructorParams) {
    super({ scene, dispatchEvent, markerController });
  }

  protected getFilePath(): string {
    return "/gena.glb";
  }
  public playSinging(): HTMLAudioElement {
    const audio = new Audio("/audio/gena_singing.mp3");
    audio.play();
    return audio;
  }

  protected async script(): Promise<void> {
    console.log(this.model?.userData);

    if (this.model == null) {
      return;
    }

    this.model.scene.rotation.y = -Math.PI / 2;
    this.model.scene.rotation.x = -Math.PI;
    this.model.scene.rotation.z = -Math.PI / 2;

    this.model.scene.scale.set(5, 5, 5);

    const audio = new Audio("/audio/gena_hello.mp3");
    audio.play();

    audio.addEventListener("ended", () => {
      this.dispatchEvent("helloEnded", null);
    });
  }
}
