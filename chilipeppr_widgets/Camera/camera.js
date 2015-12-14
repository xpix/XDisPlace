requirejs.config({
    paths: {
        jqueryui: '//chilipeppr.com/js/jquery-ui-1.10.4/ui/jquery.ui.core',
        jqueryuiWidget: '//chilipeppr.com/js/jquery-ui-1.10.4/ui/jquery.ui.widget',
        jqueryuiMouse: '//chilipeppr.com/js/jquery-ui-1.10.4/ui/jquery.ui.mouse',
        jqueryuiResizeable: '//chilipeppr.com/js/jquery-ui-1.10.4/ui/jquery.ui.resizable',
    },
    shim: {
        jqueryuiWidget: ['jqueryui'],
        jqueryuiMouse: ['jqueryuiWidget'],
        jqueryuiResizeable: ['jqueryuiMouse' ]
    }
});

// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-widget-webcam-client"], function (hello) {
    console.log("test running of " + hello.id);
    hello.init();
} /*end_test*/ );

cpdefine("inline:com-chilipeppr-widget-webcam-client", ["chilipeppr_ready", "jquerycookie", 'jqueryuiResizeable'], function () {
    
    return {
        id: "com-chilipeppr-widget-webcam-client",
        url: "http://fiddle.jshell.net/xpix/wzfuf2ce/show/light/",
        fiddleurl: "http://jsfiddle.net/xpix/wzfuf2ce/",
        name: "Widget / webcam Client",
        desc: "This widget receives a html mjpeg video stream via webcam. You must have the server webcamXP.",
        publish: {},
        subscribe: {},
        foreignPublish: {},
        foreignSubscribe: {},
        init: function () {

            this.configBodyFromCookie();

            this.setupResizeable();

            this.loadImage();

            console.log(this.name + " done loading.");
        },
        loadImage: function(){
               var that = this;
               document.images.webcam1.src = "http://127.0.0.1:8080/loading.jpg";
               document.images.webcam1.src = "http://127.0.0.1:8080/cam_1.cgi";
               setTimeout(function(){
                  that.loadImage();
               }, 30000);
        },
        setupResizeable: function() {
            console.log("setting up resizeable");
            // load jquery-ui css, but make sure nobody else loaded it
            if (!$("link[href='//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css']").length)
            $('<link>')
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', '//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css');

            $( "#com-chilipeppr-widget-webcam-client" ).resizable({
                alsoResize: "#video-container",
                
                resize: function(evt) {
                    console.log("resize resize", evt);
                    $( ".com-chilipeppr-widget-webcam-client" ).css('height', 'initial');
                    $( "#video-container" ).css('width', 'initial');
                    
                },
                start: function(evt) {
                    console.log("resize start", evt);
                },
                stop: function(evt) {
                    console.log("resize stop", evt);
                    $( ".com-chilipeppr-widget-webcam-client" ).css('height', 'initial');
                    $( "#video-container" ).css('width', 'initial');
                }
            });
        },
        peer: null, // contains the top-level webcam obj
        clientid: null,
        serverid: null,
        currentUser: null,
        options: {},
        isBodyShowing: true,
        configBodyFromCookie: function() {
            // read vals from cookies
            console.log("configbodyfromcookie");
            var options = $.cookie('com-chilipeppr-widget-webcam-client');
            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
                this.options = options;
                
                // see if showing/hiding body
                if (options.showBody)
                    this.showBody();
                else
                    this.hideBody();
            }
        },
        saveCookie: function() {
            var options = this.options;
            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store cookie
            $.cookie('com-chilipeppr-widget-webcam-client', optionsStr, {
                expires: 365 * 10,
                path: '/'
            });
            this.options = options;
        },
        toggleBody: function(evt) {
            if (this.isBodyShowing)
                this.hideBody(evt);
            else
                this.showBody(evt);
        },
        showBody: function(evt) {
            $('#com-chilipeppr-widget-webcam-body').removeClass('hidden');
            $('#com-chilipeppr-widget-webcam-client .hidebody span').addClass('glyphicon-chevron-up');
            $('#com-chilipeppr-widget-webcam-client .hidebody span').removeClass('glyphicon-chevron-down');

            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveCookie();
            }
            this.isBodyShowing = true;
        },
        hideBody: function(evt) {
            $('#com-chilipeppr-widget-webcam-body').addClass('hidden');
            $('#com-chilipeppr-widget-webcam-client .hidebody span').removeClass('glyphicon-chevron-up');
            $('#com-chilipeppr-widget-webcam-client .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveCookie();
            }
            this.isBodyShowing = false;
        }
    }
});