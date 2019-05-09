import Schedule from '../model/Schedule';
import Util from './util';
import Vue from 'vue';

export interface OptimizationResult {
  score: number;
  isOptimal: boolean;
  schedule: Array<number | undefined>;
}

export default class Annealer {
  public running = false;
  public bestResult: OptimizationResult | undefined;

  private schedule: Schedule;
  private iters = 0;
  private maxIters = 1000;

  constructor(schedule: Schedule, opts: { maxIters: number }) {
    this.schedule = schedule;
    this.maxIters = opts.maxIters;
  }

  public clear() {
    // For reasons unknown, Vue doesn't pick up direct assignment
    // to this.bestResult here, even though it does below in step()
    Vue.set(this, 'bestResult', undefined);
  }

  public toggle() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    if (this.bestResult && this.bestResult.isOptimal) {
      stop();
      return;
    }

    this.running = true;
    this.iters = 0;
    this.step();
  }

  public stop() {
    this.running = false;
    if (this.bestResult) {
      this.bestResult.schedule.forEach((timeslotID, index) => {
        this.schedule.sessions[index].timeslotID = timeslotID;
      });
    }
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
    if (!this.bestResult || score > this.bestResult.score) {
      this.bestResult = {
        score,
        isOptimal: this.schedule.isOptimal(),
        schedule: this.extractTimeslotIDs(),
      };
      if (this.bestResult.isOptimal || false) {
        this.stop();
        return;
      }
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
