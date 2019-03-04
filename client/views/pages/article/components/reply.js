// Rendering
Template.reply.rendered = function () {
    $('.ui.form.replyform').hide();
}


// Helpers
Template.reply.helpers({
    // Return true for the root comment
    isroot: function () { return (this.data.parent_author=='') }
})

// Events (on click)
Template.reply.events({
  // Action when clicking on the reply button
  'click .reply-action': function(event){
    $('.ui.form.replyform').hide();
    var element = ".reply-" + this.data.permlink;
    $(element).show();
  },

  // Action when closing the reply window
  'click .window.close':function(event){
    var element = ".reply-" + this.data.permlink;
    $(element).hide();
  },

  // Action when clicking on the submit button
  'click #submit-comment': function (event) {
    event.preventDefault()
    event.stopPropagation();
    Template.reply.comment(this.data)
  }
})

// Function dedicatsed to the reply submission
Template.reply.comment = function (article) {
  var body = $('#reply-content-'+ article.permlink).val()
  $('#submit-comment').addClass('loading')
  var json_metadata = { tags: 'steemstem', app: 'steemstem' }
  steemconnect.comment(article.author, article.permlink, body, json_metadata, function (error, result) {
    if (error) { console.log(error); if (error.description) { console.log(error.description) } }
    else
    {
      $('#submit-comment').removeClass('loading')
      Comments.loadComments(article.author, article.permlink, function (error) { if (error) { console.log(error) } })
    }
  })
}
