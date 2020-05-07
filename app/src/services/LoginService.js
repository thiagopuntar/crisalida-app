import Service from './Service';

export default class LoginService extends Service {
  constructor() {
    super('Login');
  }

  async login(user) {
    try {
      const token = await super.post(user)
      this.setHeader(token);
      return token;
      
    } catch(e) {
      return Promise.reject(JSON.parse(e.response));
    }
  }
}
