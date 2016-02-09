import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  columns: DS.hasMany('column'),

  sortedColumns: function() {
    return this.get('columns').sortBy('order');
  }.property('columns.[].order'),

  destroyRecord() {
    this.get('columns').invoke('destroyRecord');
    return this._super(...arguments);
  },


  save() {
    this.get('columns').invoke('save');
    return this._super(...arguments);
  }
});

