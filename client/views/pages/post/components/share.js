
Template.share.events({
    'click .facebook.button': function (event) {
        event.stopPropagation();
    },
    'click .twitter.button': function (event) {
        event.stopPropagation();
    },
    'click .linkedin.button': function (event) {
        event.stopPropagation();
    },
    'click .google.button': function (event) {
        event.stopPropagation();
    },
    'click .steemit.button': function (event) {
        event.stopPropagation();
        event.preventDefault()
        
        $('.ui.share.modal').remove()
        $('article').append(Blaze.toHTMLWithData(Template.sharemodal, { project: this }));
        $('.ui.share.modal.' + this.permlink).modal('setting', 'transition', 'scale').modal('show')
    }
})