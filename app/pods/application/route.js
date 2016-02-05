import Ember from 'ember';

export
default Ember.Route.extend({
    model() {
            return this.store.findAll('board');
        },
        setupController(con, model, t) {
            this._super(con, model, t);
            con.set('currentBoard', model.get('firstObject'));

        }

});
