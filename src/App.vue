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
              <div class="big shape-block" v-for="session in groupedSessions(focus)[timeslotID]"/>
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
              @click="toggleVote(participant, sessionID)">
            {{ schedule.timeslots[session.timeslotID] }}
          </td>

          <template v-if="options.showNaiveScores">
            <td class="scoring numeric naive">
              {{ naiveScore(participant) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              <span v-if="participant.votes.length > 0">
                {{ naivePercent(participant) }}%
              </span>
            </td>
          </template>

          <td class="scoring" v-if="options.showMiniShapes">
            <div class="small shape-block-row" v-for="timeslot, timeslotID in schedule.timeslots">
              <div class="small shape-block" v-for="session in groupedSessions(participant)[timeslotID]"/>
            </div>
          </td>

          <template v-if="options.showShapeScores">
            <td class="scoring numeric shape">
              {{ formatFixed(shapeScore(participant), 2) }}
            </td>
          </template>

        </tr>

        <tr class="totals">
          <td class="placeholder"></td>
          <td v-for="session, sessionID in schedule.sessions">
            {{ voteCount(sessionID) }}
          </td>

          <template v-if="options.showNaiveScores">
            <td class="scoring numeric naive">
              {{ formatFixed(averageOverParticipants(naiveScore), 1) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              {{ formatFixed(averageOverParticipants(naivePercent), 0) }}%
            </td>
          </template>

          <td class="placeholder" v-if="options.showMiniShapes">
          </td>

          <template v-if="options.showShapeScores">
            <td class="scoring numeric shape">
              {{ formatFixed(averageOverParticipants(shapeScore), 2) }}
            </td>
          </template>
        </tr>

      </table>
    </div>

    <div class="complaint-pairs" v-if="options.showPairs">
      <div v-for="participant in schedule.participants">
        <div v-for="sessionGroup in groupedSessions(participant)">
          <div v-for="session0, index in sessionGroup">
            <div v-for="session1 in sessionGroup.slice(index + 1)" class="complaint">
              ☹️ {{ participant.name }}: {{ session0.name }} vs {{ session1.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="this.bestScore > 0" class="best-score">
      Best score: {{ this.bestScore }}
    </div>

    <div class="control-panel">
      <button @click="randomizeSlots()">rand slots</button>
      <button @click="randomizeVotes()">rand votes</button>
      <Toggle v-model="options.showNaiveScores" label="naive" />
      <Toggle v-model="options.showFocusedShape" label="focused shape" />
      <Toggle v-model="options.showMiniShapes" label="mini shapes" />
      <Toggle v-model="options.showPairs" label="pairs" />
      <Toggle v-model="options.showShapeScores" label="scores" />
      <button @click="anneal()">anneal</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Toggle from './components/Toggle.vue';

@Component({
  components: {
    Toggle,
  },
})

export default class App extends Vue {
  public schedule = {
    participants: ["Sally", "Fred", "Irene", "Harry", "Prudence", "Juan", "Vicky", "Yusuf", "Alvin"].map(makeParticipant),
    sessions: ["👻", "👾", "🦷", "👣", "🧚🏽‍♀️", "🐋", "🌈", "🌮", "🧿", "🧷", "💃🏻", "🧩"].map(makeSession),
    timeslots: ["1:00", "2:00", "3:00", "4:00"],
  };
  public focus: Participant | null = null;

  public options = {
    showNaiveScores: false,
    showFocusedShape: false,
    showMiniShapes: false,
    showPairs: false,
    showShapeScores: false,
  };

  private annealing = false;
  private bestScore = 0;
  private bestSchedule!: Array<number | undefined>;
  private annealingIters = 0;
  private annealingMaxIters = 1000;

  constructor() {
    super();
    setTimeout(
      () => {
        this.randomizeSlots();
        this.randomizeVotes();
        // this.options.showNaiveScores = true;
        // this.options.showFocusedShape = true;
        // this.options.showMiniShapes = true;
        // this.options.showPairs = true;
        this.options.showShapeScores = true;
      }, 0.2);
  }

  public toggleVote(participant: Participant, sessionID: number) {
    if (participant.votes.includes(sessionID)) {
      participant.votes = participant.votes.filter((id) => id !== sessionID);
    } else {
      participant.votes.push(sessionID);
    }
  }

  public groupedSessions(participant: Participant): Session[][] {
    const results: Session[][] = this.schedule.timeslots.map((_) => []);
    for (const sessionIndex of participant.votes) {
      const session = this.schedule.sessions[sessionIndex];
      if (session.timeslotID != null) {
        results[session.timeslotID].push(session);
      }
    }
    return results;
  }

  public voteCount(sessionID: number): number {
    return this.schedule.participants
      .filter((participant) => participant.votes.includes(sessionID))
      .length;
  }

  public averageOverParticipants(metric: (p: Participant) => number | null): number | null {
    let sum = 0;
    let count = 0;
    for (const participant of this.schedule.participants) {
      const value = metric(participant);
      if (value && !isNaN(value)) {
        sum += value;
        count += 1;
      }
    }
    return (count === 0) ? null : sum / count;
  }

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

  public randomizeSlots() {
    for (const session of this.schedule.sessions) {
      session.timeslotID = Math.floor(Math.random() * this.schedule.timeslots.length);
    }
  }

  public randomizeVotes() {
    for (const participant of this.schedule.participants) {
      const threshold = Math.random() * 0.5 + 0.1;
      participant.votes = this.schedule.sessions
        .map((s, index) => index)
        .filter((x) => Math.random() < threshold);
    }
  }

  public anneal() {
    if (this.annealing) {
      this.annealing = false;
      this.bestSchedule.forEach((timeslotID, index) => {
        this.schedule.sessions[index].timeslotID = timeslotID;
      });
      window.console.log("Reset to", this.bestScore, this.averageOverParticipants(this.shapeScore), JSON.stringify(this.extractTimeslotIDs()));
      return;
    }

    this.annealing = true;
    this.bestScore = this.averageOverParticipants(this.shapeScore) || 0;
    this.bestSchedule = this.extractTimeslotIDs();
    this.annealingIters = 0;
    this.annealStep();
  }

  public randomIntLessThan(max: number): number {
    return Math.floor(Math.random() * max);
  }

  public sample(array: any[]) {
    return array[this.randomIntLessThan(array.length)];
  }

  public annealStep() {
    if (!this.annealing) {
      return;
    }

    const prevScore = this.averageOverParticipants(this.shapeScore) || 0;
    const session = this.sample(this.schedule.sessions);
    const prevTimeslotID = session.timeslotID;
    session.timeslotID = this.randomIntLessThan(this.schedule.timeslots.length);

    const score = this.averageOverParticipants(this.shapeScore) || 0;
    if (score > this.bestScore) {
      window.console.log("New best", score, JSON.stringify(this.extractTimeslotIDs()));
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
}

interface Session {
  name: string;
  timeslotID?: number;
}

interface Participant {
  name: string;
  votes: number[];
}

function makeSession(name: string): Session {
  return {
    name,
    timeslotID: undefined,
  };
}

function makeParticipant(name: string): Participant {
  return {
    name,
    votes: [],
  };
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
  height: 100%;
  font-size: 120%;
}

.control-panel {
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

.best-score {
  margin-top: 2em;
}
</style>
