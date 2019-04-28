<template>
  <div id="app">

    <div class="schedule">
      <table :class="{ 'schedule-grid': true, 'focus-enabled': focus }">

        <tr class="top-header">
          <td class="placeholder"></td>
          <th v-for="session in schedule.sessions">
              {{session.name}}
          </th>
        </tr>

        <tr v-for="timeslot, timeslotID in schedule.timeslots" class="timeslot">
          <th>{{timeslot}}</th>
          <td v-for="session, sessionID in schedule.sessions"
              :class="{ selected: session.timeslotID === timeslotID,
                        focused: session.timeslotID === timeslotID && isSessionFocused(sessionID) }"
              @click="session.timeslotID = timeslotID">
          </td>

          <td class="focused placeholder" v-if="options.showFocusedShape && focus">
            <div class="big shape-block-row">
              <div class="big shape-block" v-for="session in schedule.groupedSessions(focus)[timeslotID]">
                <div class="ranking" v-if="options.showRanking">
                  {{ focus.votes.indexOf(schedule.sessions.indexOf(session)) + 1 }}
                </div>
              </div>
            </div>
          </td>
        </tr>

        <tr class="top-header">
          <td class="placeholder"></td>
          <th v-for="session, sessionID in schedule.sessions"
                :class="{ focused: isSessionFocused(sessionID) }">
              {{session.name}}
          </th>
        </tr>

        <tr v-for="participant in schedule.participants"
            :class="{ participant: true, focused: focus === participant }">

          <th @click="toggleFocus(participant)">
            {{participant.name}}
          </th>
          <td v-for="session, sessionID in schedule.sessions"
              :class="{ vote: true, selected: participant.votes.includes(sessionID)}"
              @click="participant.toggleVote(sessionID)">
            {{ schedule.timeslots[session.timeslotID] }}
          </td>

          <template v-if="options.showNaiveScores">
            <td class="scoring numeric naive">
              {{ schedule.naiveScore(participant) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              <span v-if="participant.votes.length > 0">
                {{ schedule.naivePercent(participant) }}%
              </span>
            </td>
          </template>

          <td class="scoring" v-if="options.showMiniShapes">
            <div class="small shape-block-row" v-for="timeslot, timeslotID in schedule.timeslots">
              <div class="small shape-block" v-for="session in schedule.groupedSessions(participant)[timeslotID]"/>
            </div>
          </td>

          <template v-if="options.showShapeScores">
            <td class="scoring numeric shape">
              {{ formatFixed(schedule.shapeScore(participant), 3) }}
            </td>
          </template>

        </tr>

        <tr class="totals">
          <td class="placeholder"></td>
          <td v-for="session, sessionID in schedule.sessions">
            {{ schedule.voteCount(sessionID) }}
          </td>

          <template v-if="options.showNaiveScores">
            <td class="scoring numeric naive">
              {{ formatFixed(schedule.averageScore(schedule.naiveScore), 1) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              {{ formatFixed(schedule.averageScore(schedule.naivePercent), 0) }}%
            </td>
          </template>

          <td class="placeholder" v-if="options.showMiniShapes">
          </td>

          <template v-if="options.showShapeScores">
            <td class="scoring numeric shape">
              {{ formatFixed(schedule.averageScore(schedule.shapeScore), 3) }}
              <div class="best" v-if="this.bestScore > 0">
                <div class="side-label">
                  Best:
                </div>
                <div :class="{ 'score': true, 'new-record': newRecord }">
                  {{ formatFixed(this.bestScore, 3) }}
                </div>
              </div>
            </td>
          </template>
        </tr>

      </table>
    </div>

    <div class="complaint-pairs" v-if="options.showPairs">
      <div v-for="participant in schedule.participants">
        <div v-for="sessionGroup in schedule.groupedSessions(participant)">
          <div v-for="session0, index in sessionGroup">
            <div v-for="session1 in sessionGroup.slice(index + 1)" class="complaint">
              ☹️ <b>{{ participant.name }}</b>: {{ session0.name }} vs {{ session1.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="control-panel">
      <button @click="schedule.clear()">clear</button>
      <button @click="schedule.randomizeSlots()">rand slots</button>
      <button @click="schedule.randomizeVotes()">rand votes</button>
      <Toggle v-model="options.showNaiveScores" label="naive" />
      <Toggle v-model="options.showFocusedShape" label="focused shape" />
      <Toggle v-model="options.showMiniShapes" label="mini shapes" />
      <Toggle v-model="options.showPairs" label="pairs" />
      <Toggle v-model="options.showRanking" label="rank" />
      <button @click="schedule.randomizeRanks()">rand rank</button>
      <Toggle v-model="options.showShapeScores" label="scores" />
      <button @click="anneal()">anneal</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Toggle from './components/Toggle.vue';
import Session from './model/Session';
import Participant from './model/Participant';
import Schedule from './model/Schedule';
import Util from './util';

@Component({
  components: {
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
  public focus: Participant | null = null;

  public options = {
    showNaiveScores: false,
    showFocusedShape: false,
    showMiniShapes: false,
    showRanking: false,
    showPairs: false,
    showShapeScores: false,
  };

  private annealing = false;
  private bestScore = 0;
  private bestSchedule!: Array<number | undefined>;
  private newRecord = false;
  private annealingIters = 0;
  private annealingMaxIters = 1000;

  constructor() {
    super();
    setTimeout(
      () => {
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

  public formatFixed(value: number | null | undefined, precision: number) {
    if (value) {
      return value.toFixed(precision);
    }
  }

  public toggleFocus(participant: Participant) {
    this.focus =
      (this.focus === participant)
        ? null
        : participant;
  }

  public isSessionFocused(sessionID: number): boolean {
    return this.focus && this.focus.votes.includes(sessionID) || false;
  }

  public anneal() {
    if (this.annealing) {
      this.annealing = false;
      this.bestSchedule.forEach((timeslotID, index) => {
        this.schedule.sessions[index].timeslotID = timeslotID;
      });
      return;
    }

    this.annealing = true;
    this.bestScore = this.schedule.averageScore(this.schedule.shapeScore) || 0;
    this.bestSchedule = this.extractTimeslotIDs();
    this.annealingIters = 0;
    this.annealStep();
  }

  public annealStep() {
    if (!this.annealing) {
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
    } else if (score < prevScore && Math.random() < this.annealingIters / this.annealingMaxIters) {
      session.timeslotID = prevTimeslotID;
    }

    this.annealingIters += 1;
    if (this.annealingIters > this.annealingMaxIters) {
      this.anneal();
      this.anneal();
    }
    setTimeout(this.annealStep, 1);
  }

  public extractTimeslotIDs() {
    return this.schedule.sessions.map((s) => s.timeslotID);
  }

  @Watch('bestScore')
  public onNewBestScore(newValue: number, oldValue: number) {
    if (oldValue) {
      window.console.log("new record", newValue);
      this.newRecord = false;
      setTimeout(() => this.newRecord = true, 0.01);
    }
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

.schedule-grid {
    td, th {
      cursor: pointer;
      -webkit-user-select: none;
    }
    td {
        padding: 0;
        margin: 0;
        background: #eee;
    }
    td.placeholder {
      background: none;
    }
    th {
      text-align: right;
    }
    .top-header th, td {
      text-align: center;
    }
    td {
      height: 3em;
    }
    .top-header th {
      width: 2em;
      font-size: 200%;
    }
    th {
      padding-right: 1ex;
    }
    .top-header th {
      padding-right: 0;
    }
    .timeslot .selected {
        background: #00BB33;
    }
    .participant .vote {
      color: #eee;
    }
    .participant .vote.selected {
        background: #8800FF;
        color: white;
    }
    .totals td,
    td.scoring {
      background: none;
      height: 0;
      font-size: 1.5em;
    }
    td.scoring {
      font-weight: bold;
      &.numeric {
        padding-left: 1ex;
        text-align: right;
      }
      &.naive-percent {
        width: 2.75em;
      }
    }
    .totals td {
      padding-top: 0.5em;
      position: relative;
      top: -3px;
      vertical-align: top;
      &.scoring {
        border-top: 0.5px solid #bbb;
      }
    }
    .best {
      margin-top: 0.5em;
      .side-label {
        display: inline-block;
        font-weight: normal;
        width: 0;
        position: relative;
        left: -120%;
      }
      .score {
        display: inline-block;
      }
      .new-record {
        animation: new-record-fade 0.5s;
        border-radius: 1ex
      }

      @keyframes new-record-fade {
        0% {
          color: #55cc33;
          transform: scale(1);
        }
        10% {
          transform: scale(1.3, 1.4);
        }
        100% {
          color: default;
          transform: scale(1);
        }
      }

    }
    &.focus-enabled {
      td, th {
        opacity: 0.20;
        filter: saturate(20%);
      }
      .focused th, th.focused,
      .focused td, td.focused {
        opacity: 1;
        filter: none;
      }
    }

  .shape-block-row {
    text-align: left;
    white-space: nowrap;
    width: 1.5em;
    height: 3em;
    padding: 0;
    background: none;
    &.small {
      height: 0.2em;
      margin-left: 0.5em;
      margin-top: 1px;
      position: relative;
      top: -0.9em;
    }
    &.big {
      padding-left: 2em;
      border-left: 1px solid black;
      margin-left: 2em;
      margin-bottom: -0.3em;
      .ranking {
        color: white;
        padding-top: 0.4em;
        text-align: center;
        font-weight: bold;
        font-size: 150%;
      }
    }
  }
  .shape-block {
    display: inline-block;
    margin-right: 1px;
    &.small {
      width: 0.2em;
      height: 0.2em;
      background: black;
    }
    &.big {
      width: 4em;
      height: 3em;
      background: #00BB33;
    }
  }
}

.complaint-pairs {
  position: fixed;
  right: 1em;
  top: 1em;
  width: 12em;
  height: 100%;
  font-size: 120%;
}

.control-panel {
  background: white;
  border: 0.5px solid #ccc;
  border-radius: 3px;
  position: fixed;
  font-size: 9px;
  padding: 3px;
  bottom: -1px;
  left: -1px;
  color: #999;
  label {
    margin-left: 1px;
    margin-right: 1ex;
  }
  button {
    color: #999;
    font-size: 9px;
    position: relative;
    top: -0.2ex;
    margin-right: 1ex;
  }
}

</style>
