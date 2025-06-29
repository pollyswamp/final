import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'applicattion/json',
    'X-Auth-Token': '72ee76b0a7bb45db8535239116876d47',
  },
})

export default api