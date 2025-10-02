import { Character, type CharacterConstructorParams } from "./base";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export class Shapoklyak extends Character {
  private lariskaModel: GLTF | null = null;
  private lariskaMixer: THREE.AnimationMixer | null = null;
  private lariskaClock: THREE.Clock = new THREE.Clock();
  private lariskaMovementActive: boolean = false;
  private lariskaStartTime: number = 0;

  constructor({ scene, dispatchEvent, markerController }: CharacterConstructorParams) {
    super({ scene, dispatchEvent, markerController });
    this.loadLariskaModel();
  }

  protected getFilePath(): string {
    return "/shapoklyak.glb";
  }

  private loadLariskaModel(): void {
    const loader = new GLTFLoader();
    loader.load("/lariska_standing.glb", (model: GLTF) => {
      this.lariskaModel = model;

      // Position and scale Lariska next to Shapoklyak
      model.scene.rotation.y = -Math.PI / 2;
      model.scene.rotation.x = -Math.PI;
      model.scene.rotation.z = -Math.PI / 2;
      model.scene.scale.set(2, 2, 2);
      model.scene.position.set(0, 3, 8.5); // Position next to Shapoklyak

      this.scene.add(model.scene);

      // Set up animation
      if (model.animations && model.animations.length > 0) {
        this.lariskaMixer = new THREE.AnimationMixer(model.scene);
        const idleAnimation = model.animations.find(
          (anim) => anim.name === "Armature|Idle|baselayer"
        );

        if (idleAnimation) {
          this.lariskaMixer.clipAction(idleAnimation).play();
          this.animateLariska();
        }
      }
    });
  }

  private animateLariska(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.lariskaMixer) {
        this.lariskaMixer.update(this.lariskaClock.getDelta());
      }

      // Handle movement animation
      if (this.lariskaMovementActive && this.lariskaModel) {
        const elapsed = (Date.now() - this.lariskaStartTime) / 1000;

        if (elapsed < 5) {
          // Run in a circle for 5 seconds
          const radius = 5;
          const speed = 1; // rotations per second
          const angle = elapsed * speed * Math.PI * 2;

          this.lariskaModel.scene.position.x = Math.cos(angle) * radius;
          this.lariskaModel.scene.position.z = 8.5 + Math.sin(angle) * radius;

          // Rotate to face movement direction
          this.lariskaModel.scene.rotation.z = -Math.PI / 2 - angle;
        } else {
          // Run away and disappear
          const runAwayDuration = 1; // 1 second to run away
          const runAwayProgress = (elapsed - 5) / runAwayDuration;

          if (runAwayProgress < 1) {
            // Move away from center
            this.lariskaModel.scene.position.z = 2.5 + runAwayProgress * 20;
            this.lariskaModel.scene.position.y = 2 - runAwayProgress * 3; // move down slightly
          } else {
            // Remove from scene
            this.scene.remove(this.lariskaModel.scene);
            this.lariskaMovementActive = false;

            // Play goodbye audio
            const goodbyeAudio = new Audio("/audio/shap_goodbye.mp3");
            goodbyeAudio.play();
          }
        }
      }
    };
    animate();
  }

  public startLariskaMovement(): void {
    this.lariskaMovementActive = true;
    this.lariskaStartTime = Date.now();
  }

  protected async script(): Promise<void> {
    console.log(this.model?.userData);

    if (this.model == null) {
      return;
    }

    this.model.scene.rotation.y = -Math.PI / 2;
    this.model.scene.rotation.x = -Math.PI;
    this.model.scene.rotation.z = -Math.PI / 2;

    this.model.scene.scale.set(10, 10, 10);

    const audio = new Audio("/audio/shapoklyak_hello.mp3");
    audio.play();

    audio.addEventListener("ended", () => {
      this.startLariskaMovement();
      this.dispatchEvent("helloEnded", null);
    });
  }
}
