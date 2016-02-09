import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  columns: DS.hasMany('column'),

  destroyRecord() {
    this.get('columns').invoke('destroyRecord');
    return this._super(...arguments);
  },


  save() {
    this.get('columns').invoke('save');
    return this._super(...arguments);
  }
});

