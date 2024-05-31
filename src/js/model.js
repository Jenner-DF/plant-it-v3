import {
  API_KEY,
  RESULTS_PER_PAGE,
  API_URL_PLANT_LIST,
  API_URL_PLANT_DETAILS,
  API_URL_PLANT_CARE_GUIDE,
} from "./config.js";
import { getJSON, removePremiumPlants } from "./helpers.js";
export const state = {
  plant: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export const loadPlant = async function (id) {
  try {
    const data = await getJSON(`${API_URL_PLANT_DETAILS}/${id}?key=${API_KEY}`);
    const data_careGuide = await getJSON(
      `${API_URL_PLANT_CARE_GUIDE}?species_id=${id}&key=${API_KEY}`
    );
    const plant = data;
    const [careGuide] = data_careGuide.data;
    console.log("😂😂😂😂😂asd😂", plant);
    state.plant = {
      id: plant.id,
      commonName: plant.common_name,
      scientificName: plant.scientific_name[0],
      image: plant.default_image.original_url,
      cycle: plant.cycle,
      watering: plant.watering,
      sunlight: plant.sunlight,
      description: plant.description ? plant.description : "No Data Available.",
      origin: plant.origin,
      type: plant.type,
      indoor: plant.indoor ? "Yes" : "No",
      careLevel: plant.care_level,
    };
    state.plant.careGuide = {
      watering: careGuide.section[0].description,
      sunlight: careGuide.section[1].description,
      pruning: careGuide.section[2].description,
    };
    console.log("😁😁😁😁😁", state.plant);
    if (state.bookmarks.some((bmarked) => bmarked.id === +id))
      state.plant.bookmarked = true;
    else state.plant.bookmarked = false;
    console.log(state.bookmarks);
  } catch (error) {
    throw error;
  }
};
export const loadSearchResults = async function (userQuery) {
  try {
    state.search.query = userQuery;
    const data = await getJSON(
      `${API_URL_PLANT_LIST}?key=${API_KEY}&q=${userQuery}`
    );
    const data2 = removePremiumPlants(data.data);
    state.search.results = data2.map((plant) => {
      return {
        id: plant.id,
        commonName: plant.common_name,
        scientificName: plant.scientific_name[0],
        image: plant.default_image.original_url,
      };
    });
    console.log("😋😋😋😋", state.search.results);
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.plant.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.plant.servings;
  });
  state.plant.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (plant) {
  //add bookmark
  state.bookmarks.push(plant);
  //mark current recipe as bookmark
  if (plant.id === state.plant.id) state.plant.bookmarked = true;
  storeBookmarks();
};
export const deleteBookmark = function (id) {
  console.log(id);
  console.log(state.plant);

  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.plant.id) state.plant.bookmarked = false;
  storeBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  console.log(JSON.parse(storage));
  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();
init();
