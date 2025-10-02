import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

export type CharacterConstructorParams = {
  scene: THREE.Group;
  markerController: any
  dispatchEvent: (event: string, data: any)=>void
};

export abstract class Character {
  public scene: THREE.Group;
  public model: GLTF | null = null;
  private modelLoadedPromise: Promise<void> | null = null;
  private modelLoadedResolve: (() => void) | null = null;
  private markerController: any
  public dispatchEvent: (event: string, data: any)=>void

  constructor({ scene, markerController, dispatchEvent }: CharacterConstructorParams) {
    this.scene = scene;
    this.markerController = markerController
    this.dispatchEvent = dispatchEvent

    this.modelLoadedPromise = new Promise((res) => {
      this.modelLoadedResolve = res;
    });

    this.loadModel();
  }

  private loadModel(): void {
    const path = this.getFilePath();
    const loader = new GLTFLoader();
    loader.load(path, (model: GLTF) => {
      this.model = model;
      if (this.modelLoadedResolve != null) this.modelLoadedResolve();

      this.scene.add(model.scene);
    });
  }

  protected abstract getFilePath(): string;

  protected abstract script(): Promise<void>;

  public async runAnimation(name: string) {
    let stopped = false;

    const gltf = this.model as GLTF;

    if (!gltf) {
      await this.modelLoadedPromise;
    }

    let mixer: any;
    const clock = new THREE.Clock();

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(gltf.scene);

      const animation = gltf.animations.find(el=>el.name == name)

      if (!animation) {
        throw Error(`Animation ${name} not found for this model`)
      }

      mixer.clipAction(animation).play()

      const run = () => {
        if (stopped) {
          return;
        }

        requestAnimationFrame(run);

        if (mixer) {
          mixer.update(clock.getDelta());
        }
      };

      run()
    }

    return () => {
      stopped = true;
    };
  }

  public async run() {
    await this.modelLoadedPromise;

    let resolve: ((v: unknown)=>void) | null = null
    const visiblePromise = new Promise(res=>{
      resolve = res
    })

    this.markerController.addEventListener("markerFound" as any, ()=>{
      if (!resolve) {
        return
      }
      resolve(null)
    })

    await visiblePromise

    await this.script();
  }

  public createVideoPlane(videoSrc: string, width: number = 10, height: number = 6): THREE.Mesh {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide
    });

    const videoPlane = new THREE.Mesh(planeGeometry, planeMaterial);

    return videoPlane;
  }
}