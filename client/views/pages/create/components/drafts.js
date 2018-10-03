Template.drafts.rendered = function () {
    $('.ui.tiny.image img')
        .visibility({
            type: 'image',
            transition: 'fade in',
            duration: 1000
        })
}

Template.drafts.events({
    'click .ui.mini.button.remove': function (event) {
        event.preventDefault()
        event.stopPropagation();
        Template.drafts.removeDraft(this)
    }
    ,'click .ui.item.draft': function (event) {
        event.preventDefault()
        Template.create.loadDraft(this)
    }
})

Template.drafts.addToDraft = function(form){
    var drafts = []
    if(Session.get('userdata'))
    userdata =  Session.get('userdata')
    var draft = {title:form.title.value,body:form.body.value,tags:form.tags.value,last_update:Date.now()}
    drafts.push(draft)
    userdata.drafts = drafts
    steemconnect.updateUserMetadata(userdata,function(error){
        if(error)
        {
            console.log(error)
        }
    })
}

Template.drafts.removeDraft = function(draft){
    var userdata = Session.get('userdata')
    userdata.drafts = userdata.drafts.filter(function(el) {
        return el.body !== draft.body;
    });
    steemconnect.updateUserMetadata(userdata,function(error){
        if(error)
        {
            console.log(error)
        }
    })
}
