AccountHistory = new Mongo.Collection(null)

AccountHistory.getAccountHistory = function (username, start, end, cb) {
    steem.api.getAccountHistory(username, start, end, function (error, result) {
        if (result) {
            for (i = 0; result.length > i; i++) {
                if (result[i][1].op[1].voter = 'steemstem' && result[i][1].op[0] === "vote" && !AccountHistory.findOne({ _id: result[i][1].op[1].permlink })) {
                    AccountHistory.insert({_id : result[i][1].op[1].permlink})
                    AccountHistory.filterhistory(result[i])
                }
            }
            cb(null)
            Content.chainLoad()
        }
        else {
            cb(true)
        }
    })
}



AccountHistory.filterhistory = function (transaction) {
    steem.api.getContent(transaction[1].op[1].author, transaction[1].op[1].permlink, function (error, result) {
        if (!result)
            return
        else {
            if (result.json_metadata) {
                try { result.json_metadata = JSON.parse(result.json_metadata) } catch (error) { }
                result.search = ''
                var ntags = 0
                if('tags' in result.json_metadata)
                {
                    result.search = result.json_metadata.tags.join(' ')
                    ntags = result.json_metadata.tags.length
                }
                result.surl = Content.CreateUrl(result.author, result.permlink)
                result.type = 'steemstem'
                for (var t = 0; t < ntags; t++) {
                    if (!result.language)
                        result.language = FilterLanguage(result.json_metadata.tags[t])
                    else {
                        t = result.json_metadata.tags.length
                    }
                }
                if (!result.language)
                    result.language = 'en'
                    result.upvoted = transaction[1].op[0].weight
                    result._id = result.id
                    Content.upsert({ _id: result._id }, result)
            }
        }
    });
}

FilterLanguage = function (tag) {
    var langs = Session.get('settings').languages
    if (tag != 'steemstem') {
        for (var key in langs) {
            if (langs.hasOwnProperty(key)) {
                if (Session.get('settings').languages[key].includes(tag)) {
                    return key
                }
            }
        }
    }
}
