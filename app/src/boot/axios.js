import axios from 'axios'

const axiosBase = axios.create({
  baseURL: process.env.API
});


export default ({ store, router }) => {
  const token = store.state.auth.token;
  if (token) {
    axiosBase.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  
  axiosBase.interceptors.response.use(
    function(res) {
      return res;
    },
    function(err) {
      if (err.request.status == 401) {
        store.dispatch('auth/logout')
          .then(() => {
            router.push({ name: 'login' });
          });
      } else {
        return Promise.reject(err.request);
      }
    }
  )
}

export { axiosBase };