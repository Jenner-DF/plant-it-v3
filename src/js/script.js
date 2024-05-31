import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  API_KEY,
  RESULTS_PER_PAGE,
  API_URL_PLANT_LIST,
  API_URL_PLANT_DETAILS,
  API_URL_PLANT_CARE_GUIDE,
} from "./config.js";
import { getJSON, removePremiumPlants } from "./helpers.js";
import Plant from "./plant.js";
// const search = document.querySelector('submit');
feather.replace();
const main = document.querySelector(".main");
const nav_mob = document.querySelector(".nav__mobile");
const header = document.querySelector(".header");
const searchbar = document.querySelector(".search");
console.log("FUCK!");
function scrollToTop() {
  // Use window.scrollTo to set the scroll position to the top
  document.documentElement.scrollTop = 0;
}

// "start": "parcel --no-cache index.html ",
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.querySelector(".fileinput");

  fileInput.addEventListener("change", async (e) => {
    const markup = await Plant.getCameraQuery(e.target.files[0]);
    main.innerHTML = "";
    main.insertAdjacentHTML("afterbegin", markup);
  });
});
// function encodeImageFileAsURL(element) {
//   const file = element.files[0];
//   const reader = new FileReader();
//   console.log("FILE LOADED!!!");
//   reader.onloadend = function () {
//     console.log("RESULT", reader.result);
//     identifyPlant(
//       reader.result,
//       "I4T6KcDmEgF4XLcSG49APFXIdI1LoUKl7zylPEp0h51c846l4I"
//     );
//   };
//   reader.readAsDataURL(file);
// }

// async function identifyPlant(imageBase64, apiKey) {
//   const apiUrl = "https://plant.id/api/v3/identification";
//   try {
//     // Fetch API request
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Api-Key": apiKey,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         images: [imageBase64],
//       }),
//     });
//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     // Parse the response JSON
//     const result = await response.json();
//     console.log("PAKYU DAREN");
//     console.log(result);
//     const searchedName =
//       result?.result?.classification?.suggestions?.[0]?.name?.split(" ")[0];
//     console.log(searchedName);
//     document.querySelector(".search__field").value = searchedName;
//     await reqPreview(searchedName);
//     // Process the result as needed
//     // console.log(result);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// const state = {
//   plant: {},
//   search: {
//     query: "",
//     results: [],
//   },
//   bookmarks: [],
// };

// const reqPreview = async function (userQuery) {
//   try {
//     const data = await getJSON(
//       `${API_URL_PLANT_LIST}?key=${API_KEY}&q=${userQuery}`
//     );
//     const data2 = removePremiumPlants(data.data);
//     state.search.results = data2.map((plant) => {
//       return {
//         id: plant.id,
//         commonName: plant.common_name,
//         scientificName: plant.scientific_name[0],
//         image: plant.default_image.original_url,
//       };
//     });
//     console.log("😋😋😋😋", state.search.results);
//     console.log(`THIS IS MY MARKasdUP!!!!`);
//     // console.log(genMarkupPreview(state.search.results));
//     const markupPreview = genMarkupPreview(state.search.results);
//     main.innerHTML = "";

//     main.insertAdjacentHTML("afterbegin", markupPreview);
//     scrollToTop();
//   } catch (error) {
//     alert(error);
//   }
// };
// const genMarkupPreview = function (data) {
//   const dmap = data
//     .map(
//       (result) =>
//         ` <li class="preview">
//   <a class="preview__link" href="#${result.id}">
//     <figure class="preview__fig">
//       <img src="${result.image}" alt="${result.commonName}" />
//     </figure>
//     <div class="preview__data">
//       <h4 class="preview__title">${result.commonName}</h4>
//       <p class="preview__sci">${result.scientificName}</p>
//     </div>
//   </a>
// </li>`
//     )
//     .join("");
//   return `<ul class="section__preview">${dmap}</ul>`;
// };
//nav-mob
nav_mob.addEventListener("click", (e) => {
  header.classList.toggle("nav-open");
});
//preview

searchbar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.querySelector(".search__field").value;
  console.log(query);
  const markup = await Plant.generateMarkupSearch(query);
  main.innerHTML = "";
  main.insertAdjacentHTML("afterbegin", markup);
});

// main plant

// const reqPlant = async function (id) {
//   try {
//     const data = await getJSON(`${API_URL_PLANT_DETAILS}/${id}?key=${API_KEY}`);
//     const data_careGuide = await getJSON(
//       `${API_URL_PLANT_CARE_GUIDE}?species_id=${id}&key=${API_KEY}`
//     );
//     const plant = data;
//     const [careGuide] = data_careGuide.data;
//     console.log("😂😂😂😂😂asd😂", plant);
//     state.plant = {
//       id: plant.id,
//       commonName: plant.common_name,
//       scientificName: plant.scientific_name[0],
//       image: plant.default_image.original_url,
//       cycle: plant.cycle,
//       watering: plant.watering,
//       sunlight: plant.sunlight,
//       description: plant.description ? plant.description : "No Data Available.",
//     };
//     state.plant.careGuide = {
//       watering: careGuide.section[0].description,
//       sunlight: careGuide.section[1].description,
//       pruning: careGuide.section[2].description,
//     };
//     console.log("😁😁😁😁😁", state.plant);
//     if (state.bookmarks.some((bmarked) => bmarked.id === +id))
//       state.plant.bookmarked = true;
//     else state.plant.bookmarked = false;
//     console.log(state.bookmarks);

//     const markupPlant = genMarkupPlant(state.plant);
//     main.insertAdjacentHTML("afterbegin", markupPlant);
//     feather.replace();
//   } catch (error) {
//     throw error;
//   }
// };
// const genMarkupPlant = function (plant) {
//   return `      <div class="section__plant container">
//   <figure class="plant__fig">
//     <img
//       src="${plant.image}"
//       alt="${plant.commonName}"
//       class="plant__img"
//     />
//   </figure>

//   <div class="plant__details">
//     <div class="plant__details_bookmarks">
//       <button class="btn__plant btn__plant_bookmark">
//         <i data-feather="bookmark"></i>
//       </button>
//       <a href="#" class="btn__plant btn__plant_guide">
//         <i data-feather="book-open"></i>
//       </a>
//     </div>
//     <div class="plant__details_name">
//       <p class="plant__details_name_common">${plant.commonName}</p>
//       <p class="plant__details_name_scientific">
//         ${plant.scientificName}
//       </p>
//     </div>
//     <div class="plant__details_desc">
//      ${plant.description}
//     </div>
//     <div class="plant__details_cycle">
//       <i data-feather="refresh-cw"></i>
//       <h4>${plant.cycle}</h4>
//     </div>
//     <div class="plant__details_watering">
//       <i data-feather="droplet"></i>
//       <h4>${plant.watering}</h4>
//     </div>
//     <div class="plant__details_sunlight">
//       <i data-feather="sun"></i>
//       <h4>${plant.sunlight}</h4>
//     </div>
//   </div>
// </div>

// <div class="section__care container">
//   <div class="care__title"><p>CARE GUIDE</p></div>
//   <div class="care__watering">
//     <i class="care__logo" data-feather="droplet"></i>

//     <div class="care__desc">
//      ${plant.careGuide.watering}
//     </div>
//   </div>
//   <div class="care__sunlight">
//     <i class="care__logo" data-feather="sun"></i>

//     <div class="care__desc">
//     ${plant.careGuide.sunlight}

//     </div>
//   </div>
//   <div class="care__pruning">
//     <i class="care__logo" data-feather="scissors"></i>
//     <div class="care__desc">
//     ${plant.careGuide.pruning}

//     </div>
//   </div>
// </div>
// <div class="section__cta container">
//   <div class="cta">
//     <div class="cta__text_box">
//       <h3 class="cta__heading_secondary">Add your plant!</h3>
//       <p class="cta__text">
//         Join our growing community of plant enthusiasts and showcase your
//         green companion. Adding your plant is easy - just fill out the
//         form below with some details about your plant, and let it flourish
//         in our digital garden!
//       </p>

//       <form class="cta__form" name="sign-up">
//         <div class="form_name">
//           <label for="plant-name">Plant Name</label>
//           <input
//             id="plant-name"
//             type="text"
//             placeholder="Fern-leaf Yarrow"
//             name="plant-name"
//             required
//           />
//         </div>

//         <div class="form_scientific">
//           <label for="sci-name">Scientific Name</label>
//           <input
//             id="sci-name"
//             type="text"
//             placeholder="Achillea filipendulina"
//             name="sci-name"
//             required
//           />
//         </div>
//         <div class="form_desc">
//           <label for="desc">Description</label>
//           <textarea name="desc" id="desc" rows="3" required></textarea>
//         </div>
//         <div class="form_cycle">
//           <label for="select-where">Cycle</label>
//           <select id="select-where" name="select-where" required="">
//             <option value="">Choose one option:</option>
//             <option value="annual">Annual</option>
//             <option value="biannual">Biannual</option>
//             <option value="biennual">Biennual</option>
//             <option value="perennial">Perennial</option>
//           </select>
//         </div>
//         <div class="form_watering">
//           <label for="select-where">Watering</label>
//           <select id="select-where" name="select-where" required>
//             <option value="">Choose one option:</option>
//             <option value="none">None</option>
//             <option value="minimum">Mnimum</option>
//             <option value="average">Average</option>
//             <option value="frequent">Frequent</option>
//           </select>
//         </div>
//         <div class="form_sunlight">
//           <label for="select-where">Sunlight</label>
//           <select id="select-where" name="select-where" required>
//             <option value="">Choose one option:</option>
//             <option value="part-shade">Part shade</option>
//             <option value="full-shade">Full shade</option>
//             <option value="sun-part-shade">Sun-part shade</option>
//             <option value="full-sun">Full sun</option>
//           </select>
//         </div>
//         <div class="form_guide form_guide_water">
//           <label for="watering-guide">Watering Guide</label>
//           <textarea
//             name="watering-guide"
//             id="watering-guide"
//             rows="3"
//             required
//           ></textarea>
//         </div>
//         <div class="form_guide form_guide_sun">
//           <label for="sunlight-guide">Sunlight Guide</label>
//           <textarea
//             name="sunlight-guide"
//             id="sunlight-guide"
//             rows="3"
//             required
//           ></textarea>
//         </div>
//         <div class="form_guide form_guide_prune">
//           <label for="pruning-guide">Pruning Guide</label>
//           <textarea
//             name="pruning-guide"
//             id="pruning-guide"
//             rows="3"
//             required
//           ></textarea>
//         </div>
//         <button class="btn btn--form form_submit">Add plant</button>
//       </form>
//     </div>
//     <div
//       class="cta__img_box"
//       role="img"
//       aria-label="Woman enjoying food"
//     ></div>
//   </div>
// </div>`;
// };

const plantClick = async () => {
  const id = window.location.hash.slice(1);
  console.log(id);
  if (!id) return;
  main.innerHTML = "";
  const myplant = new Plant(id);
  const markup = await myplant.generateMarkupPlant();
  main.innerHTML = "";
  main.insertAdjacentHTML("afterbegin", markup);
  feather.replace();
};
["hashchange"].forEach((ev) => window.addEventListener(ev, plantClick));
