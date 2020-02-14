import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL + '/v2';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default axios;
