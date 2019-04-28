export default class Session {
  public name: string;
  public timeslotID?: number = undefined;

  constructor(name: string) {
    this.name = name;
  }
}
