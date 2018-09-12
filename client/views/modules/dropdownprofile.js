Template.dropdownprofile.rendered = function () {
    $('.ui.dropdown').dropdown()
  }

  Template.dropdownprofile.events({
    'click #logout': function (event) {
      event.preventDefault()
      MainUser.remove({})
      localStorage.removeItem('username')
      localStorage.removeItem('accesstoken')
      localStorage.removeItem('expireat')
    }
  })
  