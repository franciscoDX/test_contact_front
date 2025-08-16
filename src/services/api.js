import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'

const API_PREFIX = 'api'

const apiClient = axios.create({
    baseURL: API_BASE_URL + API_PREFIX,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})
export const apiService = {
    async get(url, params = {}) {
        try {
            const response = await apiClient.get(url, { params })
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message,
                status: error.response?.status
            }
        }
    },

    async post(url, data = {}) {
        try {
            // Configuración especial para FormData
            const config = {}
            
            if (data instanceof FormData) {
                // Para FormData, no establecer Content-Type (axios lo hace automáticamente)
                config.headers = {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const response = await apiClient.post(url, data, config)
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || error.message,
                status: error.response?.status,
                details: error.response?.data // Para debugging
            }
        }
    },

    async put(url, data = {}) {
        try {
            // Configuración especial para FormData
            const config = {}
            
            if (data instanceof FormData) {
                // Para FormData, no establecer Content-Type (axios lo hace automáticamente)
                config.headers = {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const response = await apiClient.put(url, data, config)
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || error.message,
                status: error.response?.status,
                details: error.response?.data // Para debugging
            }
        }
    },

    async delete(url) {
        try {
            const response = await apiClient.delete(url)
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || error.message,
                status: error.response?.status,
                details: error.response?.data // Para debugging
            }
        }
    },

    async patch(url, data = {}) {
        try {
            const response = await apiClient.patch(url, data)
            return {
                success: true,
                data: response.data,
                status: response.status
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || error.message,
                status: error.response?.status,
                details: error.response?.data // Para debugging
            }
        }
    }
}

export default apiClient