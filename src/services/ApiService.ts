export default class ApiService {
  static async get() {
    if (process.env.REACT_APP_API_URL) {
      const response = await fetch(process.env.REACT_APP_API_URL);
      return response.json();
    }
    return Promise.reject();
  }
}
