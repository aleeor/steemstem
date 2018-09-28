Template.article.rendered = function () {
    // if (Content.findOne({ 'permlink': Session.get('article') })) {
    //     var selec = document.getElementById('selection')
    //     selec.onmouseup = selec.onkeyup = selec.onselectionchange = function (event) {
    //         if (event.which != 1) return
    //         else {
    //             document.getElementById("sel").innerHTML = Template.article.getSelectionText();
    //         }

    //     };
    // }

    sleep(1000)
    $('article')
        .visibility({
            once: false,
            // update size when new content loads
            observeChanges: true,
            // load content on bottom edge visible
            onBottomVisible: function () {
                // loads a max of 5 times 
                if (!Comments.findOne({ 'parent_permlink': Session.get('article') }))
                    Comments.loadComments(Session.get('user'), Session.get('article'), function (error) {
                        if (error)
                            console.log(error)
                    })
            }
        })
    //steemconnect.me()

}


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }