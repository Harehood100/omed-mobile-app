import client from './client'

export const createMedication = async ({ name, dosage, frequency, reminderTime, startDate, endDate, instructions }) => {
    const { data } = await client.post('/medications', {
        name, dosage, frequency, reminderTime, startDate, endDate, instructions,
    })
    return data.data
}

export const getMedications = async () => {
    const { data } = await client.get('/medications')
    return data.data
}

export const getMedication = async (medicationId) => {
    const { data } = await client.get(`/medications/${medicationId}`)
    return data.data
}

export const updateMedication = async (medicationId, updates) => {
    const { data } = await client.patch(`/medications/${medicationId}`, updates)
    return data.data
}

export const deleteMedication = async (medicationId) => {
    const { data } = await client.delete(`/medications/${medicationId}`)
    return data.data
}
