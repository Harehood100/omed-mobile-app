import client from './client'

export const createAppointment = async ({ hospitalName, doctorSpeciality, doctorName, appointmentDate, appointmentTime, note }) => {
    const { data } = await client.post('/appointments', {
        hospitalName, doctorSpeciality, doctorName, appointmentDate, appointmentTime, note,
    })
    return data.data
}

export const getAppointments = async () => {
    const { data } = await client.get('/appointments')
    return data.data
}

export const getAppointment = async (appointmentId) => {
    const { data } = await client.get(`/appointments/${appointmentId}`)
    return data.data
}

export const updateAppointment = async (appointmentId, updates) => {
    const { data } = await client.patch(`/appointments/${appointmentId}`, updates)
    return data.data
}

export const deleteAppointment = async (appointmentId) => {
    const { data } = await client.delete(`/appointments/${appointmentId}`)
    return data.data
}
