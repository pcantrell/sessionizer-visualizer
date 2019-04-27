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

          <template v-if="options.showNaiveScoring">
            <td class="scoring numeric naive">
              {{ naiveScore(participant) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              <span v-if="participant.votes.length > 0">
                {{ naivePercent(participant) }}%
              </span>
            </td>
          </template>
        </tr>

        <tr class="totals">
          <td class="placeholder"></td>
          <td v-for="session, sessionID in schedule.sessions">
            {{ voteCount(sessionID) }}
          </td>

          <template v-if="options.showNaiveScoring">
            <td class="scoring numeric naive">
              {{ averageOverParticipants(naiveScore) }}
            </td>
            <td class="scoring numeric naive naive-percent">
              {{ averageOverParticipants(naivePercent) }}%
            </td>
          </template>
        </tr>

      </table>
    </div>

    <div class="control-panel">
      <button @click="randomizeSlots()">rand slots</button>
      <button @click="randomizeVotes()">rand votes</button>
      <Toggle v-model="options.showNaiveScoring" label="naive" />
      <Toggle v-model="options.showFocusedShape" label="shape" />
      <Toggle v-model="options.showMiniShapes" label="mini" />
      <Toggle v-model="options.showPairs" label="pairs" />
      <Toggle v-model="options.showShapeScores" label="scores" />
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
    participants: ["Sally", "Fred", "Irene", "Harry", "Prudence"].map(makeParticipant),
    sessions: ["👻", "👾", "🦷", "👣", "🧚🏽‍♀️", "🐋", "🌈", "🌮", "🧿", "🧷"].map(makeSession),
    timeslots: ["1:00", "2:00", "3:00", "4:00"],
  };
  public focus: Participant | null = null;

  public options = {
    showNaiveScoring: false,
    showFocusedShape: false,
    showMiniShapes: false,
    showPairs: false,
    showShapeScores: false,
  };

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

  public averageOverParticipants(metric: (p:Participant) => number): number {
    let sum = 0, count = 0;
    for (const participant of this.schedule.participants) {
      const value = metric(participant)
      if (!isNaN(value)) {
        sum += value;
        count += 1;
      }
    }
    return (count === 0) ? undefined : Math.round(sum / count);
  }

  public naiveScore(participant: Participant): number {
    return this.groupedSessions(participant).filter((a) => a.length > 0).length;
  }

  public naivePercent(participant: Participant): number {
    return Math.round(
      this.naiveScore(participant) / participant.votes.length * 100);
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
      visibility: hidden;
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
</style>
