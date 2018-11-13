Template.edit.rendered = function () {
    $('.ui.form').hide();
}

Template.edit.helpers({
    isOnEdit: function () {
        return Session.get('isonedit')
    }
})



Template.edit.events(
{
  'click .edit-action': function(event)
  {
    Session.set('isonedit', 'true')
    Session.set('editlink', this.data.permlink)
    FlowRouter.reload();
  }
})
