
Template.footer.events({
    'click .item.about': function (event) {
        event.preventDefault()
        FlowRouter.go('/aboutus' + this.author + '/' + this.permlink)
    },
    'click .item.faq': function (event) {
        event.preventDefault()
        FlowRouter.go('/faq' + this.author + '/' + this.permlink)
    },
    'click .item.tos': function (event) {
        event.preventDefault()
        FlowRouter.go('/tos')
    }
})