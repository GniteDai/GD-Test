<template>
  <div class="reSize-Board-outer">
    <div class="reSize-Board-inner">
      <div class="input-row-outer">
        <h2>Row</h2>
        <el-input-number v-model="row" @change="setSizeChange" @mouseenter.native="setDisabled" :min="10" :max="100" :disabled="button_disabled" label="Row" />
      </div>
      <div class="input-column-outer">
        <h2>Column</h2>
        <el-input-number v-model="column" @change="setSizeChange" @mouseenter.native="setDisabled" :min="10" :max="100" :disabled="button_disabled" label="Column" />
      </div>
      <div class="input-row-outer">
        <h2>Speed</h2>
        <select @change="setSpeed" v-model="speed" @mouseenter.native="setDisabled" :disabled="button_disabled">
          <option value="fast">fast</option>
          <option value="average">average</option>
          <option value="slow">slow</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['board'],
  data(){
    return{
      row: 0,
      column: 0,
      speed: '',
      button_disabled: false
    }
  },
  created(){},
  mounted(){
    this.row = this.board.row
    this.column = this.board.column
    this.speed = this.board.speed
  },
  methods: {
    setSizeChange(){
      if(!this.board.buttonsOn){
        this.$emit('setSize', this.row, this.column)
      }
    },
    setDisabled(){
      if(this.board.buttonsOn){
        this.button_disabled = true
      }else{
        this.button_disabled = false
      }
    },
    setSpeed(){
      if(!this.board.buttonsOn){
        this.$emit('setSpeed', this.speed)
      }
    }
  }
}
</script>

<style>
</style>

<style scoped>
  .reSize-Board-outer {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0 0 1%;
  }
  .reSize-Board-inner {
    display: flex;
    justify-content: center;
    align-items: center;

    color: wheat;
    text-align: center;
  }
  .input-row-outer {
    padding: 0 2.5%;
  }
  .input-column-outer {
    padding: 0 2.5%;
  }
</style>
