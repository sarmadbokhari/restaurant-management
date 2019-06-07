<template>
  <div class="order-map relative">
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    restaurantAddress: "1800 Marine Street, Santa Monica, CA 90405",

    restaurantCoordinates: null,
    destinationCoordinates: null,

    popup: null,
    map: null
  }),
  mounted() {
    this.displayMap();
  },
  methods: {
    async getCoordinates() {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;

      // get coordinates from address
      var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

      const restaurant = await mapboxClient.geocoding
        .forwardGeocode({
          query: this.restaurantAddress,
          autocomplete: false,
          limit: 1
        })
        .send();

      const destination = await mapboxClient.geocoding
        .forwardGeocode({
          query: this.order.destination,
          autocomplete: false,
          limit: 1
        })
        .send();

      this.restaurantCoordinates = restaurant.body.features[0];

      this.destinationCoordinates = destination.body.features[0];
    },
    async displayMap() {
      if (!this.restaurantCoordinates || !this.destinationCoordinates) {
        await this.getCoordinates();
      }

      // build map
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: this.destinationCoordinates.center,
        zoom: 10
      });

      // destination popup
      this.popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(this.destinationCoordinates.center)
        .setHTML(
          `<h1>${this.order.name}</h1><p>${this.order.currentStatus}</p>`
        )
        .addTo(this.map);

      // restaurant popup
      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(this.restaurantCoordinates.center)
        .setHTML(`<h1>Restaurant</h1>`)
        .addTo(this.map);
    }
  },
  watch: {
    order: {
      deep: true,
      handler: async function(newVal) {
        // when status of order changes remove old popup and update with new order status
        this.popup.remove();

        this.popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(this.destinationCoordinates.center)
          .setHTML(`<h1>${this.order.name}</h1><p>${newVal.currentStatus}</p>`)
          .addTo(this.map);
      }
    }
  }
};
</script>

<style scoped>
#inputs,
#errors,
#directions {
  position: absolute;
  width: 33.3333%;
  max-width: 300px;
  min-width: 200px;
}

#inputs {
  z-index: 10;
  top: 10px;
  left: 10px;
}

#directions {
  z-index: 99;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

#errors {
  z-index: 8;
  opacity: 0;
  padding: 10px;
  border-radius: 0 0 3px 3px;
  background: rgba(0, 0, 0, 0.25);
  top: 90px;
  left: 10px;
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
