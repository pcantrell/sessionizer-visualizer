<template>
  <div id="app">

    <ScheduleGrid
      :schedule="schedule"
      :options="options"
      :annealerBestScore="annealer.bestScore" />

    <ComplaintPairs
      :schedule="schedule"
      :options="options" />

    <div class="control-panel">
      <button @click="schedule.clear()">clear</button>
      <button @click="schedule.randomizeSlots()">rand slots</button>
      <button @click="schedule.randomizeVotes()">rand votes</button>
      <Toggle v-model="options.showPairs" label="pairs" />
      <Toggle v-model="options.showNaiveScores" label="naive" />
      <Toggle v-model="options.showFocusedShape" label="focused shape" />
      <Toggle v-model="options.showMiniShapes" label="mini shapes" />
      <Toggle v-model="options.showRanking" label="focused rank" />
      <button @click="schedule.randomizeRanks()">rand rank</button>
      <Toggle v-model="options.showShapeScores" label="scores" />
      <button @click="annealer.toggle()" :class="{ running: annealer.running }">anneal</button>
    </div>

    <div class="hints">
      <div class="hint">Click on the lower grid to vote for sessions.</div>
      <div class="hint">Click on the upper grid to schedule sessions.</div>
      <div class="hint">Click a name to focus / unfocus on that participant’s schedule.</div>
      <div class="hint">Click “rand slots” and “rand votes” below to generate random schedule/votes.</div>
      <div class="hint">Use checkboxes below to analyze the schedule in different ways.</div>
      <div class="hint">(Note: “focused shape and “focused rank” are only visible when you select a person.)</div>
      <div class="hint">Click “anneal” for a dramatic reenactment of the scheduler in action. Click again to stop.</div>
      <div class="hint">(This visualization uses a simplified but representative version of the actual algorithm.)</div>
    </div>

    <div class="links">
      <div class="link">
        <a href="https://github.com/pcantrell/sessionizer-visualizer">Source code for this visualization</a>
      </div>
      <div class="link">
        <a href="https://youtu.be/QsMWMRzBsG0?t=23">Paul’s 2014 talk on scheduling with simulated annealing</a>
        (uses the “naive” scoring below)
      </div>
      <div class="link">
        Paul’s 2019 talk on scheduler improvements, where this visualization originates: <b>forthcoming!</b>
      </div>
      <div class="link">
        <a href="https://sessions.minnestar.org">The real-life Minnebar sessionizer</a>
        and
        <a href="https://sessions.minnestar.org/schedule?force=1">a generated schedule</a>
      </div>
      <div class="link">
        <a href="https://github.com/minnestar/sessionizer">Sessionizer source code</a>
      </div>
      <div class="link">
        <a href="https://github.com/minnestar/sessionizer/tree/master/src/lib/scheduling">Source code for the real-life scheduler</a>
        (warning: may cause eye bleed)
      </div>
    </div>

    <div class="opsipod">
      <a class="imglink" href="https://innig.net">
        <div class="innig-logo-mini"></div>
      </a>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import ScheduleGrid   from './components/ScheduleGrid.vue';
import ComplaintPairs from './components/ComplaintPairs.vue';
import Toggle         from './components/Toggle.vue';

import Schedule from './model/Schedule';
import Options  from './model/Options';

import Annealer from './helpers/Annealer';

@Component({
  components: {
    ScheduleGrid,
    ComplaintPairs,
    Toggle,
  },
})

export default class App extends Vue {
  public schedule = new Schedule({
    participants: [
      "Sally",
      "Fred",
      "Irene",
      "Harry",
      "Prudence",
      "Juan",
      "Vicky",
      "Yusuf",
      "Alvin",
    ],

    sessions: [
      "👻",
      "👾",
      "🦷",
      "👣",
      "🧚🏽‍♀️",
      "🐋",
      "🌈",
      "🌮",
      "🧿",
      "🧷",
      "💃🏻",
      "🧩",
    ],

    timeslots: ["1:00", "2:00", "3:00", "4:00"],
  });

  public options = new Options();

  public annealer = new Annealer(this.schedule, { maxIters: 1000 });

  constructor() {
    super();
    setTimeout(
      () => { // To prepopulate things for quick testing:
        // this.schedule.randomizeSlots();
        // this.schedule.randomizeVotes();
        // this.schedule.randomizeRanks();
        // this.options.showNaiveScores = true;
        // this.options.showFocusedShape = true;
        // this.options.showMiniShapes = true;
        // this.options.showPairs = true;
        // this.options.showRanking = true;
        // this.options.showShapeScores = true;
      }, 0.2);
  }

  @Watch('schedule.participants', { deep: true })
  public onVotesChanged(newValue: number, oldValue: number) {
    this.annealer.clear();
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 1em;
    font-size: 12px;
  }

  body {
    padding-bottom: 4em;
  }

  a {
    text-decoration: none;
  }

  .control-panel {
    $color: black;
    $font-size: 12px;

    position: fixed;
    bottom: -1px;
    left: -1px;
    background: white;
    border: 0.5px solid rgba(0,0,0,0.5);
    box-shadow: 0px 0px 24px rgba(0,0,0,0.07);
    border-top-right-radius: 4px;
    font-size: $font-size;
    padding: 6px;
    color: $color;

    label {
      margin-left: 1px;
      margin-right: 1ex;
    }

    button {
      color: $color;
      font-size: $font-size;
      position: relative;
      margin-right: 1ex;
      background: white;
      border: 0.5px solid #888;
      border-radius: 1ex;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.15);
      &:active {
        background: #ccc;
      }
      &.running {
        background: #108800;
        color: white;
        font-weight: bold;
        border-color: black;
        &:active {
          background: #444;
        }
      }
    }
  }

  .hints, .links {
    margin: 2em;
  }

  .links {
    .link {
      margin-top: 0.5em;
    }
  }

  .opsipod {
    position: fixed;
    right: 12px;
    bottom: 0px;
    .innig-logo-mini {
      content: "";
      display: inline-block;
      background-image: url("https://innig.net/images/innig_FFFFFF@2x.png");
      background-size: 100%;
      background-repeat: no-repeat;
      width: 25px;
      height: 47px;
    }
  }
</style>
