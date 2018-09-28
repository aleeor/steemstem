


Template.maincards.rendered = function () {

}
Template.maincards.events({
'click .loadmore': function (event) {
    var visible = Session.get('visiblecontent')
    Session.set('visiblecontent',visible+12)    
  }
})

Template.maincards.helpers({
  canLoadMore: function (coll) {
    if (coll.length > Session.get('visiblecontent'))
    return true
    else return false
}
})