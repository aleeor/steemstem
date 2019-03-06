// Rendering
Template.reply.rendered = function () {
    $('.ui.form.replyform').hide();
    Session.set('preview-reply','Add reply here...')
}


// Helpers
Template.reply.helpers({
    // Return true for the root comment
    isroot: function () { return (this.data.parent_author=='') },

    // Allow to get the content of the reply
    DisplayReplyBody: function() { return Session.get('preview-reply') }
})

// Events (on click)
Template.reply.events({
  // Action when clicking on the reply button
  'click .reply-action': function(event){
    // Hide the form and get information
    $('.ui.form.replyform').hide();
    document.getElementById('reply-button-'+this.data.permlink).style.display = "none";
    var element = ".reply-" + this.data.permlink;

    // A few lines to get the content of the text area
    if(!Session.get('preview-reply')) { Session.set('preview-reply','Add reply here...') }
    $('#reply-content-'+ this.data.permlink).on('input', function() {
      Session.set('preview-reply', kramed(this.value));
      if(this.value=='') { Session.set('preview-reply','Add reply here...') }
    });

    // Show the reply form
    $(element).show();
  },

  // Action when closing the reply window (and saving its content)
  'click .window.close':function(event){
    var element = ".reply-" + this.data.permlink;
    Session.set('preview-reply',$('#reply-content-'+ this.data.permlink).val())
    $(element).hide();
    document.getElementById('reply-button-'+this.data.permlink).style.display = "";
  },

  // Action when clicking on the submit button
  'click #submit-comment': function (event) {
    $('#submit-comment').addClass('loading')
    event.preventDefault()
    event.stopPropagation();
    Template.reply.comment(this.data)
  }
})

// Function dedicatsed to the reply submission
Template.reply.comment = function (article) {
  var body = $('#reply-content-'+ article.permlink).val()
  var json_metadata = { tags: 'steemstem', app: 'steemstem' }
  steemconnect.comment(article.author, article.permlink, body, json_metadata, function (error, result) {
    if (error) { console.log(error); if (error.description) { console.log(error.description) } }
    else
    {
      $('#submit-comment').removeClass('loading')
      Comments.loadComments(article.author, article.permlink, function (error) { if (error) { console.log(error) } })
      document.getElementById('reply-button-'+article.permlink).style.display = "";
    }
  })
}
