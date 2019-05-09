<template>
  <table :class="{ 'schedule-grid': true, 'focus-enabled': focus }">

    <!-- Session header row -->

    <tr class="top-header">
      <td class="placeholder"></td>
      <th v-for="session in schedule.sessions">
          {{session.name}}
      </th>
    </tr>

    <!-- Timeslot assignments -->

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

    <!-- Session header row again -->

    <tr class="top-header">
      <td class="placeholder"></td>
      <th v-for="session, sessionID in schedule.sessions"
            :class="{ focused: isSessionFocused(sessionID) }">
          {{session.name}}
      </th>
    </tr>

    <!-- Votes and scores -->

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

    <!-- Totals votes and scores -->

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
          <div class="best" v-if="optimizerResult">
            <div class="side-label">
              {{ optimizerResult.isOptimal ? "Found optimal" : "Best so far" }}:
            </div>
            <div :class="{ 'score': true, 'new-best-score': newBestScore }">
              {{ formatFixed(optimizerResult.score, 3) }}
            </div>
          </div>
        </td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import Schedule    from '../model/Schedule';
import Session     from '../model/Session';
import Participant from '../model/Participant';
import Options     from '../model/Options';

import OptimizationResult from '../helpers/Annealer';

@Component
export default class ScheduleGrid extends Vue {
  @Prop() private schedule!: Schedule;
  @Prop() private options!: Options;
  @Prop() private optimizerResult: OptimizationResult | undefined;

  private focus: Participant | null = null;

  private newBestScore = false;

  public toggleFocus(participant: Participant) {
    this.focus =
      (this.focus === participant)
        ? null
        : participant;
  }

  public isSessionFocused(sessionID: number): boolean {
    return this.focus && this.focus.votes.includes(sessionID) || false;
  }

  public formatFixed(value: number | null | undefined, precision: number) {
    if (value) {
      return value.toFixed(precision);
    }
  }

  @Watch('optimizerResult')
  public onNewBestScore(newValue: any, oldValue: any) {
    if (oldValue && newValue) {
      this.newBestScore = false;
      setTimeout(() => this.newBestScore = true, 0.01);
    }
  }
}
</script>

<style scoped lang="scss">
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
      width: 10em;
      margin-left: -10em;
      position: relative;
      left: -1em;
    }
    .score {
      display: inline-block;
    }
    .new-best-score {
      animation: new-best-score-fade 1s;
      border-radius: 1ex
    }

    @keyframes new-best-score-fade {
      0% {
        color: #55cc33;
        transform: scale(1);
      }
      3% {
        transform: scale(1.2, 1.4);
      }
      40% {
        transform: scale(1);
      }
      100% {
        color: default;
      }
    }
  }

  .schedule-grid.focus-enabled {
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

</style>
