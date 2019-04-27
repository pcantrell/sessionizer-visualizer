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

          <td class="scoring numeric naive">
            {{ naiveScore(participant) }}
          </td>
          <td class="scoring numeric naive naive-percent">
            <span v-if="participant.votes.length > 0">
              {{ naivePercent(participant )}}%
            </span>
          </td>
        </tr>

      </table>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})

export default class App extends Vue {
  public schedule = {
    participants: ["Sally", "Fred", "Irene", "Harry", "Prudence"].map(makeParticipant),
    sessions: ["👻", "👾", "🦷", "👣", "🧚🏽‍♀️", "🐋", "🌈", "🌮", "🧿", "🧷"].map(makeSession),
    timeslots: ["1:00", "2:00", "3:00", "4:00"],
  };
  public focus?: Participant = this.schedule.participants[2];

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

  public naiveScore(participant: Participant): number {
    return this.groupedSessions(participant).filter((a) => a.length > 0).length;
  }

  public naivePercent(participant: Participant): number {
    return Math.round(
      this.naiveScore(participant) / participant.votes.length * 100);
  }

  public toggleFocus(participant: Participant) {
    if (this.focus === participant) {
      this.focus = undefined;
    } else {
      this.focus = participant;
    }
  }

  public isSessionFocused(sessionID: number): boolean {
    return this.focus && this.focus.votes.includes(sessionID) || false;
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
    timeslotID: Math.floor(Math.random() * 4), // undefined,
  };
}

function makeParticipant(name: string): Participant {
  return {
    name,
    votes: [0,1,2,3,4,5,6,7,8,9].filter((x) => Math.random() < 0.3) // [],
  };
}

</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 12px;
}

.schedule-grid {
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
    td.scoring {
      background: none;
      padding-left: 1ex;
      height: 0;
      font-weight: bold;
      font-size: 1.5em;
      &.numeric {
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
</style>
