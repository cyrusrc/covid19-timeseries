import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

enum Views {
  Table = "Table",
  Chart = "Chart"
}

function updateQueryString(state) {
  const params = new URLSearchParams();
  for (const id of state.selection.regions) {
    params.append("region", id);
  }
  window.history.replaceState(
    {},
    "",
    `${document.location.pathname}?${params}`
  );
}

export default new Vuex.Store({
  state: {
    ui: {
      view: Views.Chart
    },
    controls: {
      views: Object.keys(Views)
    },
    selection: {
      regions: []
    },
    data: []
  },
  mutations: {
    setView(state, view: Views) {
      state.ui.view = view;
    },
    setSelectedRegions(state, values) {
      state.selection.regions = values;
      updateQueryString(state);
    },
    setData(state, data) {
      const filtered = data.filter(region => {
        return region.meta.taxonomy == "country";
      });
      const sorted = filtered.sort((a, b) => {
        const casesA = a.dates[a.latest["cases"]].value["cases"];
        const casesB = b.dates[b.latest["cases"]].value["cases"];
        return casesB - casesA;
      });
      state.data = sorted;
    }
  },
  actions: {},
  modules: {},
  strict: true
});
