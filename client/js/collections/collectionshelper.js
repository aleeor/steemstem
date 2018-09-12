Template.registerHelper('trendingContent', function () {
    if (Session.get('lang')) {
        if (Session.get('unfiltered')) {
            return Content.find(
                {
                    $or: [{ "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
                    { "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
                    { "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
                    { "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }

                    ]
                },
                { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
        }
        else {
            return Content.find(
                {
                    $or: [{ type: 'steemstem', "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
                    { type: 'steemstem', "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
                    { type: 'steemstem', "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
                    { type: 'steemstem', "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }

                    ]
                },
                { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
        }
    }
    else {
        return Content.find({ sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
})

Template.registerHelper('whitelistedContent', function () {
    if (Content.find().fetch()) {
        var whitelist = Session.get('settings').whitelist
        var contents = [];
        for (i = 0; i < whitelist.length; i++) {
            if (Content.findOne({type:'steemstem', author: whitelist[i] })) {
                contents.push(Content.findOne({ author: whitelist[i] }))
            }

        }
        return contents
    }
})

Template.registerHelper('searchedContents', function () {
    if (Session.get('currentSearch')) {
        if (Session.get('lang')) {
            if (Session.get('unfiltered')) 
                {
                    return Content.find(
                        {
                            $or: [{ search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
                            { search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
                            { search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
                            { search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }
        
                            ]
                        },
                        { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
                }
                else
                {
                    return Content.find(
                        {
                            $or: [{ type: 'steemstem', search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
                            { type: 'steemstem', search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
                            { type: 'steemstem', search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
                            { type: 'steemstem', search: new RegExp('.*' + Session.get('currentSearch'), 'i'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }
        
                            ]
                        },
                        { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
                }
        }

        else {
            return Content.find({ search: new RegExp('.*' + Session.get('currentSearch'), 'i') }, { limit: Session.get('visiblecontent') }).fetch()
        }
    }
})

Template.registerHelper('currentSuggestions', function () {
    if (Session.get('lang') && Content.find(
        {
            $or: [{ author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
            { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
            { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
            { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }

            ]
        },
        { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch() >= 1
    ) {
        return Content.find(
            {
                $or: [{ author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][0] },
                { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][1] },
                { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][2] },
                { author: Session.get('user'), "json_metadata.tags": Session.get('settings').languages[sessionStorage.getItem('lang')][3] }

                ]
            },
            { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }

    else {
        return Content.find({ author: Session.get('user') },
            { sort: { upvoted: -1 }, limit: Session.get('visiblecontent') }
        ).fetch()
    }
})

Template.registerHelper('currentArticle', function () {
    if (Content.findOne({ 'permlink': Session.get('article') })) {
        return Content.findOne({ 'permlink': Session.get('article') })
    }
})

Template.registerHelper('currentAuthor', function () {
    if (User.findOne({ name: Session.get('user') })) {
        return User.findOne({ name: Session.get('user') })
    }
})

Template.registerHelper('currentArticleComments', function () {
    if (Comments.find({ 'parent_permlink': Session.get('article') }).fetch()) {
        return Comments.find({ 'parent_permlink': Session.get('article') }).fetch()
    }
})

Template.registerHelper('currentCommentsSubcomments', function (comment) {
    if (Comments.find({ 'parent_permlink': comment.permlink }).fetch()) {
        return Comments.find({ 'parent_permlink': comment.permlink }).fetch()
    }
})

Template.registerHelper('currentAuthorFollowers', function (comment) {
    if (Comments.find({ 'parent_permlink': comment.permlink }).fetch()) {
        return Comments.find({ 'parent_permlink': comment.permlink }).fetch()
    }
})

Template.registerHelper('currentAuthorHistory', function (limit) {
    if (PersonalHistory.find().fetch()) {
        if (limit)
            return PersonalHistory.find({}, { limit: limit }).fetch().reverse()
        else
            return PersonalHistory.find().fetch().reverse()
    }
})

Template.registerHelper('currentAuthorBlog', function (comment) {
    if(!Content.findOne({ type: 'blog', from:Session.get('user') }))
    {
        Blog.getContentByBlog(Session.get('user'), 20, 'blog', function (error) {
            if (error) {
              console.log(error)
            }
          })
    }
      else
    return Content.find({ type: 'blog', from:Session.get('user') }).fetch()
})