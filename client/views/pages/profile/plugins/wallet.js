Template.wallet.rendered = function () {
  $('.ui.dropdown').dropdown()
}


Template.wallet.helpers({
  pendingReward: function (user) {
    if (!user || !user.reward_sbd_balance || !user.reward_steem_balance || !user.reward_vesting_balance) return false
    if (user.reward_sbd_balance.split(' ')[0] > 0
      || user.reward_steem_balance.split(' ')[0] > 0
      || user.reward_vesting_balance.split(' ')[0] > 0)
      return true
  },

  displayReward: function (user) {
    if (Coins.findOne({ 'id': 'steem' }) && Coins.findOne({ 'id': 'steem-dollars' })) {
      var rewards = []
      if (user.reward_sbd_balance.split(' ')[0] > 0)
        rewards.push(user.reward_sbd_balance)
      if (user.reward_steem_balance.split(' ')[0] > 0)
        rewards.push(user.reward_steem_balance)
      if (user.reward_vesting_balance.split(' ')[0] > 0)
        rewards.push(user.reward_vesting_steem.split(' ')[0] + ' SP')
      return rewards.join(', ')
    }
  }
})




Template.wallet.events({
  'click #claim': function (event) {
    var user = MainUser.findOne()
    event.preventDefault()
    steemconnect.claimRewardBalance(user.reward_steem_balance, user.reward_sbd_balance, user.reward_vesting_balance, function (error) {
      if (error) {
        console.log(error)
      }
      else {
        User.add(localStorage.username, function (error) {
          if (error) console.log(error)
        })
        MainUser.add(localStorage.username, function (error) {
          if (error) {
            console.log(error)
          }
        })
      }
    })
  }
})