import {
  API_KEY,
  RESULTS_PER_PAGE,
  API_URL_PLANT_LIST,
  API_URL_PLANT_DETAILS,
  API_URL_PLANT_CARE_GUIDE,
  API_KEY_CAMERA,
  TIMEOUT_SEC,
} from "./config.js";
import Plant from "./plant.js";
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    Promise.race([]);
    const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const removePremiumPlants = function (data) {
  return data.filter(
    (data) =>
      data?.default_image?.original_url !== undefined &&
      data?.default_image?.original_url !==
        "https://perenual.com/storage/image/upgrade_access.jpg"
  );
};

// PLANT
export async function getSearchResults(query) {
  console.log(`ako ay nasa results`);
  console.log(query);
  try {
    const data = await getJSON(
      `${API_URL_PLANT_LIST}?key=${API_KEY}&q=${query}`
    );
    const noSubscriptionData = removePremiumPlants(data.data);

    const searchResults = noSubscriptionData.map((plant) => {
      return {
        id: plant.id,
        commonName: plant.common_name,
        scientificName: plant.scientific_name[0],
        image: plant.default_image.original_url,
      };
    });
    return searchResults;
  } catch (e) {
    console.log(e);
    throw new Error(
      "Sorry, no results were found for your search. Please try using different keywords."
    );
  }
}
export async function getMyPlant(id) {
  try {
    const data = await getJSON(`${API_URL_PLANT_DETAILS}/${id}?key=${API_KEY}`);
    console.log(data);
    const data_careGuide = await getJSON(
      `${API_URL_PLANT_CARE_GUIDE}?species_id=${id}&key=${API_KEY}`
    );
    const [careGuide] = data_careGuide.data;
    console.log(data_careGuide);
    return [data, careGuide];
  } catch (e) {
    throw new Error(e, "Please try again later.");
  }
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function getUploadedImgPlant(imageBase64) {
  const apiUrl = "https://plant.id/api/v3/identification";
  const buffer = await imageBase64.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  try {
    // Fetch API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Api-Key": API_KEY_CAMERA,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: [base64],
      }),
    });
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response JSON
    const result = await response.json();
    console.log(result.result);
    if (!result.result.is_plant.binary)
      throw new Error("Image is highly likely not a plant.");
    //returns only the first word
    const searchedName = result?.result?.classification?.suggestions?.[0]?.name;
    const probability =
      result?.result?.classification?.suggestions?.[0]?.probability;
    document.querySelector(".search__field").value = searchedName;
    return [searchedName, probability];
    // Process the result as needed
    // console.log(result);
  } catch (error) {
    throw error;
  }
}
