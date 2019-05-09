import Session from './Session';
import Participant from './Participant';
import Util from '../helpers/util';

export default class Schedule {
  public participants: Participant[];
  public sessions: Session[];
  public timeslots: string[];

  constructor(opts: { participants: string[], sessions: string[], timeslots: string[] }) {
    this.participants = opts.participants.map((name) => new Participant(name));
    this.sessions = opts.sessions.map((name) => new Session(name));
    this.timeslots = opts.timeslots;
  }

  // –––––– Test data generation ––––––

  public randomizeSlots() {
    for (const session of this.sessions) {
      session.timeslotID = Math.floor(Math.random() * this.timeslots.length);
    }
  }

  public randomizeVotes() {
    for (const participant of this.participants) {
      const threshold = Math.random() * 0.5 + 0.1;
      participant.votes = this.sessions
        .map((s, index) => index)
        .filter((x) => Math.random() < threshold);
    }
  }

  public randomizeRanks() {
    for (const participant of this.participants) {
      Util.shuffle(participant.votes);
    }
  }

  public clear() {
    for (const session of this.sessions) {
      session.timeslotID = undefined;
    }
    for (const participant of this.participants) {
      participant.votes = [];
    }
  }

  // –––––– Analysis ––––––

  // Returns an array with one entry for each timeslot, containing the participant's
  // voted session in that slot.
  //
  public groupedSessions(participant: Participant): Session[][] {
    const results: Session[][] = this.timeslots.map((_) => []);
    for (const sessionIndex of participant.votes) {
      const session = this.sessions[sessionIndex];
      if (session && session.timeslotID !== undefined) {
        results[session.timeslotID].push(session);
      }
    }
    return results;
  }

  public voteCount(sessionID: number): number {
    return this.participants
      .filter((participant) => participant.votes.includes(sessionID))
      .length;
  }

  public isOptimal(): boolean {
    for (const participant of this.participants) {
      let min = Infinity;
      let max = 0;
      for (const sessionGroup of this.groupedSessions(participant)) {
        min = Math.min(min, sessionGroup.length);
        max = Math.max(max, sessionGroup.length);
        if (max - min > 1) {
          return false;
        }
      }
    }
    return true;
  }

  // –––––– Scoring ––––––

  public naiveScore(participant: Participant): number {
    return this.groupedSessions(participant).filter((a) => a.length > 0).length;
  }

  public naivePercent(participant: Participant): number {
    return Math.round(
      this.naiveScore(participant) / participant.votes.length * 100);
  }

  public shapeScore(participant: Participant): number | null {
    //       2 * k / (size.to_f * (k + 1))
    const sessionCount = participant.votes.length;
    if (sessionCount === 0) {
      return null;
    }

    let total = 0;
    for (const sessionGroup of this.groupedSessions(participant)) {
      total += 2 * sessionGroup.length / (sessionCount * (sessionGroup.length + 1));
    }
    return total;
  }

  public averageScore(metric: (p: Participant) => number | null): number | null {
    let sum = 0;
    let count = 0;
    for (const participant of this.participants) {
      const value = metric.bind(this)(participant);
      if (value && !isNaN(value)) {
        sum += value;
        count += 1;
      }
    }
    return (count === 0) ? null : sum / count;
  }
}
