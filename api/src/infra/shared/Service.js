module.exports = class Service {
  constructor(user, model) {
    if (!user) throw new Error('User parameter required!');

    this._user = user;
    this._Model = model(user);
  }

  async list(config = {}) {
    const { 
      filter = {},
      sort = {},
      projection = {},
      population = ''
    } = config;

    const data = await this._Model
      .find(filter)
      .select(projection)
      .sort(sort)
      .populate(population);
    
    return data;
  }

  async findOne(config = {}) {
    const { 
      filter = {},
      sort = {},
      projection = {},
      population = ''
    } = config;

    const data = await this._Model
      .findOne(filter)
      .sort(sort)
      .select(projection)
      .populate(population);
    
    return data;
  }

  async findById(id) {
    const data = await this._Model.findById(id);
    return data;
  }

  async insert(payload) {
    const Model = this._Model;
    const data = new Model(payload);
    await data.save();

    return data;
  }

  async update(id, newData) {
    const data = await this._Model.findById(id);
    data.set(newData);
    await data.save();

    return data;
  }

  async delete(id) {
    const data = await this._Model.findById(id);
    await data.remove();

    return data;
  }
}