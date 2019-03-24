import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.PUBLIC_URL + "/songs.json";

export function getSongs() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
