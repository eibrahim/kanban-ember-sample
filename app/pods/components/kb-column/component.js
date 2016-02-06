import Ember from 'ember';
import Droppable from '../../../mixins/droppable';

export
default Ember.Component.extend(Droppable, {
  classNames: ['kb-column'],
  store: Ember.inject.service(),

  tagName: 'x-drop',

  validateDragEvent: function(event) {
    return event.dataTransfer.types.contains('card/x-drag');
  },
  acceptDrop: function(event) {
    var cardId = event.dataTransfer.getData('card/x-drag');
    if (cardId) {
      this.get('store').find('card', cardId).then(card => {
        var col = this.get('column');
        card.get('column').then(oldCol => {
          oldCol.get('cards').then((oldCards) => {
            oldCards.removeObject(card);
            col.get('cards').then(newCards => {
              newCards.pushObject(card);
              card.set('column', col);
              col.save().then(() => {
                oldCol.save().then(() => {
                  card.save();
                });
              });
            });

          });

        });
      });
    }
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
        var card = this.get('store').createRecord(this.get('cardModel'), {
          name: `Card ${this.get('column.cards.length')+1}`
        });
        this.get('column.cards').pushObject(card);
        card.save().then(this.get('column').save());
      }
  }
});

