import client from './client'

// POST /users/register — confirmed against the live Swagger UI
export const registerUser = async ({ firstName, lastName, email, password }) => {
    const { data } = await client.post('/users/register', { firstName, lastName, email, password })
    return data.data // the created user object
}

// POST /auth/login — returns { user, tokens: { accessToken, refreshToken, tokenType, expiresIn } }
export const loginUser = async ({ email, password }) => {
    const { data } = await client.post('/auth/login', { email, password })
    return data.data
}

// GET /auth/me — returns the currently authenticated user
export const getCurrentUser = async () => {
    const { data } = await client.get('/auth/me')
    return data.data
}
