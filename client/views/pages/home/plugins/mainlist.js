


Template.mainlist.rendered = function () {

}
Template.mainlist.events({
'click .loadmore': function (event) {
    var visible = Session.get('visiblecontent')
    Session.set('visiblecontent',visible+12)    
  }
})