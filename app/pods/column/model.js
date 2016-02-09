import Ember from 'ember';
import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  board: DS.belongsTo('board'),
  cards: DS.hasMany('card'),
  order: DS.attr('number', {
    defaultValue: 0
  }),

  sortedCards: function() {
    return this.get('cards').sortBy('order');
  }.property('cards.[].order'),

  destroyRecord() {
    this.get('cards').invoke('destroyRecord');
    return this._super(...arguments);
  },

  save() {
    this.get('cards').invoke('save');
    return this._super(...arguments);
  }
});

