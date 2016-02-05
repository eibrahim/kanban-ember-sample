import Ember from 'ember';

export
default Ember.Component.extend({
  classNames: ['kb-column'],
  store: Ember.inject.service(),

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
        var card = this.get('store').createRecord(this.get('cardModel'), {
          name: `Card ${this.get('column.cards.length')+1}`
        });
        this.get('column.cards').pushObject(card);
        card.save().then(this.get('column').save());
      }
  }
});

