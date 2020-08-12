<template>
  <div class="reSize-Board-outer">
    <div class="reSize-Board-inner">
      <div class="input-row-outer">
        <h2>Row</h2>
        <el-input-number v-model="row" @change="reSizeChange" :min="10" :max="100" label="Row" />
      </div>
      <div class="input-column-outer">
        <h2>Column</h2>
        <el-input-number v-model="column" @change="reSizeChange" :min="10" :max="100" label="Column" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['boardRow', 'boardColumn'],
  data(){
    return{
      row: 10,
      column: 10
    }
  },
  created(){
    this.row = this.boardRow
    this.column = this.boardColumn
  },
  mounted(){
  },
  methods: {
    reSizeChange(){
      this.$emit('reSize', this.row, this.column)
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
    margin: 0 0 3%;
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
