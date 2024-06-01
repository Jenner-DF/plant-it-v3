import { mark } from "regenerator-runtime";
import { getSearchResults, getMyPlant, getUploadedImgPlant } from "./helpers";
import { auth, getUserProfile, updateUserPlantDatabase } from "./config";
//import
export default class Plant {
  constructor(id) {
    this.plantID = id;
    this.plant = {};
    this.careGuide = {};
    this.bookmarked = false;
    this.camsearch = false;
  }
  async removePlantFromDB(id) {
    const index = this.bookmarkedPlants.indexOf(id);
    if (index > -1) {
      this.bookmarkedPlants.splice(index, 1);
    }
    await updateUserPlantDatabase(this.bookmarkedPlants);
  }
  async addPlantToDB(id) {
    this.bookmarkedPlants.push(id);
    await updateUserPlantDatabase(this.bookmarkedPlants);
  }

  async checkDatabaseBookmark(id) {
    console.log(auth.currentUser);
    const data = await getUserProfile(auth.currentUser.email);
    this.bookmarkedPlants = data.bookmarkplants;
    console.log(this.bookmarkedPlants);
    console.log(String(id));

    return this.bookmarkedPlants.includes(String(id));
  }
  static async generateMarkupSearch(
    query,
    camsearch = false,
    probability = null
  ) {
    console.log(query);
    let myquery = query;
    if (camsearch) myquery = query?.split(" ")[0];
    const searchResults = await getSearchResults(myquery);
    console.log(searchResults);
    if (!searchResults.length)
      return `<h1 class='center-text'>No Plant Found. 😢</h1>`;
    const markup = searchResults
      .map(
        (result) =>
          ` <li class="preview">
  <a class="preview__link" href="#${result.id}">
    <figure class="preview__fig">
      <img src="${result.image}" alt="${result.commonName}" />
    </figure>
    <div class="preview__data">
      <h4 class="preview__title">${result.commonName}</h4>
      <p class="preview__sci">${result.scientificName}</p>
    </div>
  </a>
</li>`
      )
      .join("");

    if (camsearch)
      return `<h1 class='center-text'>Your plant: ${query} with a probability of ${(
        probability * 100
      ).toFixed(2)}%</h1><ul class="section__preview">${markup}</ul>`;
    return `<ul class="section__preview">${markup}</ul>`;
  }
  async generateMarkupPlant() {
    try {
      console.log(`getting bookmark!`);
      this.bookmarked = await this.checkDatabaseBookmark(this.plantID);
      console.log(this.plantID);
      const [plant, careGuide] = await getMyPlant(this.plantID);
      this.plant = {
        id: plant.id,
        commonName: plant.common_name,
        scientificName: plant.scientific_name[0],
        image: plant.default_image.original_url,
        cycle: plant.cycle,
        watering: plant.watering,
        sunlight: plant.sunlight,
        description: plant.description
          ? plant.description
          : "No Data Available.",
      };
      this.careGuide = {
        watering: careGuide.section[0].description,
        sunlight: careGuide.section[1].description,
        pruning: careGuide.section[2].description,
      };
      // FOR BOOKMARKS
      // if (state.bookmarks.some((bmarked) => bmarked.id === +id))
      //   state.plant.b = true;
      // else state.plant.bookmarked = false;
      // console.log(state.bookmarks);
      const markup = `
      <div class="section__plant container">
    <figure class="plant__fig">
      <img
        src="${this.plant.image}"
        alt="${this.plant.commonName}"
        class="plant__img"
      />
    </figure>
  
    <div class="plant__details">
      <div class="plant__details_bookmarks">
        <button class="btn__plant btn__plant_bookmark">
          ${
            this.bookmarked
              ? `<i data-feather="check-square"></i>`
              : `<i data-feather="bookmark"></i>`
          }
        </button>
        <a href="#" class="btn__plant btn__plant_guide">
          <i data-feather="book-open"></i>
        </a>
      </div>
      <div class="plant__details_name">
        <p class="plant__details_name_common">${this.plant.commonName}</p>
        <p class="plant__details_name_scientific">
          ${this.plant.scientificName}
        </p>
      </div>
      <div class="plant__details_desc">
       ${this.plant.description}
      </div>
      <div class="plant__details_cycle">
        <i data-feather="refresh-cw"></i>
        <h4>${this.plant.cycle}</h4>
      </div>
      <div class="plant__details_watering">
        <i data-feather="droplet"></i>
        <h4>${this.plant.watering}</h4>
      </div>
      <div class="plant__details_sunlight">
        <i data-feather="sun"></i>
        <h4>${this.plant.sunlight}</h4>
      </div>
    </div>
  </div>
  
  
  <div class="section__care container">
    <div class="care__title"><p>CARE GUIDE</p></div>
    <div class="care__watering">
      <i class="care__logo" data-feather="droplet"></i>
  
      <div class="care__desc">
       ${this.careGuide.watering}
      </div>
    </div>
    <div class="care__sunlight">
      <i class="care__logo" data-feather="sun"></i>
  
      <div class="care__desc">
      ${this.careGuide.sunlight}
  
      </div>
    </div>
    <div class="care__pruning">
      <i class="care__logo" data-feather="scissors"></i>
      <div class="care__desc">
      ${this.careGuide.pruning}
  
      </div>
    </div>
  </div>
  <div class="section__cta container">
    <div class="cta">
      <div class="cta__text_box">
        <h3 class="cta__heading_secondary">Add your plant!</h3>
        <p class="cta__text">
          Join our growing community of plant enthusiasts and showcase your
          green companion. Adding your plant is easy - just fill out the
          form below with some details about your plant, and let it flourish
          in our digital garden!
        </p>
  
        <form class="cta__form" name="sign-up">
          <div class="form_name">
            <label for="plant-name">Plant Name</label>
            <input
              id="plant-name"
              type="text"
              placeholder="Fern-leaf Yarrow"
              name="plant-name"
              required
            />
          </div>
  
          <div class="form_scientific">
            <label for="sci-name">Scientific Name</label>
            <input
              id="sci-name"
              type="text"
              placeholder="Achillea filipendulina"
              name="sci-name"
              required
            />
          </div>
          <div class="form_desc">
            <label for="desc">Description</label>
            <textarea name="desc" id="desc" rows="3" required></textarea>
          </div>
          <div class="form_cycle">
            <label for="select-where">Cycle</label>
            <select id="select-where" name="select-where" required="">
              <option value="">Choose one option:</option>
              <option value="annual">Annual</option>
              <option value="biannual">Biannual</option>
              <option value="biennual">Biennual</option>
              <option value="perennial">Perennial</option>
            </select>
          </div>
          <div class="form_watering">
            <label for="select-where">Watering</label>
            <select id="select-where" name="select-where" required>
              <option value="">Choose one option:</option>
              <option value="none">None</option>
              <option value="minimum">Mnimum</option>
              <option value="average">Average</option>
              <option value="frequent">Frequent</option>
            </select>
          </div>
          <div class="form_sunlight">
            <label for="select-where">Sunlight</label>
            <select id="select-where" name="select-where" required>
              <option value="">Choose one option:</option>
              <option value="part-shade">Part shade</option>
              <option value="full-shade">Full shade</option>
              <option value="sun-part-shade">Sun-part shade</option>
              <option value="full-sun">Full sun</option>
            </select>
          </div>
          <div class="form_guide form_guide_water">
            <label for="watering-guide">Watering Guide</label>
            <textarea
              name="watering-guide"
              id="watering-guide"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="form_guide form_guide_sun">
            <label for="sunlight-guide">Sunlight Guide</label>
            <textarea
              name="sunlight-guide"
              id="sunlight-guide"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="form_guide form_guide_prune">
            <label for="pruning-guide">Pruning Guide</label>
            <textarea
              name="pruning-guide"
              id="pruning-guide"
              rows="3"
              required
            ></textarea>
          </div>
          <button class="btn btn--form form_submit">Add plant</button>
        </form>
      </div>
      <div
        class="cta__img_box"
        role="img"
        aria-label="Woman enjoying food"
      ></div>
    </div>
  </div>
      `;
      return markup;
    } catch (e) {
      throw e;
    }
  }
  //for camera
  static async getCameraQuery(myfile) {
    const file = myfile; //single file
    const [searchedName, probability] = await getUploadedImgPlant(file);
    return await Plant.generateMarkupSearch(searchedName, true, probability);
  }
  static async getBookmarks() {
    console.log("hello");
  }
}
//addeventlsiteners on 1 js then call this class plant
