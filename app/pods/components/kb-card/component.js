import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['kb-card'],

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
