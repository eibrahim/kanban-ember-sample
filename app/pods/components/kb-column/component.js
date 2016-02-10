import Ember from 'ember';
import DragDrop from '../../../mixins/dragdrop';

export
default Ember.Component.extend(DragDrop, {
  store: Ember.inject.service(),
  classNames: ['kb-column', 'item'],

  attributeBindings: ['data-id'],
  'data-id': function() {
    return this.get('column.id');
  }.property('column.id'),

  didInsertElement() {
    this.makeSortable({
      parentModel: 'column',
      childModel: 'card',
      connected: true
    });
  },


  actions: {
    deleteColumn() {
        var column = this.get('column');
        this.get('column.board').then(board => {
          board.get('columns').removeObject(column);
          board.save().then(() => {
            column.destroyRecord();
          });

        });
      },
      addCard() {
        this.get('column.cards').then(cards => {
          var max = cards.length ? cards.mapBy('order').sort().reverse()[0] + 1 : 1;
          var card = this.get('store').createRecord(this.get('cardModel'), {
            name: `Card ${this.get('column.cards.length')+1}`,
            order: max,
          });
          this.get('column.cards').pushObject(card);
          this.get('column').save();

        })
      }
  }
});

