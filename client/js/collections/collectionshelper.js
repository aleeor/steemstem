// Main function to get the list of new steemstem posts
Template.registerHelper('steemStemContent', function () {
  if (Session.get('currentSearch'))
  {
    if (Session.get('unfiltered'))
    {
      return Content.find(
        {
          "json_metadata.tags": new RegExp('.*' + Session.get('currentSearch'), 'i'),
          language: Session.get('lang'), parent_author: ""
        },
        { sort: { upvoted: -1, created: -1 }, limit: Session.get('visiblecontent') }).fetch()
    }
    else
    {
      return Content.find(
        { type: 'steemstem', parent_author: "", search: new RegExp('.*' + Session.get('currentSearch'), 'i'),
           language: Session.get('lang') },
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

// Main function to get the list of posts made by the whitelisted authors
Template.registerHelper('whitelistedContent', function ()
{
  if (Content.find().fetch())
  {
    var whitelist = Session.get('settings').whitelist
    var contents = [];
    for (i = 0; i < whitelist.length; i++)
    {
      white_content = Content.findOne({ type: 'steemstem', author: whitelist[i] , parent_author: "" },
        { sort: { created: -1 } })
      if (white_content) { contents.push(white_content) }
    }
    contents.sort(function (a, b) {
      var da = new Date(a.created).getTime();
      var db = new Date(b.created).getTime();
      return da > db ? -1 : da < db ? 1 : 0
    });
    return contents
  }
})


// Main fuction to get a loist of suggestions of posts written by a given author
Template.registerHelper('currentSuggestions', function () {
  return Content.find({ type:'blog', author:Session.get('user') }, { sort: { active_votes: -1 }, limit: 6 }).fetch()
})


// Get the list of promoted posts
Template.registerHelper('promoted', function () { return Promoted.find({}, { sort: { created: -1 } }).fetch() })


// Main function to get a specific article
Template.registerHelper('currentArticle', function () {
    if (Content.findOne({ 'permlink': Session.get('article') }))
      { return Content.findOne({ 'permlink': Session.get('article') }) }
})


// Get information on a specific author
Template.registerHelper('currentAuthor', function () {
  if (User.findOne({ name: Session.get('user') })) { return User.findOne({ name: Session.get('user') }) }
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

// Getting the replies to a comment
Template.registerHelper('currentCommentsSubcomments', function (comment) {
  if (Comments.find({ 'parent_permlink': comment.permlink }).fetch())
    { return Comments.find({ 'parent_permlink': comment.permlink }).fetch() }
})


// Get the list of followers to a given author
Template.registerHelper('currentAuthorFollowers', function (comment) {
  if (Comments.find({ 'parent_permlink': comment.permlink }).fetch())
    { return Comments.find({ 'parent_permlink': comment.permlink }).fetch() }
})


// Get the history associated with a given author
Template.registerHelper('currentAuthorHistory', function (limit) {
  if (PersonalHistory.find().fetch())
  {
    if (limit)
      return PersonalHistory.find({}, { limit: limit }).fetch().reverse()
    else
      return PersonalHistory.find().fetch().reverse()
  }
})

// Get all blog posts from an author
Template.registerHelper('currentAuthorBlog', function (stop=0) {
  var author  = Session.get('user');
  var lim     = Session.get('visiblecontent');
  var content = Blog.find({from:author}, {sort:{created:-1}, skip:stop, limit:lim}).fetch();
  var last    = Blog.find({from:author}, {sort:{created:1}, limit:1}).fetch()
  if((stop+content.length)==Blog.find({from:author}).fetch().length && Session.get('Query-done'))
    Session.set('more-blogs',false)
  if(content.length<lim && last.length>0)
  {
    if(Session.get('Queried')!=last[0].permlink && !Session.get('Query-done'))
    {
      Blog.getContentByBlog(author,51,'blog',function(error){if(error) {console.log(error)}},
        last[0].permlink, last[0].author);
      Session.set('Queried', last[0].permlink)
    }
  }
  return content;
})
