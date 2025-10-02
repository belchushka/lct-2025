import { Character, type CharacterConstructorParams } from "./base";
import * as THREE from "three";

export class Cheburashka extends Character {
  private backgroundPlane: THREE.Mesh | null = null;

  constructor({ scene, dispatchEvent, markerController }: CharacterConstructorParams) {
    super({ scene, dispatchEvent, markerController });
  }

  protected getFilePath(): string {
    return "/cheburashka.glb";
  }

  protected async script(): Promise<void> {
    console.log(this.model?.userData);

    if (this.model == null) {
      return;
    }

    this.model.scene.rotation.y = -Math.PI / 2;
    this.model.scene.rotation.x = -Math.PI;
    this.model.scene.rotation.z = -Math.PI / 2;

    this.model.scene.scale.set(2, 2, 2);

    const audio = new Audio("/audio/cheburashka_hello.mp3");
    audio.play();

    audio.addEventListener("ended", () => {
      this.dispatchEvent("helloEnded", null);
    });
  }

  public showRandomBackground(): void {
    const randomNum = Math.floor(Math.random() * 27) + 1;
    const backgroundPath = `/background/NPK_BACKGROUND_${String(randomNum).padStart(2, '0')}.jpg`;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(backgroundPath, (texture) => {
      // Remove old background if exists
      if (this.backgroundPlane) {
        this.scene.remove(this.backgroundPlane);
      }

      // Create plane geometry for background
      const geometry = new THREE.PlaneGeometry(5, 5);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });

      this.backgroundPlane = new THREE.Mesh(geometry, material);

      // Position the background behind the character
      this.backgroundPlane.position.set(5, 0, 0);
      this.backgroundPlane.scale.set(5, 5, 5)
      this.backgroundPlane.rotation.y = -Math.PI / 2;
      this.backgroundPlane.rotation.x = -Math.PI / 2;


      this.scene.add(this.backgroundPlane);
    });
  }
}
