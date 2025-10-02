import { Character, type CharacterConstructorParams } from "./base";

export class Lariska extends Character {
  constructor({scene, markerController, dispatchEvent}: CharacterConstructorParams) {
    super({scene, markerController, dispatchEvent})
  }

  protected getFilePath(): string {
      return "/lariska_standing.glb"
  }

  public laughAgain() {
    const audio = new Audio('/audio/lariska_laugh.mp3')
    audio.play()
  }

  protected async script(): Promise<void> {
    const stop = await this.runAnimation("Armature|Idle|baselayer")

    const audio = new Audio('/audio/lariska_laugh.mp3')
    audio.play()

    this.dispatchEvent("singStarted", null)

    // stop()
  }
}
