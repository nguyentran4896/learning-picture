jQuery(function($) {
    "use strict";

    var learnEnglish = window.learnEnglish || {};

    /*=======================================
    =             MAIN FUNCTION             =
    =======================================*/
    learnEnglish.smoothScroll = function() {
        // Select all links with hashes
        $('a[href*="#"]')
          // Remove links that don't actually link to anything
          .not('[href="#"]')
          .not('[href="#0"]')
          .click(function(event) {
            // On-page links
            if (
              location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
              && 
              location.hostname == this.hostname
            ) {
              // Figure out element to scroll to
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
              // Does a scroll target exist?
              if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                  scrollTop: target.offset().top
                }, 1000, function() {
                  // Callback after animation
                  // Must change focus!
                  var $target = $(target);
                  $target.focus();
                  if ($target.is(":focus")) { // Checking if the target was focused
                    return false;
                  } else {
                    $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                    $target.focus(); // Set focus again
                  };
                });
              }
            }
          });
    };

    learnEnglish.headerFunction = function() {
        //js for menu PC
        // Add class fixed for menu when scroll
        var window_height = $(window).height();

        $(window).on('scroll load', function (event) {
            if ($(window).scrollTop() > window_height) {
                $(".header-main").addClass('header-fixed');
            }
            else {
                $(".header-main").removeClass('header-fixed');
                $(".header-main").removeClass('hide-menu');
            }
        });

        // Show menu when scroll up, hide menu when scroll down
        var lastScroll = 50;
        $(window).on('scroll load', function (event) {
            var st = $(this).scrollTop();
            if (st > lastScroll) {
                $('.header-main').addClass('hide-menu');
                if ($('.nav-search').hasClass('hide') === false) {
                    $('.nav-search').toggleClass('hide');
                }
            }
            else if (st < lastScroll) {
                $('.header-main').removeClass('hide-menu');
            }

            if ($(window).scrollTop() <= 200 ){
                $('.header-main').removeClass('.header-fixed').removeClass('hide-menu');
            }
            else if ($(window).scrollTop() < window_height && $(window).scrollTop() > 0) {
                $('.header-main').addClass('hide-menu');
            }
            lastScroll = st;
        });

        
        // Show - hide box search on menu
        $('.button-search').on('click', function () {
            $('.nav-search').toggleClass('hide');
            $('.nav-search input').focus();
        });

        //hide box seach when click outside
        $('body').on('click', function (event) {
            if ($('.button-search').has(event.target).length === 0 && !$('.button-search').is(event.target) && $('.nav-search').has(event.target).length === 0 && !$('.nav-search').is(event.target)) {
                if ($('.nav-search').hasClass('hide') === false) {
                    $('.nav-search').toggleClass('hide');
                }
            }
        });

        // Menu Mobile
        $(".wrapper-menu-mobile").css("min-height", $(window).height());
        $(".wrapper-search-mobile").css("min-height", $(window).height());

        // show menu
        $(".hamburger-menu-mobile").on("click", function(){
            $('body').addClass("open-menu-mobile");
        });
        $(".mb-button-close").on("click", function(){
            $('body').removeClass("open-menu-mobile");
        });

        //show search
        $(".button-search-mobile").on("click", function(){
            $('body').addClass("open-search-mobile");
        });
        $(".mb-button-close").on("click", function(){
            $('body').removeClass("open-search-mobile");
        });


        // show hide dropdown menu
        $('.mb-nav>.dropdown>.icons-dropdown').on('click', function(){
            if ($(this).parents('.dropdown').hasClass('mb-menu-dropdown-open') === true) {
                $(this).parents('.dropdown').removeClass('mb-menu-dropdown-open');
            }
            else {
                $('.mb-nav .dropdown').removeClass('mb-menu-dropdown-open');
                $(this).parents('.dropdown').addClass('mb-menu-dropdown-open');
            }
        });
        $('.dropdown-2 .icons-dropdown').on('click', function(){
            $(this).parents('.dropdown-2').toggleClass('mb-menu-dropdown-open');
        });
    };

    learnEnglish.mainFunction = function() {

        // ----------------------- WOW-JS --------------------------- //
        new WOW().init();


        // ----------------------- SELECTBOX --------------------------- //
        if($(".selectbox").length) {
            $(".selectbox").selectbox();
            $('body').on('click', function(event){
                if ( $('.sbHolder').has(event.target).length === 0 && !$('.sbHolder').is(event.target)) {
                    $(".selectbox").selectbox('close');
                }
            });
        }
        
        // ----------------------- BACK TOP --------------------------- //
        $('#back-top .link').on('click', function () {
            $('body,html').animate({
                scrollTop: 0
            }, 900);
            return false;
        });

        var temp = $(window).height();
        $(window).on('scroll load', function (event) {
            if ($(window).scrollTop() > temp){
                $('#back-top .link').addClass('show-btn');
            }
            else {
                $('#back-top .link').removeClass('show-btn');
            }
        });

        // ------------------------- Slick Slider ----------------------- //

        // List team info
            $(".list-team-info").slick({
                    dots: false,
                    arrows: true,
                    infinite: true,
                    speed: 700,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    responsive: [
                        {
                            breakpoint: 1025,
                            settings: {
                                slidesToShow: 3,
                                dots: true,
                                arrows: false,
                            }
                        },
                        {
                            breakpoint: 769,
                            settings: {
                                slidesToShow: 2,
                                dots: true,
                                arrows: false,
                            }
                        },
                        {
                            breakpoint: 415,
                            settings: {
                                slidesToShow: 1,
                                dots: true,
                                arrows: false,
                            }
                        }
                    ]
            });

        // Set height tab list vertical
            if ($(window).width()>1024) {
                if ($(".tab-vertical").length) {
                    // set height 0 to counter table-cell calculate height
                    $(".tab-vertical .tab-list").height(0);
                    
                    var contentHeight = $(".tab-vertical .tab-content").height();
                    $(".tab-vertical .tab-list").height(contentHeight);
                    
                }
            }
    };

    learnEnglish.home_slider = function() {
        
        $('.background-slide').slick({
            dots: true,
            arrows: false,
            speed: 700,
            fade: true,
            autoplay: true,
            autoplaySpeed: 7000,
            cssEase: 'linear',
            pauseOnHover: false
        });

        $('.background-slide').on('afterChange', function(event, slick, currentSlide){
            $('.slick-active  .group-title').addClass('animated fadeInDown');
            //$('.slick-active  .description').addClass('animated fadeInUp');
            $('.slick-active  .btn-left').addClass('animated fadeInLeft');
            $('.slick-active  .btn-right').addClass('animated fadeInRight');

            $('.slick-active  .group-title').removeClass('hidden');
            //$('.slick-active  .description').removeClass('hidden');
            $('.slick-active  .btn-left').removeClass('hidden');
            $('.slick-active  .btn-right').removeClass('hidden');
        });

        $('.background-slide').on('beforeChange', function(event, slick, currentSlide){
            $('.slick-active  .group-title').removeClass('animated fadeInDown');
            //$('.slick-active  .description').removeClass('animated fadeInUp');
            $('.slick-active  .btn-left').removeClass('animated fadeInLeft');
            $('.slick-active  .btn-right').removeClass('animated fadeInRight');

            $('.slick-active  .group-title').addClass('hidden');
            //$('.slick-active  .description').addClass('hidden');
            $('.slick-active  .btn-left').addClass('hidden');
            $('.slick-active  .btn-right').addClass('hidden');
        });

    };

    learnEnglish.uploader = function() {
        var fc = null, sc = null, flat = false;

        $(".list-keywords .keyword").click( function(){
            if( $(this).hasClass("correct") || $(this).hasClass("correct") || $(this).hasClass("is-selected") ) return;
            if( flat == true) return;

            if( fc == null ) {
                fc = $(this);
                fc.addClass("correct");
            } else {
                sc = $(this);
                //console.log( fc.attr("idKey") + "   " +  sc.attr("idKey") );
                if( fc.attr("idKey") == sc.attr("idKey") ) {
                    sc.addClass("correct");

                    flat = true;
                    setTimeout(function(){ 
                        flat = false;
                        fc.addClass("is-selected fadeOut").removeClass("correct").removeClass("wrong");
                        sc.addClass("is-selected fadeOut").removeClass("correct").removeClass("wrong");
                        fc = sc = null;
                    }, 5000);
                } else {
                    sc.addClass("wrong");

                    flat = true;
                    setTimeout(function(){ 
                        flat = false;
                        fc.removeClass("correct").removeClass("wrong");
                        sc.removeClass("correct").removeClass("wrong");
                        fc = sc = null;
                    }, 5000);
                }
            }

        });
    };

    learnEnglish.countDown = function() {
        if( $('.count-down').length > 0 ) {
            console.log("test");

            $('.count-down').each(function(idx, dom ){
                var expire = $( dom ).data( 'expire' );
                var arr = expire.split(/[- :]/); 

                if( expire ) {
                    expire = new Date( arr[0], arr[1] - 1, arr[2], arr[3], arr[4], 0 ); 
                    expire = new Date( expire ).getTime(); 
                    var days    = $( dom ).find('.days span');
                    var hours   = $( dom ).find('.hours span');
                    var minutes = $( dom ).find('.minutes span');
                    var seconds = $( dom ).find('.seconds span');
                    var itv_id = window.setInterval(function () {
                        var current = new Date(); 
                        current = new Date(current).getTime(); 

                        var seconds_left = ( expire - current ) / 1000;

                        if( seconds_left <= 0 ) {
                            window.clearInterval( itv_id );
                            return;
                        }
                        var i_day = '', i_hour = '', i_sec = '', i_min = '';
                        i_day = parseInt( seconds_left / 86400 );
                        days.text( i_day >= 10 ? i_day : '0' + i_day );
                        
                        seconds_left %= 86400;
                        i_hour = parseInt( seconds_left / 3600 );
                        hours.text( i_hour >= 10 ? i_hour : '0' + i_hour );
                        
                        seconds_left %= 3600;
                        i_min = parseInt( seconds_left / 60 );
                        minutes.text( i_min >= 10 ? i_min : '0' + i_min );
                        
                        i_sec = parseInt( seconds_left % 60 );
                        seconds.text( i_sec >= 10 ? i_sec : '0' + i_sec );
                    }, 1000);
                }
            });
        }
    };

    /*======================================
    =            INIT FUNCTIONS            =
    ======================================*/

    $(document).ready(function() {
        learnEnglish.smoothScroll();
        learnEnglish.headerFunction();
        learnEnglish.mainFunction();
        learnEnglish.home_slider();
        learnEnglish.uploader();
        learnEnglish.countDown();
    });

    /*=====  End of INIT FUNCTIONS  ======*/

    $(window).on('load', function() {
    });

});
