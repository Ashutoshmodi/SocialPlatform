export function errorMessage(err, fallback = 'Something went wrong') {
    if (!err.response) return 'Cannot reach the server. Is the backend running?'
    const data = err.response.data
    if (data?.error) return data.error
    if (data?.errors) return Object.values(data.errors).flat().join(' ') // ASP.NET validation errors
    if (err.response.status === 401) return 'Please log in again.'
    if (err.response.status === 429) return 'Too many requests. Wait a minute and try again.'
    return fallback
}