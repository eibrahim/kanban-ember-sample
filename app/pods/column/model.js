import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  board: DS.belongsTo('board'),
  cards: DS.hasMany('card'),

  destroyRecord(){
    this.get('cards').invoke('destroyRecord');
    this._super(...arguments);
  }
});

