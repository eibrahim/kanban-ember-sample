import Ember from 'ember';

export
default Ember.Component.extend({
  classNames: ['kb-column'],
  store: Ember.inject.service(),

  didInsertElement() {
    var self = this;
    var isReceiving = false;
    this.$('.column-sortable').sortable({
      connectWith: '.column-sortable',
      receive(event, ui) {
        isReceiving = true;
        var receivedCardId = ui.item.data('id');
        self.receiveCard(receivedCardId).then(() => {
          self.updateIndexes.call(self);
        });
      },
      remove(event, ui) {
        var removedCardId = ui.item.data('id');
        self.removeCard(removedCardId).then(() => {
          self.updateIndexes.call(self);
        });
      },
      update(event, ui) {
        if (isReceiving) {
          isReceiving = false;
        } else {
          self.updateIndexes.call(self);
        }
      }
    });
  },

  updateIndexes() {
    this.beginPropertyChanges();
    var cards = this.get('column.cards');
    this.$('.item').each(function(index) {
      var id = $(this).data('id');
      var card = cards.findBy('id', id);
      if (card) {
        card.set('order', index)
      };
    });
    cards.invoke('save');
    this.endPropertyChanges();
  },

  removeCard(cardId) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!cardId) {
        resolve();
      } else {
        this.get('store').find('card', cardId).then(card => {
          var oldCol = this.get('column');
          oldCol.get('cards').then((oldCards) => {
            oldCards.removeObject(card);
            oldCol.save().then(() => {
              resolve();
            });
          });
        });
      }
    });
  },

  receiveCard(cardId) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!cardId) {
        resolve();
      } else {
        this.get('store').find('card', cardId).then(card => {
          var newColumn = this.get('column');
          newColumn.get('cards').then(newCards => {
            newCards.pushObject(card);
            card.set('column', newColumn);
            newColumn.save().then(() => {
              this.set('column', newColumn);
              resolve();
            });
          });
        });
      }
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
            order: max
          });
          this.get('column.cards').pushObject(card);
          card.save().then(this.get('column').save());

        })
      }
  }
});

