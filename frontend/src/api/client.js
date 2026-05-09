import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import i18n from '@/i18n'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || i18n.global.t('api.unexpectedError')
    // eslint-disable-next-line no-console
    console.error(`[API Error] ${error.config?.url}:`, message)
    return Promise.reject(new Error(message))
  },
)

export default apiClient
