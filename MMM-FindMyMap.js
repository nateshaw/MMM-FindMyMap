/* MMM-FindMyMap.js - MagicMirror Module */
Module.register("MMM-FindMyMap", {
  defaults: {
    updateInterval: 5 * 60 * 1000, // 5 minutes
    mapCenter: [37.7749, -122.4194], // Default center (San Francisco)
    zoomLevel: 10,
    apiEndpoint: "http://localhost:5000/locations"
  },

  start: function () {
    this.locations = [];
    this.loaded = false;
    this.getLocations();
    setInterval(() => {
      this.getLocations();
    }, this.config.updateInterval);
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.height = "500px";
    wrapper.id = "findmy-map";
    if (!this.loaded) {
      wrapper.innerHTML = "Loading map...";
    }
    return wrapper;
  },

  getLocations: async function () {
    try {
      const response = await fetch(this.config.apiEndpoint);
      const data = await response.json();
      this.locations = data;
      this.loaded = true;
      this.updateMap();
    } catch (error) {
      console.error("MMM-FindMyMap: Failed to fetch locations", error);
    }
  },

  updateMap: function () {
    if (!this.map) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        setTimeout(() => {
          this.map = L.map("findmy-map").setView(this.config.mapCenter, this.config.zoomLevel);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(this.map);
          this.addMarkers();
        }, 500);
      };
      document.body.appendChild(script);
    } else {
      this.addMarkers();
    }
  },

  addMarkers: function () {
    if (!this.map) return;
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    this.locations.forEach(loc => {
      L.marker([loc.lat, loc.lon]).addTo(this.map).bindPopup(loc.name);
    });
  },
});
