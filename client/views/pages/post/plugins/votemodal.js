

Template.votemodal.rendered = function () {
}


Template.votemodal.init = function () {
    if (Session.get('currentVotingPercentage')) {
        var vp = Session.get('currentVotingPercentage')
        $('input[type="rangeslide"]').ionRangeSlider(
            {
                type: "single",
                min: 0,
                max: 100,
                from: vp,
                grid: true,
                keyboard: true,
                onChange: function (data) {
                    Session.set('currentVotingPercentage', data.from)
                }
            }
        )
    }
    else {
        $('input[type="rangeslide"]').ionRangeSlider(
            {
                type: "single",
                min: 0,
                max: 100,
                from: 50,
                grid: true,
                keyboard: true,
                onChange: function (data) {
                    Session.set('currentVotingPercentage', data.from)
                }
            }
        )
    }
    document.getElementById("confirmbutton").addEventListener("click", confirmVote);

    function confirmVote() {
        event.preventDefault()
        event.stopPropagation();
        $("#confirmbutton").addClass('loading')
        var weight = Session.get('currentVotingPercentage') * 100
        var author = $("#confirmbutton").attr("data-author")
        var permlink = $("#confirmbutton").attr("data-permlink")
        steemconnect.vote(author, permlink, weight, function (error, result) {
            if (result) {
                //console.log(result)
                $("#confirmbutton").removeClass('loading')
                $('.ui.vote.modal').modal('hide')
                Content.getContent(author,permlink,function(error){
                    if(error)
                    console.log(error)
                })
            }
            else {

            }
        });
    }
}

Template.votemodal.events({

})

Template.votemodal.vote = function (article) {
    console.log(article)
}
