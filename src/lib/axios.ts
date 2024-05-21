import axios, { AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_SERVER_HOST

axios.defaults.withCredentials = true
axios.defaults.baseURL = baseURL
axios.defaults.timeout = 10_000

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return new Promise((resolve, reject) => {
      // const originalRequest = error.config
      // const refreshToken = getCookie('refreshToken')

      // if (error.response?.status === 403) {
      //   typeof window !== 'undefined' ? window.location.href = '/forbidden' : reject();
      // } else if (error.response?.status === 401) {
      //   if (error.config?.url !== '/account/me') {
      //     typeof window !== 'undefined' ? window.location.href = '/unauthorized' : reject();
      //   } else {
      //     return reject(error)
      //   }
      // }

      if(error && typeof window !== 'undefined') {
        switch (error.response?.status) {
          case 403:
            window.location.href = '/forbidden'
            break;
          case 401:
            if(error.config?.url !== '/account/me') window.location.href = '/unauthorized'
            break;
          case 404: 
            window.location.href = '/404'
          default:
            break;
        }
      }

      // else if (
      //   error.response &&
      //   error.response.status === 401 &&
      //   error.config &&
      //   (error.response.data as any).message.includes('Token expired') &&
      //   // !error.config.__isRetryRequest &&
      //   refreshToken
      // ) {
      //   console.log('halo')
      //   ;(originalRequest as any)._retry = true

      //   const response = fetch(`${baseURL}/refresh`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       refresh: refreshToken,
      //     }),
      //   })
      //     .then((res) => res.json())
      //     .then((res) => {
      //       localStorage.set(res.accessToken, 'accessToken')

      //       return axios(originalRequest ?? {})
      //     })
      //   resolve(response)
      // }

      return reject(error)
    })
  }
)

export default axios
