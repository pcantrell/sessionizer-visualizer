<template>
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import Schedule    from '../model/Schedule';
import Session     from '../model/Session';
import Participant from '../model/Participant';
import Options     from '../model/Options';

@Component
export default class ComplaintPairs extends Vue {
  @Prop() private schedule!: Schedule;
  @Prop() private options!: Options;
}
</script>

<style scoped lang="scss">
  .complaint-pairs {
    position: fixed;
    right: 1em;
    top: 1em;
    width: 12em;
    height: 100%;
    font-size: 120%;
  }
</style>
