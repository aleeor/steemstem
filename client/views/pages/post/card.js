Template.card.rendered = function () {
    $('.image.card')
        .visibility({
            type: 'image',
            transition: 'fade in',
            duration: 1000
        })

    $('.actipop')
        .popup();
}

Template.card.helpers({
})

Template.card.events({
    'click .image': function (event) {
        event.preventDefault()
        FlowRouter.go('/@' + this.author + '/' + this.permlink)
    },
    'click .description': function (event) {
        event.preventDefault()
        FlowRouter.go('/@' + this.author + '/' + this.permlink)
    },
    'click .header': function (event) {
        event.preventDefault()
        FlowRouter.go('#!/@' + this.author + '/' + this.permlink)
    },
    'click .button.actipop': function (event) {
        event.stopPropagation();
        event.preventDefault()
    },
    'click #user': function (event) {
        event.stopPropagation();
        event.preventDefault()
        FlowRouter.go('#!/@' + this.author)
    },
    'click  #vote': function (event) {
        event.preventDefault()
        event.stopPropagation();
        $('.ui.vote.modal').remove()
        $('article').append(Blaze.toHTMLWithData(Template.votemodal, { project: this }));
        $('.ui.vote.modal.' + this.permlink).modal('setting', 'transition', 'scale').modal('show')
        Template.votemodal.init()
    },
})

