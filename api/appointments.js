import client from './client'

// NOTE: the written contract calls this field "doctorSpeciality", but the
// live backend actually validates and expects "doctorSpecialty" (no second
// "i") — confirmed via a real 400 response. We keep our internal JS naming
// as doctorSpeciality for consistency with the rest of the app, and only
// rename it right here at the wire boundary.
export const createAppointment = async ({ hospitalName, doctorSpeciality, doctorName, appointmentDate, appointmentTime, note }) => {
    const { data } = await client.post('/appointments', {
        hospitalName, doctorSpecialty: doctorSpeciality, doctorName, appointmentDate, appointmentTime, note,
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
