import { Character, type CharacterConstructorParams } from "./base";

export class Lariska extends Character {
  constructor({scene}: CharacterConstructorParams) {
    super({scene})
  }

  protected getFilePath(): string {
      return "/lariska_standing.glb"
  }

  protected async script(): Promise<void> {
    console.log(this.model?.userData)
  }
}
