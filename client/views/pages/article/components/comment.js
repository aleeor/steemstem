// Initiate the comment vote
Template.comment.events({
    'click  #vote': function (event) {
        event.preventDefault()
        event.stopPropagation();
        $('.ui.vote.modal').remove()
        $('article').append(Blaze.toHTMLWithData(Template.votemodal, { project: this }));
        $('.ui.vote.modal.' + this.permlink).modal('setting', 'transition', 'scale').modal('show')
        Template.votemodal.init()
    }
})

Template.comment.helpers(
{
    // Return true or false depending whether we are in the edit mode
    isOnEdit   : function() { return Session.get('isonedit') }
})

