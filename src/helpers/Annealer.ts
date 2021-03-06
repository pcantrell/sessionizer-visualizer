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
  private maxIters = 0;
  private maxIterCycleStart = 50;
  private maxIterCycleEnd = 5000;

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
    this.maxIters = this.maxIterCycleStart;
    this.startNextCycle();
  }

  private startNextCycle() {
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
    } else if (!this.shouldTransition(prevScore, score)) {
      session.timeslotID = prevTimeslotID;
    }

    this.iters += 1;
    if (this.iters > this.maxIters) {
      this.stop();

      this.maxIters = Math.round(this.maxIters * 3 / 2);
      if (this.maxIters > this.maxIterCycleEnd) {
        while (this.maxIters > this.maxIterCycleStart) {
          this.maxIters = Math.round(this.maxIters / 2);
        }
        this.maxIters *= 2;
      }

      this.startNextCycle();
    }
    setTimeout(() => this.step(), 1);
  }

  private get currentTemperature(): number {
    return Math.exp(-this.iters / this.maxIters * 10);
  }

  private shouldTransition(oldScore: number, newScore: number): boolean {
    return Math.exp((newScore - oldScore) / this.currentTemperature) > Math.random();
  }

  public extractTimeslotIDs() {
    return this.schedule.sessions.map((s) => s.timeslotID);
  }
}
