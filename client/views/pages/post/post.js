Template.post.rendered = function () {
    $('.image .image.post')
        .visibility({
            type: 'image',
            transition: 'fade in',
            duration: 1000
        })

    $('.actipop')
        .popup()
        ;
    var card = document.querySelector('.card');
    card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
    });
}

Template.post.helpers({
})

Template.post.events({
    'click .extra.content': function (event) {
        event.preventDefault()
        FlowRouter.go('/@' + this.author + '/' + this.permlink)
    },
    'click .content': function (event) {
        event.preventDefault()
        FlowRouter.go('/@' + this.author + '/' + this.permlink)
    },
    'click .button.actipop': function (event) {
        event.stopPropagation();
        event.preventDefault()
    },
    'click #user': function (event) {
        event.stopPropagation();
        event.preventDefault()
        FlowRouter.go('/@' + this.author)
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

