Template.registerHelper('steemStemContent', function () {
  if (Session.get('currentSearch'))
  {
    if (Session.get('unfiltered'))
    {
      return Content.find(
        {
          "json_metadata.tags": new RegExp('.*' + Session.get('currentSearch'), 'i'), language: Session.get('lang'), parent_author: ""
        },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
    else
    {
      return Content.find(
        { type: 'steemstem', parent_author: "", search: new RegExp('.*' + Session.get('currentSearch'), 'i'), language: Session.get('lang') },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
  }
  else
  {
    if (Session.get('unfiltered'))
    {
      return Content.find(
        { language: Session.get('lang'), parent_author: "" },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
    else
    {
      return Content.find(
        { type: 'steemstem', language: Session.get('lang'), parent_author: "" },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
  }
})

Template.registerHelper('whitelistedContent', function ()
{
  if (Content.find().fetch())
  {
    var whitelist = Session.get('settings').whitelist
    var contents = [];
    for (i = 0; i < whitelist.length; i++)
    {
      white_content = Content.findOne({ type: 'steemstem', author: whitelist[i] , parent_author: "" }, { sort: { created: -1 } })
      if (white_content)
      {
        contents.push(white_content)
      }
    }
    contents.sort(function (a, b) {
      var da = new Date(a.created).getTime();
      var db = new Date(b.created).getTime();
      return da > db ? -1 : da < db ? 1 : 0
    });
    return contents
  }
})

Template.registerHelper('currentSuggestions', function () {
    return Content.find({ type: 'blog', author: Session.get('user') },
        { sort: { active_votes: -1 }, limit: 6 }
    ).fetch()
})

Template.registerHelper('promoted', function () {
    return Promoted.find({}, { sort: { created: -1 } }).fetch()
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

// Getting the list of comments to an article
Template.registerHelper('currentArticleComments', function ()
{
  if(Comments.find({ 'parent_permlink': Session.get('article') }).fetch())
  {
        comments=Comments.find({'parent_permlink': Session.get('article') }).fetch()
        comments.sort(function(a,b) {
          var wa1 = parseInt(a.vote_rshares)
          var wb1 = parseInt(b.vote_rshares)
          weight_1 = wa1 > wb1 ? -1 : wa1 < wb1 ? 1 : 0
          wa1 = parseInt(a.net_votes)
          wb1 = parseInt(b.net_votes)
          weight_2 = wa1 > wb1 ? -1 : wa1 < wb1 ? 1 : 0
          wa1 = new Date(a.created).getTime();
          wb1 = new Date(b.created).getTime();
          weight_3 = wa1 > wb1 ? -1 : wa1 < wb1 ? 1 : 0
          weight = weight_1+weight_2
          return weight<0 ? -1 : weight>0 ? 1 : weight_3
        });
        return comments
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
    return Content.find({ type: 'blog', from: Session.get('user') }, { sort: { created: -1 }, limit: Session.get('visiblecontent') }).fetch()
})
