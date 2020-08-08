<template>
  <div>
    <head>
      <link href='https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css' rel='stylesheet' />
    </head>
    <div id="map" />
    <div class="menu">
      <div>menu</div>
      <br>
      <a href="">Go Index</a>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
export default {
  props: ['panel', 'map_height'],
  data(){
    return{
      map: null,
    }
  },
  mounted(){
    this.createdMap();
  },
  methods: {
    createdMap(){
      mapboxgl.accessToken = 'pk.eyJ1IjoiZ25pdGVkYWkiLCJhIjoiY2tkbHU2c2VqMHQweTJzbDU0cmZiMGloNCJ9.oRP8xcUg8Tadsf0tAeYrRQ';
      this.map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v10', // stylesheet location
        center: [121.545968, 25.02978], // starting position [lng, lat]
        zoom: 9, // starting zoom
        antialias: true
      });
      this.map.addControl(new mapboxgl.ScaleControl());
    },
    async waitMapLoaded(){
      while (this.map.loaded() !== true) {
        await Timeout.set(1000)
      }
    }
  }
}
</script>

<style>
	
</style>

<style scoped>
  #map { 
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .menu {
    position: absolute;
    background: black;
    padding: 1% 2%;
    color: white;
    text-align: center;
  }
  a {
    color: white;
    text-decoration: none;
  }
  a:hover 
  {
    color:orange;
    text-decoration:none;
    cursor:pointer;
    background-color: green;
  }
</style>
