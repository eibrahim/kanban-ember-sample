import Ember from 'ember';

export
default Ember.Component.extend({
  store: Ember.inject.service('store'),
  classNames: ['kb-board'],
  classNameBindings: ['hidden'],

  hidden: function() {
    return !this.get('board');
  }.property('board'),

  actions: {

    deleteBoard() {
        this.get('board').destroyRecord();
      },

      addColumn() {
        var board = this.get('board');

        board.get('columns').then(columns => {
          var max = columns.length ? columns.mapBy('order').sort().reverse()[0] + 1 : 1;
          var newColumn = this.get('store').createRecord(this.get('columnModel'), {
            name: `Column ${this.get('board.columns.length') + 1}`,
            order: max,
          });
          columns.pushObject(newColumn);
          board.save();
        });
      }
  }
});

