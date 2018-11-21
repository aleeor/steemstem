// Rendering of the page (nothing special)
Template.wallet.rendered = function () { }


Template.wallet.helpers(
{
  // Function evaluating whether the user has rewards to claim
  pendingReward: function (user) 
  {
    if (!user || !user.reward_sbd_balance || !user.reward_steem_balance || !user.reward_vesting_balance)
      return false
    if (user.reward_sbd_balance.split(' ')[0] > 0 || user.reward_steem_balance.split(' ')[0] > 0 ||
      user.reward_vesting_balance.split(' ')[0] > 0)  {return true}
  },

  // Function to get and display the rewards to be claimed
  displayReward: function (user)
  {
    if (Coins.findOne({ 'id': 'steem' }) && Coins.findOne({ 'id': 'steem-dollars' }))
    {
      var rewards = []
      if (user.reward_sbd_balance.split(' ')[0]     > 0) rewards.push(user.reward_sbd_balance)
      if (user.reward_steem_balance.split(' ')[0]   > 0) rewards.push(user.reward_steem_balance)
      if (user.reward_vesting_balance.split(' ')[0] > 0) rewards.push(user.reward_vesting_steem.split(' ')[0] +
        ' SP')
      return rewards.join(', ')
    }
  }
})

// Wallet actions
Template.wallet.events(
{
  // Claim reward button
  'click #claim': function (event)
  {
    var user = MainUser.findOne()
    event.preventDefault()
    steemconnect.claimRewardBalance(user.reward_steem_balance, user.reward_sbd_balance,
      user.reward_vesting_balance, function (error)
    {
      if (error) { console.log(error) }
      else
      {
        MainUser.add(localStorage.username, function (error) { if (error) { console.log(error) } })
        FlowRouter.reload()
      }
    })
  },

  // Wrapper calling the transfer form when called from STEEM
  'click .transfer': function (event)
  {
    event.preventDefault()
    event.stopPropagation();
    this.current_op = document.getElementById("operation-class").value
    $('.ui.transfer.modal').remove()
    $('article').append(Blaze.toHTMLWithData(Template.transfermodal, {data:this}));
    $('.ui.transfer.modal').modal('setting', 'transition', 'scale').modal('show')
    Template.transfermodal.init(document.getElementById("operation-class").value)
  },

  // Wrapper calling the transfer form when called from SP
  'click .transferSP': function (event)
  {
    event.preventDefault()
    event.stopPropagation();
    this.current_op = document.getElementById("operation-class-SP").value
    $('.ui.transfer.modal').remove()
    $('article').append(Blaze.toHTMLWithData(Template.transfermodal, {data:this}));
    $('.ui.transfer.modal').modal('setting', 'transition', 'scale').modal('show')
    Template.transfermodal.init(document.getElementById("operation-class-SP").value)
  },

  // Wrapper calling the transfer form when called from SBD
  'click .transferSBD': function (event)
  {
    event.preventDefault()
    event.stopPropagation();
    this.current_op = document.getElementById("operation-class-SBD").value
    $('.ui.transfer.modal').remove()
    $('article').append(Blaze.toHTMLWithData(Template.transfermodal, {data:this}));
    $('.ui.transfer.modal').modal('setting', 'transition', 'scale').modal('show')
    Template.transfermodal.init(document.getElementById("operation-class-SBD").value)
  },

  // Wrapper calling the transfer form when called from the STEEM savings menu
  'click .transfersavings': function (event)
  {
    event.preventDefault()
    event.stopPropagation();
    this.current_op = document.getElementById("operation-class-savings").value
    $('.ui.transfer.modal').remove()
    $('article').append(Blaze.toHTMLWithData(Template.transfermodal, {data:this}));
    $('.ui.transfer.modal').modal('setting', 'transition', 'scale').modal('show')
    Template.transfermodal.init(document.getElementById("operation-class-savings").value)
  },

  // Wrapper calling the transfer form when called from the SBD savings menu
  'click .transfersbdsavings': function (event)
  {
    event.preventDefault()
    event.stopPropagation();
    this.current_op = document.getElementById("operation-class-sbdsavings").value
    $('.ui.transfer.modal').remove()
    $('article').append(Blaze.toHTMLWithData(Template.transfermodal, {data:this}));
    $('.ui.transfer.modal').modal('setting', 'transition', 'scale').modal('show')
    Template.transfermodal.init(document.getElementById("operation-class-sbdsavings").value)
  }
})
