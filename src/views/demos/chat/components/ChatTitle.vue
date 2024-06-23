<script setup lang="ts">

  import { useChatStore } from '../chatStore'
  import { useAi00Store } from "@/ai00sdk/ai00Store";

  const ChatStore = useChatStore()
  const ai00Store = useAi00Store();

</script>

<template>
  <v-card class="mx-auto bg-primary titles"  width="100%"  :title="ChatStore.chatHistory.ai.name" >
    <template #subtitle>
      <v-row no-gutters>
          <v-col cols="5" >
            AI00 chat mode
          </v-col>
          <v-col cols="5">


          </v-col>

        </v-row>
        <v-row no-gutters>
          <v-col cols="12" >
            <p> {{ ChatStore.Model }} (Q-{{ ai00Store.quant_type == "None"? "FP16" : ai00Store.quant_type }} {{ ai00Store.quant == 0 ?'':'; L-'+ai00Store.quant }} )</p>
          </v-col>


        </v-row>

    </template>

    <v-avatar :image="ChatStore.chatHistory.ai.avatar" class="aitou" size="100" data-html2canvas-ignore></v-avatar>
  </v-card>
  <v-avatar :image="ChatStore.chatHistory.me.avatar" class="mytou"  size="100"  data-html2canvas-ignore></v-avatar>
  <div class="options" v-if="ChatStore.SamplerType == 'Mirostat'">
    Sampler: {{ ChatStore.SamplerType }} <br/>
    Tau: {{ ChatStore.Sampler_Mirostat.tau }}; rate: {{ ChatStore.Sampler_Mirostat.rate }}<br/>

  </div>
  <div class="options" v-if="ChatStore.SamplerType == 'Nucleus'">
    Sampler: {{ ChatStore.SamplerType }} <br/>
    Top_p: {{ ChatStore.Sampler_Nucleus.top_p }}; Top_k: {{ ChatStore.Sampler_Nucleus.top_k }}; Temp: {{ ChatStore.Sampler_Nucleus.temperature }}; PP: {{ ChatStore.Sampler_Nucleus.presence_penalty }}; FP: {{ ChatStore.Sampler_Nucleus.frequency_penalty}}; HL: {{ ChatStore.Sampler_Nucleus.penalty }} <br/>

  </div>
  <div class="options" v-if="ChatStore.SamplerType == 'Typical'">
    Sampler: {{ ChatStore.SamplerType }} <br/>
    Top_k: {{ ChatStore.Sampler_Typical.top_k }}; Tau: {{ ChatStore.Sampler_Typical.tau }}; Temp: {{ ChatStore.Sampler_Nucleus.temperature }}; PP: {{ ChatStore.Sampler_Nucleus.presence_penalty }}; FP: {{ ChatStore.Sampler_Nucleus.frequency_penalty}}; HL: {{ ChatStore.Sampler_Nucleus.penalty }} <br/>

  </div>
  <div class="myname"> {{  ChatStore.chatHistory.me.name }}</div>
</template>

<style scoped lang="scss">
.options{
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: rgb(var(--v-theme-primary));
}
.titles{
  padding-bottom: 60px;
  clip-path: polygon(
	    0 0,
	    0 100%,
	    -10% 100%,
	    100% calc(100% - 50px),
	    100% 0,
	);
}
.aitou{
  position:absolute;
  bottom: -20px;
  animation: shake 2s infinite;
  transform-origin: center;

}
.mytou{
  position:absolute;
  top: 50px;
  right: 20px;
  background-color: #f8f8f8;
  z-index: 10;
  transform:rotate(10deg);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
    transform: rotate(-10deg);
  }

  20%, 80% {
    transform: translate3d(4px, 10px, 10px);

  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
    transform: rotate(-10deg);
  }
}

.myname{
  position: absolute;
  right: 10px;
  top: 160px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  width: 120px;
  color: rgb(var(--v-theme-primary));
}
</style>
