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

  // Action when clicking on the edit button (replacement of the comment by a form to be edited)
  'click .edit-action': function(event){
    var link = this.data.author+'-'+this.data.permlink

    document.getElementById('comment-'+link).style.display = "none";
    document.getElementById('comment-edit-'+link).style.display = "";
    document.getElementById('edit-button-'+this.data.permlink).style.display = "none";
    document.getElementById('submit-edited-comment-'+this.data.permlink).style.display = "";
    Session.set('preview-comment-edit-'+link,document.getElementById('comment-edit-content-'+link).value);

    // For the preview of the new reply
    $('#comment-edit-content-'+link).on('input', function() {
        Session.set('preview-comment-edit-'+link, this.value);
        if(this.value=='') { Session.set('preview-comment-edit'+link,'Add reply here...') }
    })

  },

  // Action when closing the reply window (and saving its content)
  'click .window.close':function(event){
    var element = ".reply-" + this.data.permlink;
    Session.set('preview-reply',$('#reply-content-'+ this.data.permlink).val())
    $(element).hide();
    document.getElementById('reply-button-'+this.data.permlink).style.display = "";
  },

  // Action when clicking on the submit-comment button
  'click #submit-comment': function (event) {
    $('#submit-comment').addClass('loading')
    event.preventDefault()
    Template.reply.comment(this.data)
  },

  // Action when clicking on the comment-editing validation button
  'click .submit-edit-action': function (event) {
    document.getElementById('submit-edited-comment-'+this.data.permlink).classList.add('loading')
    event.preventDefault()
    Template.reply.updatecomment(this.data)
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

// Updating an existing comment and send to steemconnect; then updating the post display
Template.reply.updatecomment = function (article) {
  var newbody = Session.get('preview-comment-edit-'+article.author+'-'+article.permlink);
  var link = article.author+'-'+article.permlink
  steemconnect.updatecomment(article.parent_author, article.parent_permlink, article.permlink, article.title,
    newbody, article.json_metadata, function (error, res) {
      if (error) { console.log(error); if (error.description) { console.log(error.description) } }
      else
      {
        document.getElementById('comment-'+link).innerHTML=kramed(newbody)
        document.getElementById('submit-edited-comment-'+article.permlink).classList.remove('loading')
        Comments.loadComments(article.author, article.permlink, function (error) { if (error) { console.log(error) } })
        document.getElementById('comment-edit-'+link).style.display = "none";
        document.getElementById('submit-edited-comment-'+article.permlink).style.display = "none";
        document.getElementById('comment-'+link).style.display = "";
        document.getElementById('edit-button-'+article.permlink).style.display = "";
      }
  })
}

