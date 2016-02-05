import Ember from 'ember';

export
default Ember.Controller.extend({
    boards: Ember.computed.alias('model'),

    actions: {
        createBoard() {
                var b = this.store.createRecord('board', {
                    name: "My Board" + Date()
                });
                b.save();
            },

            viewBoard(b) {
                this.set('currentBoard', b);
            }
    }
});
