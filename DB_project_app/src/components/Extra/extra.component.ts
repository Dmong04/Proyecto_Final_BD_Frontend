import { ref } from 'vue'
import extraService from '@/services/extra.service'
import type { Extra } from '@/models/extra'

export function ExtraComponet() {
    const extras = ref<Extra[]>([])
    const loading = ref(false)
    const error = ref(null)

    const loadExtras = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await extraService.getExtras()
            // The array is in response.data.data
            extras.value = response.data.data
        } catch (err: any) {
            console.error('Error al cargar extras: ', err)
            error.value = err
        } finally {
            loading.value = false
        }
    }
    return {
        extras,
        loading,
        error,
        loadExtras,
    }

}