import Schedule from '../model/Schedule';
import Util from './util';

export default class Annealer {

  public running = false;
  public bestScore = 0;
  public bestSchedule: Array<number | undefined> = [];

  private schedule: Schedule;
  private iters = 0;
  private maxIters = 1000;

  constructor(schedule: Schedule, opts: { maxIters: number }) {
    this.schedule = schedule;
    this.maxIters = opts.maxIters;
  }

  public clear() {
    this.bestScore = 0;
    this.bestSchedule = [];
  }

  public toggle() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    this.running = true;
    this.bestScore = this.schedule.averageScore(this.schedule.shapeScore) || 0;
    this.bestSchedule = this.extractTimeslotIDs();
    this.iters = 0;
    this.step();
  }

  public stop() {
    this.running = false;
    this.bestSchedule.forEach((timeslotID, index) => {
      this.schedule.sessions[index].timeslotID = timeslotID;
    });
    return;
  }

  public step() {
    if (!this.running) {
      return;
    }

    const prevScore = this.schedule.averageScore(this.schedule.shapeScore) || 0;
    const session = Util.sample(this.schedule.sessions);
    const prevTimeslotID = session.timeslotID;
    session.timeslotID = Util.randomIntLessThan(this.schedule.timeslots.length);

    const score = this.schedule.averageScore(this.schedule.shapeScore) || 0;
    if (score > this.bestScore) {
      this.bestScore = score;
      this.bestSchedule = this.extractTimeslotIDs();
    } else if (score < prevScore && Math.random() < this.iters / this.maxIters) {
      session.timeslotID = prevTimeslotID;
    }

    this.iters += 1;
    if (this.iters > this.maxIters) {
      this.stop();
      this.start();
    }
    setTimeout(() => this.step(), 1);
  }

  public extractTimeslotIDs() {
    return this.schedule.sessions.map((s) => s.timeslotID);
  }
}
