import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

export type CharacterConstructorParams = {
  scene: THREE.Group
}

export abstract class Character {
  public scene: THREE.Group;
  public model: GLTF | null = null
  private modelLoadedPromise: Promise<void> | null = null
  private modelLoadedResolve: (()=>void) | null = null

  constructor({ scene }: CharacterConstructorParams) {
    this.scene = scene

    this.modelLoadedPromise = new Promise((res)=>{
      this.modelLoadedResolve = res
    })

    this.loadModel()
  }

  private loadModel(): void {
    const path = this.getFilePath()
    const loader = new GLTFLoader();
    loader.load(path, (model: GLTF)=>{
      this.model = model
      if (this.modelLoadedResolve != null) this.modelLoadedResolve()

      this.scene.add(model.scene)
    })
  }

  protected abstract getFilePath(): string;

  protected abstract script(): Promise<void>;

  public async run() {
    await this.modelLoadedPromise

    await this.script()
  }
}
