Content = new Mongo.Collection(null)

Content.getCreatedContent = function (tag, limit, type, cb) {
    var query = {
        tag: tag,
        limit: limit
    };
    steem.api.getDiscussionsByCreated(query, function (error, result) {
        if (!result)
            return cb(error)
        else {
            for (var i = 0; i < result.length; i++) {
                try {
                    result[i].type = type
                    result[i].json_metadata = JSON.parse(result[i].json_metadata)
                    if (!Content.findOne({ permlink: result[i].permlink }))
                        result[i].search = result[i].json_metadata.tags.join(' ')
                    result[i].surl = Content.CreateUrl(result[i].author, result[i].permlink)
                    Content.upsert({ _id: result[i].id }, result[i])
                } catch (error) {
                    console.log(error)
                    cb(error)
                }
            }
        }
    })
}

Content.getContentByAuthor = function (author, lastPermlink, cb) {
    var now = new Date();
    console.log(dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss"));

    steem.api.getDiscussionsByAuthorBeforeDate(author, lastPermlink, dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss"), 5, function (err, result) {
        console.log(err, result);
    });
    // steem.api.getDiscussionsByCreated(query, function (error, result) {
    //     if (!result)
    //         return cb(error)
    //     else {
    //         for (var i = 0; i < result.length; i++) {
    //             try {
    //                 result[i].type = type
    //                 result[i].json_metadata = JSON.parse(result[i].json_metadata)
    //                 if(!Content.findOne({permlink:result[i].permlink}))
    //                 result[i].search =  result[i].json_metadata.tags.join(' ')
    //                 result[i].surl = Content.CreateUrl(result[i].author, result[i].permlink)
    //                 Content.upsert({ _id: result[i].id }, result[i])
    //             } catch (error) {
    //                 console.log(error)
    //                 cb(error)
    //             }
    //         }
    //     }
    // })
}





Content.getContent = function (author, permlink, cb) {
    steem.api.getContent(author, permlink, function (error, result) {
        if (!result)
            return cb(true)
        else {
            if (result.json_metadata) {
                try {
                    result.json_metadata = JSON.parse(result.json_metadata)

                } catch (error) {
                    console.log(error)
                    cb(error)
                }
                if (Content.findOne({ permlink: result.permlink })) {
                    result.type = Content.findOne({ permlink: result.permlink }).type
                }
                result.search = result.json_metadata.tags.join(' ')
                result.surl = Content.CreateUrl(result.author, result.permlink)
                Content.upsert({ _id: result.id }, result)
            }
        }
        cb(null)
    });
}

Content.chainLoad = function () {
    if(Session.get('customtags'))
    {
        var tags = Session.get('customtags')
        for (i = 0; i < tags.length; i++) {
            if (tags[i].category != "home") {
                Content.getCreatedContent(tags[i].category, 10, 'featured', function (error) {
                    if (error) {
                        console.log(error)
                    }
                })
            }
        }
    }
}


Content.CreateUrl = function (author, permlink) {
    var url = ""
    url = "#!/@" + author + "/" + permlink
    return url
}
