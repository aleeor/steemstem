steemconnect = {
    vote: function (author, permlink, weight, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expirein)) {
                console.log('token expired')
                window.location.href = sc2.getLoginURL()
            }
        }
        var voter = localStorage.username
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.vote(voter, author, permlink, weight, function (err, result) {
            cb(err, result)
        })
    },
    claimRewardBalance: function (reward_steem_balance, reward_sbd_balance, reward_vesting_balance, cb) {
        sc2.setAccessToken(localStorage.accesstoken);
        var voter = localStorage.username
        sc2.claimRewardBalance(voter, reward_steem_balance, reward_sbd_balance, reward_vesting_balance, function (err, result) {
            cb(err, result)
        })
    },
    comment: function (parentAuthor, parentPermlink, body, jsonMetadata, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expirein)) {
                console.log('token expired')
                window.location.href = sc2.getLoginURL()
            }
            var voter = localStorage.username
            sc2.setAccessToken(localStorage.accesstoken);
        }
        if (localStorage.guestuser) {
            var accounts = Session.get('factaccounts')
            var voter = accounts[0].name
            sc2.setAccessToken(accounts[0].token)
        }
        var permlink = Math.random(voter + parentPermlink).toString(36).substr(2, 9)
        sc2.comment(parentAuthor, parentPermlink, voter, permlink, permlink, body, jsonMetadata, function (err, result) {
            cb(err, result)
        })
    },
    send: function (operations, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expirein)) {
                console.log('token expired')
                window.location.href = sc2.getLoginURL()
            }
        }
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.broadcast(operations, function (err, result) {
            cb(err, result)
            console.log(result)
        })
    },
    follow: function (following, cb) {
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.follow(follower, following, function (err, result) {
            cb(err, result)
        })
    },
    unfollow: function (unfollowing, cb) {
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.unfollow(unfollower, unfollowing, function (err, result) {
            cb(err, result)
        })
    },
    reblog: function (author, permlink, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expirein)) {
                console.log('token expired')
                window.location.href = sc2.getLoginURL()
            }
        }
        var voter = localStorage.username
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.reblog(voter, author, permlink, function (err, result) {
            cb(err, result)
        })
    },
    me: function () {
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.me(function (error, result) {
            if(!error)
            {
                Session.set('userdata',result.user_metadata)
            }
            else
            console.log(error)
        })
    },
    updateUserMetadata:function(metadata,cb){
        sc2.setAccessToken(localStorage.accesstoken);
        sc2.updateUserMetadata(metadata, function (err, result) {
            console.log(err, result)
            if(result)
            {
                steemconnect.me()
                cb(null)
            }
            else cb(true)
          });
      
    }
}