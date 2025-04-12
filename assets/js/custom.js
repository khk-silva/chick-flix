$(document).ready(function () {
  "use strict";

  /*==================================
* Author        : "Hiruni Silva"
* Template Name : ChickFlix HTML Template
* Version       : 1.0
==================================== */

 

  // 1. Scroll To Top
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {
      $(".return-to-top").fadeIn();
    } else {
      $(".return-to-top").fadeOut();
    }
  });
  $(".return-to-top").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500
    );
    return false;
  });

  // 2. welcome animation support

  $(window).load(function () {
    $(".welcome-chickflix-txt h2,.welcome-chickflix-txt p")
      .removeClass("animated fadeInUp")
      .css({ opacity: "0" });
    $(".welcome-chickflix-txt button")
      .removeClass("animated fadeInDown")
      .css({ opacity: "0" });
  });

  $(window).load(function () {
    $(".welcome-chickflix-txt h2,.welcome-chickflix-txt p")
      .addClass("animated fadeInUp")
      .css({ opacity: "0" });
    $(".welcome-chickflix-txt button")
      .addClass("animated fadeInDown")
      .css({ opacity: "0" });
  });

  // 3. owl carousel

  // i.  breed-classifications-carousel

  $("#breed-classifications-carousel").owlCarousel({
    items: 1,
    autoplay: true,
    loop: true,
    dots: true,
    mouseDrag: true,
    nav: false,
    smartSpeed: 1000,
    transitionStyle: "fade",
    animateIn: "fadeIn",
    animateOut: "fadeOutLeft",
    // navText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]
  });

  // ii. .testimonial-carousel

  var owl = $(".testimonial-carousel");
  owl.owlCarousel({
    items: 3,
    margin: 0,

    loop: true,
    autoplay: true,
    smartSpeed: 1000,

    //nav:false,
    //navText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],

    dots: false,
    autoplayHoverPause: false,

    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      640: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  // iii. .brand-item (carousel)

  $(".brand-item").owlCarousel({
    items: 6,
    loop: true,
    smartSpeed: 1000,
    autoplay: true,
    dots: false,
    autoplayHoverPause: false,
    responsive: {
      0: {
        items: 2,
      },
      415: {
        items: 2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 6,
      },
    },
  });

  $(".play").on("click", function () {
    owl.trigger("play.owl.autoplay", [1000]);
  });
  $(".stop").on("click", function () {
    owl.trigger("stop.owl.autoplay");
  });

  $("#breed-images-carousel").owlCarousel({
    autoplay: true, // Auto slide the images
    autoplayTimeout: 3000, // 3 seconds per slide
    items: 1, // Show one image at a time
    loop: true, // Loop through images
    nav: false, // No navigation buttons
    dots: true, // Show pagination dots
  });
});
