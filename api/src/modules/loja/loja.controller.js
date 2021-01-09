const LojaDao = require("./loja.dao");
const lojaDao = new LojaDao();
const axios = require("axios");
const cepUrl = "http://www.viacep.com.br/ws";
const dayjs = require("dayjs");

class Controller {
  async listProducts(req, res) {
    const data = await lojaDao.listProducts();
    const toSend = data.map((x) => ({
      idProduto: x.id,
      nome: x.title,
      comentario: x.description,
      valor: x.price,
      un: x.unit,
    }));

    res.json(toSend);
  }

  async getCep(req, res) {
    const { cep } = req.params;
    const response = await axios.get(`${cepUrl}/${cep}/json`);
    res.json(response.data);
  }

  async getDistricts(req, res) {
    const data = await lojaDao.getDistricts();
    res.json(data);
  }

  addOrder = async (req, res) => {
    try {
      const { carrinho, cliente, ...pedido } = req.body;

      if (pedido.origem !== "Cardapio") {
        throw new Error("Erro inesperado");
      }

      const validProducts = await this._validateProducts(carrinho);

      const customerId = await this._getCustomer(cliente);

      const data = await this._transformOrder(
        validProducts,
        customerId,
        cliente.endereco,
        pedido
      );

      res.json(data);
    } catch (error) {
      console.log(error);
    }
  };

  async _validateProducts(products) {
    const promises = products.map(async (x) => {
      const [product] = await lojaDao.getProduct(x.id);
      if (!product) return Promise.reject("Product not found!");

      return {
        productId: x.id,
        qty: x.quantidade,
        vl: product.price,
      };
    });

    return Promise.all(promises);
  }

  async _getCustomer(customer) {
    const { tel } = customer;

    if (!tel) {
      throw new Error("Telefone obrigatório.");
    }

    if (tel.length < 10) {
      throw new Error("Telefone em formato inválido.");
    }

    const phoneOnlyNumbers = tel.replace(/\D+/, "");
    let data = await lojaDao.getCustomerByPhone(phoneOnlyNumbers);

    if (!data) {
      return this._createCustomer({ ...customer, phone: phoneOnlyNumbers });
    }

    return data.id;
  }

  async _createCustomer(customer) {
    const transformed = {
      phone: customer.phone,
      name: customer.nome,
      email: customer.email,
    };

    const newCustomer = await lojaDao.createCustomer(transformed);
    return newCustomer.id;
  }

  async _transformOrder(products, customerId, address, order) {
    const tiposEntrega = {
      Retirada: "Retirada",
      Entrega: "Pronta Entrega",
    };

    const deliveryType = tiposEntrega[order.tipoEntrega];

    if (!deliveryType) {
      throw new Error("Tipo de entrega não previsto!");
    }

    const trx = await lojaDao.getTransaction();

    const transformed = {
      orderDate: dayjs().format("YYYY-MM-DD HH:mm"),
      deliveryDate: dayjs().format("YYYY-MM-DD HH:mm"),
      deliveryType,
      comments: order.observacao,
      status: 0,
      customerId,
      discount: 0,
      deliveryTax: 0,
      origin: order.origem,
    };

    if (deliveryType !== "Retirada") {
      transformed.address = address.logradouro;
      transformed.addressNumber = address.numero;
      transformed.complement = address.complemento;
      transformed.district = address.bairro;
      transformed.city = address.cidade;
      transformed.state = "MG";

      const district = await lojaDao.getDistrictByName(address.bairro);

      if (!district) {
        throw new Error("Erro ao buscar o bairro.");
      }

      transformed.deliveryTax = district.tax;
    }

    const orderId = await lojaDao.createOrder(transformed, trx);

    const details = products.map((x) => ({
      ...x,
      orderId,
    }));
    await lojaDao.createOrderDetails(details, trx);
    await trx.commit();

    return orderId;
  }
}

module.exports = new Controller();
