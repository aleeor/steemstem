Template.article.rendered = function ()
{
  Deps.autorun(function ()
  {
    if(Session.get('isonedit'))
    {
       steemconnect.me();

       $('#newarticle').form({
         on: 'blur',
         fields: {
           title: {
             identifier: 'title',
             rules: [
               {
                 type: 'empty',
                 prompt: translate('COMMON_TYPE_A_TITLE')
               },
               {
                 type: 'minLength[5]',
                 prompt: translate('COMMON_AT_LEAST_FIVECHAR')
               },
               {
                 type: 'maxLength[80]',
                 prompt: translate('COMMON_AT_MOST_EIGHTYCHAR')
               }
             ]
           },
           summernote: {
             identifier: 'summernote',
             rules: [
               {
                 type: 'empty',
                 prompt: translate('COMMON_TYPE_DESCRIPTION')
               }
             ]
           }
         }
       })
    }

    sleep(500)
    $('article').visibility(
    {
      once: false,
      // update size when new content loads
      observeChanges: true,
      // load content on bottom edge visible
      onBottomVisible: function ()
      {
        // loads a max of 5 times 
        if(!Comments.findOne({ 'parent_permlink': Session.get('article') }))
          Comments.loadComments(Session.get('user'), Session.get('article'),
            function (error) { if (error) { console.log(error) } })
      }
    });


  })
}

// Set of helper methods to be used in the HTML document
Template.article.helpers(
{
    // Return true or false depending whether we are in the edit mode
    isOnEdit   : function()
    {
      var cond1=Session.get('isonedit'); if(!cond1) {cond1=false;}
      var cond2 = (Session.get('editlink')==Session.get('article')); if(!cond2) {cond2=false;}
      return (cond1&&cond2)
    },

    // This gets the post content and sets it into the edition form
    loadNote   : function(postbody, tagsarray)
    {
      $(document).ready(function()
      {
        // Initializing the WYSIWYG editor
        $('#summernote').summernote({
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
          ],
          callbacks:
           {onImageUpload: function (files) { Template.create.handleFiles(files);}},
          height: 400
        });

        // Loading the post body
        $('#summernote').summernote('code', postbody);

        // Taking care of the initialisation of the tag list
        $('.ui.multiple.dropdown').dropdown({
          allowAdditions: true,
          keys: {  delimiter: 32, },
          onNoResults: function (search) {},
          onChange: function () {
            var tags = $('#tags').attr('value').split(",").length;
            if($('#tags').attr('value').split(',').includes('steemstem'))
              tags--
            if (tags <= 3)
              $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions', true);
            else if (tags==4) {
              $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions', false);
              $('.to.message.yellow').removeClass('hidden');
              $('.to.message.yellow').addClass('visible');
            }
          }
        });
        $('.ui.multiple.dropdown').dropdown('clear');
        var ntags=0
        if(tagsarray!=null)
        {
          for (i = 0; i < tagsarray.length; i++)
          {
            if(tagsarray[i]!='steemstem')
            {
              ntags++
              if(ntags==4)
              {
                 $(".ui.multiple.dropdown").dropdown("set selected", tagsarray[i])
                 $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions',false);
                 $('.to.message.yellow').removeClass('hidden');
                 $('.to.message.yellow').addClass('visible');
              }
              else
              {
                 $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions',true);
                 $(".ui.multiple.dropdown").dropdown("set selected", tagsarray[i])
              }
            }
          }
        }
        $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions',true);
      })
    },

    // Loading the comments
    loadComments: function()
    {
      comments = Comments.find({ 'parent_permlink': Session.get('article')}).fetch()
      if(comments) {return comments }
    }
})


// Allow to wait a little bit before executing a script
function sleep(milliseconds)
{
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++)
  {
    if ((new Date().getTime() - start) > milliseconds) { break; }
  }
}

// Post edition: definition of the buttons
Template.article.events(
{
  // Cancel
  'click .ui.button.reset': function(event)
  {
    Session.set('isonedit', 'false')
    Session.set('editlink', '')
    FlowRouter.reload();
  },

  // Submit
  'click .ui.button.submit': function (event)
  {
    event.preventDefault()
    if ($('#newarticle').form('is valid'))
    {
      $('#newarticle').form('validate form')
      $('.ui.button.submit').addClass('loading')
      var project = Template.article.UpdateProject(document.getElementById('newarticle'))
      if(project)
        Template.create.submitproject(project)
    }
    else { $('#newarticle').form('validate form') }
  }

})


// Getting the meta data of the post to submit on the blockchain
Template.article.UpdateProject = function(form)
{
  old_content = Content.findOne({ 'permlink': Session.get('article') })
  tags = form.tags.value
  if(tags=="") { tags=['steemstem'] }
  else         { tags = tags.split(','); tags.unshift('steemstem') }

  if(old_content)
  {
    old_content.json_metadata.tags  = tags;
    var project_to_edit = [
      ['comment',
        {
          parent_author   : old_content.parent_author,
          parent_permlink : old_content.parent_permlink,
          author          : old_content.author,
          permlink        : old_content.permlink,
          title           : form.title.value,
          body            : form.body.value,
          json_metadata   : JSON.stringify(old_content.json_metadata)
        }
      ]
    ];
    return project_to_edit
  }
}


