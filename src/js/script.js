import "core-js/stable";
import "regenerator-runtime/runtime";
import Plant from "./plant.js";
import { signIn, handleRedirectAuth, auth } from "./config.js";
import { signOut } from "firebase/auth";
import icons from "../img/icons.svg";

feather.replace();
const main = document.querySelector(".main");
const nav_mob = document.querySelector(".nav__mobile");
const header = document.querySelector(".header");
const searchbar = document.querySelector(".search");
const fileInput = document.querySelector(".fileinput");
const bookmarks = document.querySelector(".nav__btn--bookmarks");
const login = document.querySelector(".nav__btn--login");
let myplant;
bookmarks.addEventListener("click", async () => {
  try {
    if (!auth.currentUser) {
      try {
        await signIn();
      } catch (e) {
        throw e;
      }
    } else {
      renderSpinner();
      const markup = await Plant.getBookmarks();
      main.innerHTML = "";
      main.insertAdjacentHTML("afterbegin", markup);
    }
  } catch (e) {
    displayError(e);
  }
});
// main plant
const plantClick = async () => {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    main.innerHTML = "";
    myplant = new Plant(id);
    renderSpinner();
    const markup = await myplant.generateMarkupPlant();
    main.innerHTML = "";
    main.insertAdjacentHTML("afterbegin", markup);
    feather.replace();
    //add bookmark button
    await toggleBookmark(id);
  } catch (e) {
    displayError(e);
  }
};
["hashchange"].forEach((ev) => window.addEventListener(ev, plantClick));

async function toggleBookmark(id) {
  // await myplant.checkDatabaseBookmark();
  const bookmark = document.querySelector(".btn__plant_bookmark");
  bookmark.addEventListener("click", async () => {
    if (myplant.bookmarked) {
      bookmark.innerHTML = `<i data-feather="bookmark"></i>`;
      myplant.bookmarked = false;
      console.log(bookmark);
      feather.replace();
      await myplant.removePlantFromDB(id);
    } else {
      bookmark.innerHTML = `<i data-feather="check-square"></i>`;
      myplant.bookmarked = true;
      console.log(bookmark);
      feather.replace();
      await myplant.addPlantToDB(id);
    }
  });

  // bookmark.addEventListener("click", async () => {
  //   if ((myplant.bookmarked = true)) myplant.removePlantDB();
  //   else {
  //     myplant.addPlantDB();
  //   }
  // });
}
function displayError(error) {
  main.innerHTML = "";
  main.insertAdjacentHTML = `<h1 class='center-text'>${error}</h1>`;
}
function renderSpinner() {
  const spinnerMarkup = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
  main.innerHTML = "";
  main.insertAdjacentHTML("afterbegin", spinnerMarkup);
}
window.onload = async () => {
  try {
    await handleRedirectAuth();
    if (auth.currentUser) {
      console.log(auth.currentUser);
      login.childNodes[2].nodeValue = "Log out";
      await addLoginListener(true);
    } else {
      login.childNodes[2].nodeValue = "Log in";
      await addLoginListener(false);
    }
  } catch (e) {
    displayError(e);
  }
};
async function addLoginListener(isLog) {
  if (isLog) {
    login.addEventListener("click", async () => {
      try {
        await signOut(auth);
        location.reload();
      } catch (e) {
        throw e;
      }
    });
  } else {
    login.addEventListener("click", async () => {
      try {
        await signIn();
      } catch (e) {
        throw e;
      }
    });
  }
}
function scrollToTop() {
  // Use window.scrollTo to set the scroll position to the top
  document.documentElement.scrollTop = 0;
}

// "start": "parcel --no-cache index.html ",
fileInput.addEventListener("change", async (e) => {
  const markup = await Plant.getCameraQuery(e.target.files[0]);
  main.innerHTML = "";
  main.insertAdjacentHTML("afterbegin", markup);
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
  try {
    e.preventDefault();
    const query = document.querySelector(".search__field").value;
    console.log(query);
    renderSpinner();
    const markup = await Plant.generateMarkupSearch(query);
    main.innerHTML = "";
    main.insertAdjacentHTML("afterbegin", markup);
  } catch (e) {
    displayError(e);
  }
});
