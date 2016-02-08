// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-widget-eagle-dispenser"], function (dispense) {
    console.log("test running of " + dispense.id);
    dispense.init();
    
    dispense.renderDispenserDrops({});

    dispense.onBeforeRender({});    
    dispense.onAfterRender({});
} /*end_test*/ );


cpdefine("inline:com-chilipeppr-widget-eagle-dispenser", ["chilipeppr_ready", "jquerycookie"], function () {
    return {
        id: "com-chilipeppr-widget-eagle-dispenser",
        url: "http://fiddle.jshell.net/xpix/w7noyp41/show/light/",
        fiddleurl: "http://jsfiddle.net/xpix/w7noyp41/",
        name: "Widget / BRD Import Dispenser",
        desc: "This widget lets you apply drops to PCB.",
        publish: {},
        subscribe: {},
        foreignPublish: {},
        foreignSubscribe: {
        },
        cannulaDiameter: 1,
        startreleaseoffset: 1.0,
        DispenserXoffset: 0.0,
        DispenserYoffset: 0.0,
        dispenserAxis: 'X',
        gcodeOrderNumber: 20,
        renderedDrops: [],
        colorsDrop: [0x298A08, 0x868A08, 0x8A0808] , // green, yellow, red
        options: {
           cannulaDiameter: 1,
           startreleaseoffset: 1.0,
           DispenserXoffset: 0.0,
           DispenserYoffset: 0.0,
           dispenserAxis: 'X'
        }, // holds base options before loading from localStorage
        init: function () {
            var that = this;

            // Setup canulla diameter
            for(var i = 0;i<=9;i++){
               $('#com-chilipeppr-widget-eagle-dispenser .dropdown-menu a').eq(i).click(that.setCanullaDiameter.bind(this)).prop('href', 'javascript:');
            }

            var el = $('#com-chilipeppr-widget-eagle-dispenser');
            this.setupUiFromLocalStorage(el);

            el.find('.dispenserAxis').change(function(evt) {
                console.log("evt:", evt);
                that.options.dispenserAxis = that.dispenserAxis = evt.currentTarget.valueAsNumber;
                that.saveOptionsLocalStorage();
            });
            el.find('.cannulaDiameter').change(function(evt) {
                console.log("evt:", evt);
                that.options.cannulaDiameter = that.cannulaDiameter = evt.currentTarget.valueAsNumber;
                $('#com-chilipeppr-widget-eagle .btn-refresh').trigger('click');
                that.saveOptionsLocalStorage();
            });
            el.find('.startreleaseoffset').change(function(evt) {
                console.log("evt:", evt);
                that.options.startreleaseoffset = that.startreleaseoffset = evt.currentTarget.valueAsNumber;
                that.saveOptionsLocalStorage();
            });
            el.find('.DispenserXoffset').change(function(evt) {
                console.log("evt:", evt);
                that.options.DispenserXoffset = that.DispenserXoffset = evt.currentTarget.valueAsNumber;
                that.saveOptionsLocalStorage();
            });
            el.find('.DispenserYoffset').change(function(evt) {
                console.log("evt:", evt);
                that.options.DispenserYoffset = that.DispenserYoffset = evt.currentTarget.valueAsNumber;
                that.saveOptionsLocalStorage();
            });

            // this.forkSetup();

            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/beforeRender", this, this.onBeforeRender);
            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/afterRender", this, this.onAfterRender);
            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/addGcode", this, this.onAddGcode);
        },
        onBeforeRender : function(that){
            console.log("Get onBeforeRender:", that);
            // remove all old drops
            this.renderedDrops.forEach(function(thing) {
                that.sceneRemove(thing);
            }, this);
        },
        onAfterRender : function(that){
            console.log("Get onAfterRender:", that);
            this.renderDispenserDrops(that);
        },
        onAddGcode : function(that){
            console.log("Get onAddGcode:", that);
            that.addGcode(this.gcodeOrderNumber , this.exportGcodeDispenser(that) );
        },
        setCanullaDiameter: function(evt){
            console.log("setCanullaDiameter. evt.data:", evt.data, "evt:", evt);
            var diameter = $(evt.currentTarget).attr('diameter');
            console.log("setCanullaDiameter. diameter:", diameter);
            $('#com-chilipeppr-widget-eagle-dispenser').find('.cannulaDiameter').val(diameter);
            $('#com-chilipeppr-widget-eagle-dispenser').find('.cannulaDiameter').trigger('change');
        },
        renderDispenserDrops:function(PARENT){
            var that = this;
            console.log('renderDispenserDrops: ', PARENT);

            if(! $('#com-chilipeppr-widget-eagle-dispenser .dispenser-active').is(':checked'))
               return;
            
            // get all smd pads,
            var clippers = PARENT.clipperBySignalKey;
            console.group("drawDispenserDrops");
            for ( keyname in clippers ){
               clippers[keyname].smds.forEach(function(smd){
                  // get absolute position'
                  var vector = new THREE.Vector3();
                  vector.setFromMatrixPosition( smd.threeObj.matrixWorld );

                  var diameter = that.cannulaDiameter+(that.cannulaDiameter/2);
                  var radius = diameter / 2;
                  var ar_drop = Math.PI * (radius*radius);
                  
                   // Calculate bigger smd pads as canulla diameter*2
                   // +-----+
                   // | O O |
                   // | O O |
                   // +-----+
                   var s = smd.smd;
                   var sgroup = smd.threeObjSmdGroup;
                   console.log("SMD Pad: ", smd);
                   if(s.dx >= diameter*2 || s.dy >= diameter*2){
                        var steps_x = Math.round(s.dx/diameter);
                        var steps_y = Math.round(s.dy/diameter);
                        var space_x = (s.dx-(steps_x * diameter)) / steps_x;
                        var space_y = (s.dy-(steps_y * diameter)) / steps_y;

                        var startx = vector.x-(s.dx/2) + radius + (space_x/2);
                        var starty = vector.y-(s.dy/2) + radius + (space_y/2);

                        var group = new THREE.Object3D();//create an empty container
                        for(var iy=1; iy <= steps_y; iy++){
                           for(var ix=1; ix <= steps_x;ix++){
                              var drop = PARENT.drawSphere(startx, starty, (that.cannulaDiameter/2), that.colorsDrop[0]);
                              group.add( drop );//add a mesh with geometry to it
                              startx += diameter + space_x;
                           }
                           startx = vector.x-(s.dx/2) + radius + (space_x/2);
                           starty += diameter + space_y;
                        }
                        that.renderedDrops.push(group);
                        if (s.rot != null) {
                           var rot = parseInt(s.rot.replace(/\D+/,''));
                           var r = (Math.PI / 180) * rot;
                           var axis = new THREE.Vector3(0, 0, 1);
                           PARENT.rotateAroundObjectAxis(group, axis, r);
                        }
                        PARENT.sceneAdd(group);
                   }  else {
                     // calculate area and mark drop with traffic colors
                     var ar_smd = s.dx * s.dy;
                     var percent = percent = ar_smd / (ar_drop/100); // area from drop greather then smd pad
                     if(ar_smd > ar_drop)                            // area from smd pad greather then drop
                        percent = ar_drop / (ar_smd/100);
                     var color = that.colorsDrop[0];
                     if(percent < 80)
                        color = that.colorsDrop[1];
                     if(percent < 50)
                        color = that.colorsDrop[2];
                     // draw a drop (cone) on this position
                     var drop = PARENT.drawSphere(vector.x, vector.y, (that.cannulaDiameter/2), color);
                     PARENT.sceneAdd(drop);
                     that.renderedDrops.push(drop);
                  }
               });
            }
            console.groupEnd("drawDispenserDrops");

            // finish
        },
        exportGcodeDispenserDrop:function(drop, count, PARENT){
            var g = '';
            var that = this;

            var dropDepth = (that.cannulaDiameter/2).toFixed(4); // got to 1/2 Diameter height, means 1mm drop / Z:0.5mm

            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition( drop.matrixWorld  );

            g += "(generate Drop Nr: " + count + ")\n";        // Comment to see the blocks
            g += "G0 F200 Z" + PARENT.clearanceHeight + "\n";         // save height               i.e: Z:1mm
            g += "G0 X" + (vector.x + that.options.DispenserXoffset).toFixed(4)
                        + " Y" + (vector.y + that.options.DispenserYoffset).toFixed(4)
                        + "\n";                                // got to position of drop
            g += "G0 Z" + dropDepth  + "\n";                   // careful go to dropdepth        i.e: Z:0.05mm
            g += "(chilipeppr_pause drop" 
                  + count + " G1 F100 "  
                  + that.dispenserAxis 
                  + that.cannulaDiameter 
                  + ")\n";                                     // Send pause event and wait for second cnc controller
            g += "G1 F200 Z" + PARENT.clearanceHeight + "\n";          // slow go up to 1mm/3 =    i.e: Z:0.33mm

            return g;
        },
        exportGcodeDispenser:function(PARENT){
            var g = '';
            var that = this;

            if(! $('#com-chilipeppr-widget-eagle .dispenser-active').is(':checked'))
               return g;

            console.group('exportGcodeDispenser');

            g += "(------ DISPENSER DROP's -------)\n";
            g += "M5 (spindle stop)\n";

            // generate gcode for every drop
            var i = 0;
            this.renderedDrops.forEach(function(thing) {
               console.log('Thing', thing);      
               if(thing.type == 'Object3D'){
                  thing.children.forEach(function(drop){
                     g += that.exportGcodeDispenserDrop(drop, ++i, PARENT);
                  });
               }
               else{
                  g += that.exportGcodeDispenserDrop(thing, ++i, PARENT);
               }
            }, this);

            console.log('Dispenser GCODE', g);
            console.groupEnd('exportGcodeDispenser');
            return g;
        },
        saveOptionsLocalStorage: function () {
            //var options = {
            //    showBody: this.options.showBody
            //};
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store cookie
            localStorage.setItem('com-chilipeppr-widget-eagle-dispenser-options', optionsStr);
        },
        setupUiFromLocalStorage: function (el) {
            // read vals from cookies
            var options = localStorage.getItem('com-chilipeppr-widget-eagle-dispenser-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            } else {
                options = {
                    showBody: true,
                    port: null,
                };
            }

            this.options = options;
            console.log("options:", options);

            // set input for every found key in input field
            for (var key in this.options) {
               el.find('.' + key).val( this.options[key] );
            }
        },
        forkSetup: function () {
            $('#com-chilipeppr-widget-eagle .panel-title').popover({
                title: this.name,
                content: this.desc,
                trigger: 'hover',
                placement: "auto",
                html: true,
                delay: 200,
                animation: true
            });

            // load the pubsub viewer / fork element which decorates our upper right pulldown
            // menu with the ability to see the pubsubs from this widget and the forking links
            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/xpix/qmt3e0sm/show/light/", function () {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function (pubsubviewer) {
                    pubsubviewer.attachTo($('#com-chilipeppr-widget-eagle .panel-heading .dropdown-menu'), that);
                });
            });

        },

   };
});  