// Function testing the token validity
tokentest = function()
{
  if (localStorage.username)
  {
    var time = new Date();
    if (!localStorage.expires_at || (time.getTime() > Date.parse(localStorage.expires_at)) )
    {
      event.preventDefault()
      $('.ui.steemconnect.modal').remove()
      $('article').append(Blaze.toHTMLWithData(Template.steemconnectmodal, {data:this}));
      $('.ui.steemconnect.modal').modal('setting', 'transition', 'scale').modal('show')
      Template.steemconnectmodal.init()
      return false
    }
    else { return true }
  }
}

// Steemconnect machinery
steemconnect = {
  // Voting function
  vote: function (author, permlink, weight, cb)
  {
    localStorage.setItem('sc2_command', 'vote_'+author+'_'+permlink+'_'+weight)
    if(tokentest())
    {
      var voter = localStorage.username
      sc2.setAccessToken(localStorage.accesstoken);
      sc2.vote(voter, author, permlink, weight, function (err, result) { cb(err, result) })
      delete localStorage.sc2_command
    }
  },

  // Claiming rewards
  claimRewardBalance: function (reward_steem_balance, reward_sbd_balance, reward_vesting_balance, cb)
  {
    sc2.setAccessToken(localStorage.accesstoken);
    var voter = localStorage.username
    sc2.claimRewardBalance(voter, reward_steem_balance, reward_sbd_balance, reward_vesting_balance, function (err, result) { cb(err, result) })
  },

  // Comment
  comment: function (parentAuthor, parentPermlink, body, jsonMetadata, cb)
  {
    if (localStorage.username)
    {
      var time = new Date();
      if (time.getTime() > Date.parse(localStorage.expires_at))
      {
        console.log('token expired')
        window.location.href = sc2.getLoginURL()
      }
      var voter = localStorage.username
      sc2.setAccessToken(localStorage.accesstoken);
    }
    if (localStorage.guestuser)
    {
      var accounts = Session.get('factaccounts')
      var voter = accounts[0].name
      sc2.setAccessToken(accounts[0].token)
    }
    var permlink = Math.random(voter + parentPermlink).toString(36).substr(2, 9)
    sc2.comment(parentAuthor, parentPermlink, voter, permlink, permlink, body, jsonMetadata, function (err, result) { cb(err, result) })
  },

  // Sending a transaction to the blockchain
    send: function (operations, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expires_at)) {
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
        var follower = localStorage.username
        sc2.follow(follower, following, function (err, result) {
            cb(err, result)
        })
    },
    unfollow: function (unfollowing, cb) {
        sc2.setAccessToken(localStorage.accesstoken);
        var unfollower = localStorage.username
        sc2.unfollow(unfollower, unfollowing, function (err, result) {
            cb(err, result)
        })
    },
    reblog: function (author, permlink, cb) {
        if (localStorage.username) {
            var time = new Date();
            if (time.getTime() > Date.parse(localStorage.expires_at)) {
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
