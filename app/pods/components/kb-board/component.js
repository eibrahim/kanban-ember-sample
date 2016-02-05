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
        var c = this.get('store').createRecord(this.get('columnModel'), {
          name: `Column ${this.get('board.columns.length') + 1}`,
        });

        this.get('board.columns').pushObject(c);
        c.save();

        this.get('board').save();

        //c.save().then((data) => {
        //this.get('board.columns').pushObject(data);
        //this.get('board').save();
        //});
      }
  }
});

