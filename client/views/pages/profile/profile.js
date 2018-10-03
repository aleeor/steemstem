Template.profile.rendered = function () {
  $('.menu.profile .item').tab()
  if (Session.get('currentprofiletab')) {
    var tabmenu = Session.get('currentprofiletab');
    switch (tabmenu) {
      case 'blog':
        $('.menu.profile .item').tab('change tab', 'first')
        FlowRouter.go('/@' + Session.get('user'))
        break;
      case 'comments':
        $('.menu.profile .item').tab('change tab', 'second')
        break;
      case 'replies':
        $('.menu.profile .item').tab('change tab', 'tirdh')
        break;
      case 'rewards':
        $('.menu.profile .item').tab('change tab', 'fourth')
        break;
      case 'wallet':
        $('.menu.profile .item').tab('change tab', 'fifth')
        break;
      default:
        $('.menu.profile .item').tab('change tab', 'first')
    }
  }
  Session.set('visiblecontent',12)
  $('.ui.blog.bottom')
  .visibility({
      once: false,
      observeChanges: true,
      onBottomVisible: function () {
              Session.set('visiblecontent', Session.get('visiblecontent') + 8)
      }
  })
}




Template.profile.events({
  'click #blog': function (event) {
    event.preventDefault()
    FlowRouter.go('/@' + Session.get('user'))
  },
  'click #comments': function (event) {
    event.preventDefault()
    FlowRouter.go('/@' + Session.get('user') + '/comments')
  },
  'click #replies': function (event) {
    event.preventDefault()
    FlowRouter.go('/@' + Session.get('user') + '/replies')
  },
  'click #rewards': function (event) {
    event.preventDefault()
    FlowRouter.go('/@' + Session.get('user') + '/rewards')
  },
  'click #wallet': function (event) {
    event.preventDefault()
    FlowRouter.go('/@' + Session.get('user') + '/wallet')
  }
})
