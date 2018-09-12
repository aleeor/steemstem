Template.create.rendered = function () {
    steemconnect.me()
    $('.ui.multiple.dropdown').dropdown({
        allowAdditions: true,
        keys: {
          delimiter: 32, 
        },
        onNoResults: function (search) { }, 
        onChange: function () {
          var tags = $('#tags').val().split(",").length;
          if (tags <= 3) {
            $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions', true);
          }
          else {
            $('.ui.multiple.dropdown').dropdown('setting', 'allowAdditions', false);
          }
        }
      });
    $('#summernote').summernote({
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen']],
        ],
        callbacks: {
            onImageUpload: function (files) {
                Template.create.handleFiles(files);
            }
        },
        height: 400,
        placeholder : "Your post here..."
    });
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

Template.create.events({
    'click .ui.button.submit': function (event) {
        event.preventDefault()
        if ($('#newarticle').form('is valid')) {
            $('#newarticle').form('validate form')
            $('.ui.button.submit').addClass('loading')
            var project = Template.create.createProject(document.getElementById('newarticle'))
            Template.create.submitproject(project)
        }
        else {
            $('#newarticle').form('validate form')
          }
    },
    'click .ui.button.reset': function (event) {
            var form = document.getElementById('newarticle')
            form.title.value = ''
            form.title.placeholder = 'Type your title'
            var markupStr = 'Your post here...';
            $('#summernote').summernote('code', markupStr);
            $('.ui.multiple.dropdown').dropdown('clear');
            event.preventDefault()
    },    
    'click .ui.button.save': function (event) {
        event.preventDefault()
        Template.drafts.addToDraft(document.getElementById('newarticle'))
    }
})




Template.create.createProject = function(form){
    var permlink;
    var title = form.title.value
    var body = form.body.value
    var tags = form.tags.value
    tags = tags.split(',')
    tags.push('steemstemtest')
    if(sessionStorage.editpermlink)
    {
        permlink = sessionStorage.editpermlink
    }
    else{
        permlink = title.replace(/\s+/g, '-').toLowerCase().slice(0,20)

    }
    var author = localStorage.username
    var json_metadata = {
        tags: tags,
        app: 'steemstem'
    }
    if(sessionStorage.editpermlink)
    {
        permlink =  sessionStorage.editpermlink
        var percent_steem_dollars = 10000
        var project_to_publish = [
            ['comment',
                {
                    parent_author: '',
                    parent_permlink: tags[0],
                    author: author,
                    permlink: projectnumber,
                    title: title,
                    body: body,
                    json_metadata: JSON.stringify(json_metadata)
                }
            ]
        ];
        return project_to_publish
    }
    else{
        var percent_steem_dollars = 10000
        var project_to_publish = [
            ['comment',
                {
                    parent_author: '',
                    parent_permlink: tags[0],
                    author: author,
                    permlink: permlink,
                    title: title.replace(/[^a-zA-Z0-9]/g,' '),
                    body: body,
                    json_metadata: JSON.stringify(json_metadata)
                }
            ],
            ['comment_options', {
                author: author,
                permlink: permlink,
                max_accepted_payout: '1000000.000 SBD',
                percent_steem_dollars: percent_steem_dollars,
                allow_votes: true,
                allow_curation_rewards: true,
                extensions: [
                    [0, {
                        beneficiaries:  [
                            { account: 'steemstem', weight: 1500 }  
                          ] }]
                ]
            }]
        ];
        return project_to_publish
    }
}


Template.create.loadDraft = function (draft) {
    var form = document.getElementById('newarticle')
    form.title.value = draft.title
    $('#summernote').summernote('code', draft.body);
    $('.ui.multiple.dropdown').dropdown('clear');
    var tagsarray = draft.tags.split(',')
    if (tagsarray.length > 1) {
      for (i = 0; i < tagsarray.length; i++) {
        $(".ui.multiple.dropdown").dropdown("set selected", tagsarray[i])
      }
    }
    else{
        $('.ui.multiple.dropdown').dropdown("set selected", draft.tags)
    }
    event.preventDefault()
}

Template.create.submitproject = function (project) {
        steemconnect.send(project,
            function (error, result) {
                if (error) {
                    $('#postprob').removeClass("hidden")
                    $('#postprob').text(error)
                    if(error.error_description)
                    $('#postprob').text(error.error_description)
                    console.log(error.error_description)
                } else {
                    $('#postprob').addClass("hidden")
                    $('.ui.button.submit').removeClass('loading')
                    FlowRouter.go('#!/@' + project[0][1].author + '/' + project[0][1].permlink)
                }
            }
        )
}

const cloudName = 'drrz8xekm';
const unsignedUploadPreset = 'steemstem';

Template.create.uploadFile = function (file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.upload.addEventListener("progress", function (e) {
        console.log(`fileuploadprogress data.loaded: ${e.loaded},data.total: ${e.total}`);
        if (e.loaded === e.total) {
        }
    });
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response)
            var url = response.secure_url;
            var tokens = url
            var img = new Image();
            img.src = tokens
            img.alt = response.public_id;
            console.log(img)
            $('#summernote').summernote('insertImage', img.src, img.alt);
        }
    };
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload');
    fd.append('file', file);
    xhr.send(fd);
}

Template.create.handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        Template.create.uploadFile(files[i]);
    }
};