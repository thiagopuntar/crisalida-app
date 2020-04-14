let $store = {};

// "async" is optional
export default ({ store }) => {
  $store = store;
}

export { $store }
