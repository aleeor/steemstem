import moment from 'moment'

Template.home.helpers({

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
;
}

Template.home.events({
  'click .menu .item': function (event) {
    event.preventDefault()
    // if (event.target.name == 'news')
    //   Session.set('currentFilter', false)
    // else Session.set('currentFilter', event.target.name)

  },
  'click .loadmore': function (event) {
    var visible = Session.get('visiblecontent')
    Session.set('visiblecontent',visible+12)    
  }
})
