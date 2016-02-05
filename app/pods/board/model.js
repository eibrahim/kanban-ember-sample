import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  columns: DS.hasMany('column'),


  destroyRecord() {
    this.get('columns').invoke('destroyRecord');
    this._super(...arguments);
  }
});

