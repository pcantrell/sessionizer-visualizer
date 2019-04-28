export default class Participant {
  public name: string;
  public votes: number[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public toggleVote(sessionID: number) {
    if (this.votes.includes(sessionID)) {
      this.votes = this.votes.filter((id) => id !== sessionID);
    } else {
      this.votes.push(sessionID);
    }
  }
}
