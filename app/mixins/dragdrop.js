import Ember from 'ember';

export
default Ember.Mixin.create({
  makeSortable(parentModel, itemModel, model, items, selector, connectWith) {
      this.set('_itemsProperty', items);
      this.set('_modelProperty', model);
      this.set('_itemModel', itemModel);
      this.set('_parentModel', parentModel);

      var self = this;
      var isReceiving = false;
      this.$(selector).sortable({
        connectWith: connectWith,
        receive(event, ui) {
          isReceiving = true;
          var itemId = ui.item.data('id');
          self.receiveItem(itemId).then(() => {
            self.updateIndexes.call(self);
          });
        },
        remove(event, ui) {
          var itemId = ui.item.data('id');
          self.removeItem(itemId).then(() => {
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
      var items = this.get(`${this.get('_modelProperty')}.${this.get('_itemsProperty')}`);
      this.$().find('.item:not(.item .item)').each(function(index) {
        var id = $(this).data('id');
        var item = items.findBy('id', id);
        if (item) {
          item.set('order', index)
        };
      });
      items.invoke('save');
      this.endPropertyChanges();
    },

    removeItem(itemId) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        if (!itemId) {
          resolve();
        } else {
          this.get('store').find(this.get('_itemModel'), itemId).then(item => {
            var oldParent = this.get('_parentModel');
            oldParent.get(this.get('_itemsProperty')).then((oldItems) => {
              oldItems.removeObject(item);
              oldParent.save().then(() => {
                resolve();
              });
            });
          });
        }
      });
    },

    receiveItem(itemId) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        if (!itemId) {
          resolve();
        } else {
          this.get('store').find(this.get('_itemModel'), itemId).then(item => {
            var newParent = this.get(this.get('_parentModel'));
            newParent.get(this.get('_itemsProperty')).then(newItems => {
              newItems.pushObject(item);
              newParent.save().then(() => {
                newParent.reload(); // for some reason if i take this out newly created columns disappear after drag and drop
                resolve();
              });
            });
          });
        }
      });
    },
});

