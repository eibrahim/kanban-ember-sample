import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['kb-card'],

  attributeBindings: ['draggable'],
  draggable: true,
  setEventData: function(event) {
    event.dataTransfer.setData('card/x-drag', this.get('card.id'));
  }.on('dragStart'),

  actions: {

    deleteCard() {
        var card = this.get('card');
        this.get('card.column').then(column => {
          column.get('cards').removeObject(card);
          column.save().then(() => {
            card.destroyRecord();
          });

        });
      },
  }
});
