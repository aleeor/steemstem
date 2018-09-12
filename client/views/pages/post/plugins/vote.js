

Template.vote.rendered = function () {
    $('input[type="rangeslide"]').ionRangeSlider(
        {
            type: "single",
            min: 0,
            max: 100,
            from: 50,
            grid: true,
            keyboard: true,
            onStart: function (data) {
                console.log("onStart");
            },
            onChange: function (data) {
                console.log("onChange");
            },
            onFinish: function (data) {
                console.log("onFinish");
            },
            onUpdate: function (data) {
                console.log("onUpdate");
            }
        }
    )
    // $("#range"+this.permlink).ionRangeSlider({
    //     type: "single",
    //     min: 0,
    //     max: 100,
    //     from: 50,
    //     keyboard: true,
    //     onStart: function (data) {
    //         console.log("onStart");
    //     },
    //     onChange: function (data) {
    //         console.log("onChange");
    //     },
    //     onFinish: function (data) {
    //         console.log("onFinish");
    //     },
    //     onUpdate: function (data) {
    //         console.log("onUpdate");
    //     }
    // });
}


Template.vote.events({
    'click .vote.abs': function (event) {
        event.preventDefault()
        event.stopPropagation();
    }
})
