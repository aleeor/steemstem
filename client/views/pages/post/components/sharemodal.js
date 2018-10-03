
Template.sharemodal.events({
    'click .approve.steemit.button': function (event) {
        event.preventDefault()
        steemconnect.reblog(this.author, this.permlink, function (error, result) {
            if (error) {
                console.log(error)
                if (error.description)
                    console.log(error.description)
            } else {
                console.log(result)
            }
        }
        )
        $('.ui.share.modal.'+this.permlink)
        .modal('close')
        ;
    }
})