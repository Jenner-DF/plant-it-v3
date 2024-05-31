import { mark } from "regenerator-runtime";
import { getSearchResults, getMyPlant, getUploadedImgPlant } from "./helpers";
//import
export default class Plant {
  constructor(id) {
    this.query = query;
    this.plantID = id;
    this.plant = {};
    this.careGuide = {};
    this.bookmark = false;
  }
  static async generateMarkupSearch(query) {
    console.log(query);
    const searchResults = await getSearchResults(query);
    console.log(searchResults);
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

    return `<ul class="section__preview">${markup}</ul>`;
  }
  async generateMarkupPlant() {
    const [plant, careGuide] = await getMyPlant(this.plantID);
    this.plant = {
      id: plant.id,
      commonName: plant.common_name,
      scientificName: plant.scientific_name[0],
      image: plant.default_image.original_url,
      cycle: plant.cycle,
      watering: plant.watering,
      sunlight: plant.sunlight,
      description: plant.description ? plant.description : "No Data Available.",
    };
    this.careGuide = {
      watering: careGuide.section[0].description,
      sunlight: careGuide.section[1].description,
      pruning: careGuide.section[2].description,
    };
    // FOR BOOKMARKS
    // if (state.bookmarks.some((bmarked) => bmarked.id === +id))
    //   state.plant.bookmarked = true;
    // else state.plant.bookmarked = false;
    // console.log(state.bookmarks);
    const markup = `
    <div class="section__plant container">
  <figure class="plant__fig">
    <img
      src="${plant.image}"
      alt="${plant.commonName}"
      class="plant__img"
    />
  </figure>

  <div class="plant__details">
    <div class="plant__details_bookmarks">
      <button class="btn__plant btn__plant_bookmark">
        <i data-feather="bookmark"></i>
      </button>
      <a href="#" class="btn__plant btn__plant_guide">
        <i data-feather="book-open"></i>
      </a>
    </div>
    <div class="plant__details_name">
      <p class="plant__details_name_common">${plant.commonName}</p>
      <p class="plant__details_name_scientific">
        ${plant.scientificName}
      </p>
    </div>
    <div class="plant__details_desc">
     ${plant.description}
    </div>
    <div class="plant__details_cycle">
      <i data-feather="refresh-cw"></i>
      <h4>${plant.cycle}</h4>
    </div>
    <div class="plant__details_watering">
      <i data-feather="droplet"></i>
      <h4>${plant.watering}</h4>
    </div>
    <div class="plant__details_sunlight">
      <i data-feather="sun"></i>
      <h4>${plant.sunlight}</h4>
    </div>
  </div>
</div>


<div class="section__care container">
  <div class="care__title"><p>CARE GUIDE</p></div>
  <div class="care__watering">
    <i class="care__logo" data-feather="droplet"></i>

    <div class="care__desc">
     ${careGuide.watering}
    </div>
  </div>
  <div class="care__sunlight">
    <i class="care__logo" data-feather="sun"></i>

    <div class="care__desc">
    ${careGuide.sunlight}

    </div>
  </div>
  <div class="care__pruning">
    <i class="care__logo" data-feather="scissors"></i>
    <div class="care__desc">
    ${careGuide.pruning}

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
  }
  //for camera
  static async getCameraQuery(myfile) {
    const file = myfile; //single file
    const searchedName = await getUploadedImgPlant(file);
    return await Plant.generateMarkupSearch(searchedName);
  }
}
//addeventlsiteners on 1 js then call this class plant
