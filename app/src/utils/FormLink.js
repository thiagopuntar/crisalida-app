const actions = ['add', 'edit'];

export default class FormLink {
  /**
   * @param {string} action Choose between 'add' or 'edit'.
   * @param {any} record Object that will be passed to list.
   */
  constructor(action, record) {
    this._action = action;
    this._record = record;
  }

  update(recordList, updateFn = r => r.id === this._record.id) {
    if (this._action === 'add') {
      this._addRecord(recordList);

    } else if (this._action === 'edit') {
      this._updateRecord(recordList, updateFn);

    } else {
      throw new Error(`Ação não implementada. Utilizar as opções ${actions.join(',')}` );
    }
  }

  _addRecord(recordList) {
    recordList.push(this._record);
  }

  _updateRecord(recordList, fn) {
    recordList.splice(recordList.findIndex(fn), 1, this._record);
  }
}
