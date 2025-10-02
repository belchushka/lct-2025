import { Character, type CharacterConstructorParams } from "./base";

export class Gena extends Character {
  constructor({scene}: CharacterConstructorParams) {
    super({scene})
  }

  protected getFilePath(): string {
      return "/gena.glb"
  }

  protected async script(): Promise<void> {
    console.log(this.model?.userData)
  }
}
