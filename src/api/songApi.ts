import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/songs.json";

export function getSongs() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
