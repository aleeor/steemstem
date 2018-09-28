import moment from 'moment'

Template.home.helpers({
  isGridView: function () {
    return Session.get('gridview')
}
})

Template.home.rendered = function () {
  $('.menu .item').tab()
  $('.filter.checkbox')
  .checkbox({
    // check all children
    onChecked: function() {
    Session.set('unfiltered',true)
    },
    // uncheck all children
    onUnchecked: function() {
      Session.set('unfiltered',false)
    }
  })
  Session.set('gridview',false)
}

Template.home.events({
  'click .menu .item': function (event) {
    event.preventDefault()
    // if (event.target.name == 'news')
    //   Session.set('currentFilter', false)
    // else Session.set('currentFilter', event.target.name)

  },
  'click .switch': function (event) {
    event.preventDefault()
    Session.set('gridview',!Session.get('gridview'))
  }
})
