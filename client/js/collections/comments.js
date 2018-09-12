Comments = new Mongo.Collection(null)

Comments.loadComments = function (author, permlink, cb) {
  steem.api.getContentReplies(author, permlink, function (error, result) {
    if (result) {
      for (var i = 0; i < result.length; i++) {
        if (result[i].json_metadata) {
          result[i].json_metadata = JSON.parse(result[i].json_metadata)
        }
          var comment = result[i]
          Comments.upsert({ _id: comment.id }, comment)
          Comments.loadSubComments(result[i].author, result[i].permlink, function (error) {
            if (error)
              console.log(error)
          })
      }
    }
    cb(null)
  })
}

Comments.loadSubComments = function (author, permlink, cb) {
  steem.api.getContentReplies(author, permlink, function (error, result) {
    if (result) {
      for (var i = 0; i < result.length; i++) {
        if (result[i].json_metadata) {
          result[i].json_metadata = JSON.parse(result[i].json_metadata)
        }
          var comment = result[i]
          Comments.upsert({ _id: comment.id }, comment)
          Comments.loadSubComments(result[i].author, result[i].permlink, function (error) {
            if (error)
              console.log(error)
          })
      }
    }
  })
  cb(null)
}