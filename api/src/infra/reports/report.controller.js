const path = require("path");
const fs = require("fs-extra");
const hbs = require("handlebars");
const moment = require("moment");
const { order, orderDetails, sequelize } = require("../database");

exports.order = async (req, res) => {
  const data = await getOrder(req.params.id);

  if (!data) {
    res.status(404).send("Pedido não localizado.");
  }

  const filePath = path.join(__dirname, "/orders/order.report.hbs");
  const html = await fs.readFile(filePath, "utf-8");
  const reportCompiled = hbs.compile(html)(data);

  res.send(reportCompiled);
};

exports.routeList = async (req, res) => {
  const query = `SELECT *
    FROM orderTotal o
    JOIN customers c ON c.id = o.customerId
    LEFT JOIN customerAddresses ca ON ca.id = o.addressId
    WHERE o.id IN (${req.query.ids})`;

  const data = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  const objReport = {
    orders: data.map((x) => {
      const { address, number, complement, district } = x;
      const totalPaid = parseFloat(x.totalPaid || 0);
      const totalValue =
        parseFloat(x.totalValue) +
        parseFloat(x.deliveryTax) -
        parseFloat(x.discount);

      return {
        customer: {
          phone: x.phone,
          name: x.name,
        },
        address: formatAddress({ address, number, complement, district }),
        deliveryDate: x.deliveryDate,
        comments: x.comments,
        deliveryTax: x.deliveryTax,
        discount: x.discount,
        remainingPayment: (totalValue - totalPaid).toFixed(2),
      };
    }),
  };

  const filePath = path.join(__dirname, "/orders/orderList.report.hbs");
  const html = await fs.readFile(filePath, "utf-8");
  const reportCompiled = hbs.compile(html)(objReport);

  res.send(reportCompiled);
};

async function getOrder(id) {
  const data = await order.findByPk(id, {
    include: [
      order.customer,
      order.address,
      {
        association: order.details,
        as: "details",
        include: [orderDetails.product],
      },
      { association: order.payments, as: "payments" },
    ],
  });

  if (!data) {
    return null;
  }

  const {
    deliveryDate,
    deliveryTax,
    discount,
    address,
    payments,
    details,
    ...formatedData
  } = data.toJSON();

  formatedData.deliveryDate = formatDate(deliveryDate);
  formatedData.deliveryTax = formatCurrency(deliveryTax);
  formatedData.discount = formatCurrency(discount);
  formatedData.address = formatAddress(address);
  const totalPaid = payments.reduce((total, payment) => {
    total += payment.vl;
    return total;
  }, 0.0);

  const total =
    parseFloat(
      details.reduce((total, detail) => (total += detail.vl * detail.qty), 0.0)
    ) +
    parseFloat(data.deliveryTax) -
    parseFloat(data.discount);

  formatedData.totalPaid = formatCurrency(totalPaid);
  formatedData.total = formatCurrency(total);
  formatedData.remainingPayment = formatCurrency(total - totalPaid);
  formatedData.details = details.map((d) => {
    const {
      product: { name },
      comments,
      vl,
      ...obj
    } = d;

    obj.product = comments ? `${name} (${comments})` : name;
    obj.total = vl * obj.qty;
    obj.vl = vl;
    return obj;
  });

  return formatedData;
}

function formatCurrency(val) {
  const floatVal = parseFloat(val);
  return `R$ ${floatVal.toFixed(2)}`;
}

function formatDate(val) {
  if (!val) {
    return "";
  }

  return moment(val).format("DD/MM/YYYY");
}

function formatAddress(val) {
  if (!val) {
    return "";
  }

  const { address, number, complement, district } = val;

  let formated = address;
  formated += number ? `, ${number}` : "";
  formated += complement ? ` ${complement}` : "";
  formated += district ? ` - ${district}` : "";

  return formated;
}
