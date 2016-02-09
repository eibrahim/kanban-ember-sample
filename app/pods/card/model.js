import DS from 'ember-data';

export
default DS.Model.extend({
  name: DS.attr(),
  order: DS.attr('number', {
    defaultValue: 0
  }),
  column: DS.belongsTo('column')
});

