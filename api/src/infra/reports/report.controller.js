const path = require('path');
const fs = require('fs-extra');
const hbs = require('handlebars');
const moment = require('moment');
const { order, orderDetails } = require('../database');

exports.order = async (req, res) => {
  const data = await getOrder(req.params.id);

  if (!data) {
    res.status(404).send('Pedido não localizado.');
  }

  const filePath = path.join(__dirname, '/orders/order.report.hbs');
  const html = await fs.readFile(filePath, 'utf-8');
  const reportCompiled = hbs.compile(html)(data);

  res.send(reportCompiled);
}

exports.test = getOrder;

async function getOrder(id) {

  const data = await order.findByPk(id, { 
    include: [
      order.customer,
      order.address,
      { 
        association: order.details,
        as: 'details',
        include: [ orderDetails.product ]
      },
      { association: order.payments, as: 'payments' }
    ]
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

  const total = parseFloat(details.reduce((total, detail) => total += (detail.vl * detail.qty), 0.0)) + 
    parseFloat(data.deliveryTax) - parseFloat(data.discount);

  formatedData.totalPaid = formatCurrency(totalPaid);
  formatedData.total = formatCurrency(total);
  formatedData.remainingPayment = formatCurrency(total - totalPaid);
  formatedData.details = details.map(d => {
    const { product: { name }, vl, ...obj } = d;

    obj.product = name;
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
    return '';
  }

  return moment(val).format('DD/MM/YYYY');
}

function formatAddress(val) {
  const { address, number, complement, district, contact } = val;

  let formated = address;
  formated += number && `, ${number}`;
  formated += complement && ` ${complement}`;
  formated += district && ` - ${district}`;

  return formated;
}