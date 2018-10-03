Blog = new Mongo.Collection(null)

Blog.getContentByBlog = function (name, limit, type, cb) {
    Content.remove({ type: 'blog' })
    var query = {
        tag: name,
        limit: limit
    };
    steem.api.getDiscussionsByBlog(query, function (error, result) {
        if (!result)
            return cb(error)
        else {
            for (var i = 0; i < result.length; i++) {
                try {
                    result[i].json_metadata = JSON.parse(result[i].json_metadata)
                } catch (error) {
                    console.log(error)
                    cb(error)
                }
                //console.log(result[i])
                result[i].type = type
                result[i].from = name
                if (typeof result[i].json_metadata.tags === 'string')
                    result[i].json_metadata.tags = []
                else {
                    result[i].search = result[i].json_metadata.tags.join(' ')
                }
                result[i].surl = Content.CreateUrl(result[i].author, result[i].permlink)
                Content.upsert({ _id: result[i].id }, result[i])
            }
        }
    })
}