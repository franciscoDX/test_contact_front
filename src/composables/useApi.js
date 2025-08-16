import { ref, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useApi() {
    const toast = useToast()
    const loading = ref(false)
    const error = ref(null)

    const handleRequest = async (apiCall, successMessage = null, errorMessage = null) => {
        loading.value = true
        error.value = null
        
        try {
        const response = await apiCall()
        
        if (response.success) {
            if (successMessage) {
                toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: successMessage,
                    life: 3000
                })
            }
            return response.data
        } else {
            error.value = response.error
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage || response.error,
                life: 5000
                })
            return null
        }
        } catch (err) {
            error.value = err.message
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage || 'internal server error',
                life: 5000
            })
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        handleRequest
    }
}