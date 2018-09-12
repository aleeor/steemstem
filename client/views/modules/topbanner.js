var carousel = require('owl.carousel')



Template.topbanner.rendered = function () {
      $("#test").owlCarousel({
        items: 3,
        margin: 0,
        autoHeight: false,
        autoplay: true,
        rewind: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        arrow: true
    })
  }