import { apiService } from './api'

export const contactService = {
    async createContact(contactData) {
        return await apiService.post('contacts', contactData)
    },

    async getAllContacts(searchTerms = null) {
        const params = {}
        
        if (searchTerms && searchTerms.trim() !== '') {
            params.terms = searchTerms.trim()
        }
        
        return await apiService.get('contacts', params)
    },

    async getContactById(id) {
        return await apiService.get(`contacts/${id}`)
    },

    async updateContact(id, contactData) {
        return await apiService.put(`contacts/${id}`, contactData)
    },

    async deleteContact(id) {
        return await apiService.delete(`contacts/${id}`)
    },

    validateContactData(contactData) {
        const errors = []
        
        // validate name (at least 6 characters)
        if (!contactData.name || contactData.name.trim().length < 6) {
            errors.push('O nome deve ter pelo menos 6 caracteres')
        }
        
        // validate contact (exactly 9 digits)
        if (!contactData.contact || !/^\d{9}$/.test(contactData.contact)) {
            errors.push('O contacto deve ter exatamente 9 dígitos')
        }
        
        // validate email
        if (!contactData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
            errors.push('Digite um email válido')
        }
        
        // Validate picture
        if (!contactData.picture && !contactData.isEdit) {
            errors.push('A foto é obrigatória')
        }
        
        return {
            isValid: errors.length === 0,
            errors
        }
    },
}