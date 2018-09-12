AccountHistory = new Mongo.Collection(null)

AccountHistory.getAccountHistory = function (username, start, end, cb) {
    steem.api.getAccountHistory(username, start, end, function (error, result) {
        if (result) {
            for (i = 0; result.length > i; i++) {
                AccountHistory.filterhistory(result[i])
            }
            cb(null)
        }
        else {
            cb(true)
        }
    })
}



AccountHistory.filterhistory = function (transaction) {
    if (!Content.findOne({ permlink: transaction[1].op[1].permlink })) {
        switch (transaction[1].op[0]) {
            case 'vote':
                steem.api.getContent(transaction[1].op[1].author, transaction[1].op[1].permlink, function (error, result) {
                    if (!result)
                        return
                    else {
                        if (result.json_metadata) {
                            try {
                                result.json_metadata = JSON.parse(result.json_metadata)
                            } catch (error) {
                                //console.log(error)
                            }
                            result.search = result.json_metadata.tags.join(' ')
                            result.surl = Content.CreateUrl(result.author, result.permlink)
                            result.type = 'steemstem'
                            result.upvoted = transaction[1].op[0].weight
                            if (result.parent_author = result.root_author || !result.root_author) {
                                Content.upsert({ _id: result.id }, result)
                            }
                        }
                    }
                });
                break;
            case 'comment':
                steem.api.getContent(transaction[1].op[1].author, transaction[1].op[1].permlink, function (error, result) {
                    if (!result)
                        return
                    else {
                        if (result.json_metadata) {
                            try {
                                result.json_metadata = JSON.parse(result.json_metadata)
                            } catch (error) {
                                //console.log(error)
                            }
                            result.search = result.json_metadata.tags.join(' ')
                            result.surl = Content.CreateUrl(result.author, result.permlink)
                            result.type = 'comment'
                            result.upvoted = transaction[1].op[0].weight
                            Content.upsert({ _id: result.id }, result)
                        }
                    }
                });
                break;
            default:
                break;
        }
    }
}