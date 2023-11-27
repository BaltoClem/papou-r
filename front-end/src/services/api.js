import config from "@/config.js"
import axios from "axios"

export const createApi = ({ jwt, uuid }) =>
  axios.create({
    baseURL: config.api.baseURL,
    headers: {
      Authorization: `Bearer ${jwt}`,
      uuid: uuid,
    },
  })
