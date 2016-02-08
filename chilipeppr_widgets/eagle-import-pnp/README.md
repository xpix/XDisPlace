Presentation:
-------------

Philosophy:
* "simple as possible"
* no camera needed cuz accurate position of PNP Holder
* automaticly sortet components to Trays and pockets
* position on CNC in every case the same
* after homing you can use it

Platform: (Photo)
* milled in MDF, future Delron(POM) or Aluminium
* Holes for accurate position on whaste board
* Trays or Feeder numbered from 1 ... 8
* Pockets lettered from A-L
* Screw's to hold PCB in 1mm deep Pocket
* Tunnels for Probe wire's
* Calibrate block to find zero point

Strategy for Trays:
* Nozzle move the smd tape to next position
   https://youtu.be/CVlad7l9HvI?t=463
* Structure of a tray: 
   http://www.token.com.tw/chip-resistor/smd-resistor1.htm
* 1. move nozzle to zero line (cambam) of Tray
* 2. move 1.75mm in X Direction
* 3. deep nozzle in a hole 
* 4. move tape 4mm in Y direction 
* 5. go back to smd position and get it

Strategy for Pockets:
* Nozzle move the smd pocket to pocket and get smd component
   https://youtu.be/CVlad7l9HvI?t=463
* 1. move nozzle to zero line (cambam) of Tray
* 2. move 1.75mm in X Direction
* 3. deep nozzle in a hole 
* 4. move tape 4mm in Y direction 
* 5. go back to smd position and get it

PNP Plugin: 
==========
* Parameters 
   * only PNP gcode
      * send only this pnp gcode to machine
      * can use for pcb's made in china or osh park with stencil
   * packagesTrays, packagesPockets:
      * decide of this input which smd component are sorted to tray or pockets
      * user can input regular expressions (DIL\d+-SMD)
   * safetyHeight:
      * heighest point for nozzle to move without problems
      * Screw's height are ~10mm
   * RotationAxis:
      * axis on the second grbl controller to rotate the nozzle stepper for right direction
      * resistor in example
      * all roation values can see in trays/pockets table
   * Nozzle Outsidediameter
      * image: noki_nozzle.jpg 
      * diameter on the smallest side of noozle
      * use for calculate the way to next cmp in tape
   * PNP Holder
      * load pnp holder data from json file
      * designs for more holder 
      * horicontal, vertical Design

* Configure trays
   * Display table (eagle with mosfet)
   * automatic sort function to make the process very simple
   * explain Row's 
   * The components were sorted according to their value
   * same value, then same tape or pocket
   * rotation are very important for bigger components in pockets, to know for right position in pocket (check eagle package)
   * Ignored data are components they are ignored becouse thay are not exists in packagesPockets or packagesTrays

* 3D Platform model
   * Text describe the name of pocket/trays or the smd component sorted to this tray
   * the color and text let us know if the tray busy or free
   * now you can sort all components to trays/pockets
   



Function (physics)
* plugin load 

https://youtu.be/CVlad7l9HvI?t=297





PNP-Flow for user
------------
- calibrate
- set trays
- run PNP

A. Widget:
=========
JS
---------
* stepsCalculate() : Calculate calibrated Step settings and ask for automatic set
* calibrate() : action and run all calibration steps and save the data to localspace
* displayPlatform(model, pos) : get via JSON model and display this on 3d workspace
* getComponent( eagle component ) : get component and his position in Tray
* StrategyForGet( tray type ) : use a process in gcode to get the component from a i.e. tape
* StrategyForPut( component ) : use a process in gcode to put the component to pcb (rotate and move to correct position)
* setChannel(GPIO, on|off) : to switch GPIO on or of, check the SPJS with GPIO support
* setVacuum(on|off) : Open or close the magnetic air ventil
* onAddGcode(gcode) : add the segments to main gcode (get publish from egale-import widget)


Calculate move
--------------

- Hole in tape: 1.5mm / radius = 0.75mm
- Outsidediameter Nozzle: 1.0mm = 0.5mm
- move to corner: 0.75mm - 0.5mm = 0.25mm Y-direction
- move to next cmp: 4mm + 0.25mm = 4.25mm


HTML
---------
Checkbox to use PNP
(Calibrate Section)
* calibrateMillDiameter : calibrate mill inside diameter
* sizeCalibrateBlock : Size of calibrate Block 15.02x15.01
* Button "Calibrate"

(PNP Section)
* displayPNP : display model in 3d or not
* Button "Sort" : open a new message box with table (component / Tray)

here a try to make a flow:

1. Topic Calibrate
==================

* first be sure your Machine are calibrated. We mill a quadrat and inner circle, please measure the result with a caliper width from Box and Diameter from circle have to between 19.90 mm and 20.10 mm. (Example gcode file cambam/CalibrateExample.CalibrateBox.nc) For Z-Axis, measure the height between circle and Box, Calues between 4.95 and 5.05 are ok. 


If not between this values, then you can adjust the steps/mm for every axis. 

   I.e. You measure 19.5mm in X and Y, and your settings are 40 steps/mm. 

Formula for a probe with 
(real) 20mm diameter and 
40 steps/mm:

We need 800 steps for 20mm:
      40 steps * 20mm = 800; 

The machine measure 19.5mm:
      19,5mm / 800 = 0,024375; 

in mircon:
      20mm / 0,024375 = 820,5128205128205; 

Result are 41,026
      820,5128205128205 / 20 = 41,02564102564103; 

   Then calculate: 
      40 steps * 20mm = 800; 
      19,5mm / 800 = 0,024375; 
      20mm / 0,024375 = 820,5128205128205; 
      820,5128205128205 / 20 = 41,02564102564103;
      ==============
      use 41,025 for steps/mm

   javascript calculate:
      var orignalSteps = 40;
      var orignalDistance = 20;
      var measuredDistance = 19.5;
      var micron = (measuredDistance / (orignalSteps * orignalDistance));
      var realSteps = (orignalDistance / micron) / orignalDistance;
      
* use a used endmill with a shaft of 3.0 mm to 4mm (input box) and put this --verkehrt herum-- in collar of spindle.
* move spindle in the middle of calibrate block (camera?)
* Push Button "Calibrate" with calibrate Block in the middle of PNP Platform.
* Call Touch Plate with height 2.0mm
* Push the Button "Calibrate" and enjoy it :)

   * move to Saveheight
   * move to X-10 Y0
   * move to Z-1
   * calibrate X-Axis to touch on right side

   * move to Saveheight
   * move to X0 Y-10
   * move to Z-1
   * calibrate Y-Axis to touch on top side

   * move to Saveheight
   * move to X10 Y0
   * move to Z-1
   * calibrate X-Axis to touch on left side

   * move to Saveheight
   * move to X0 Y10
   * move to Z-1
   * calibrate Y-Axis to touch on bottom side

* calculate (X/Y)Pos -/+ (inoutdiamter/2), care over sizeCalibrateBlock
* We know the position of the calibrate block. With this information we know everything about position of trays and PCB etc.pp.
* IMPORTANT: Save the Machineposition on a localspace to help user. If you lose this position, than you can home your machine and go back to this position to find you center/zero point of PNP Platform!
* Drive the calibrate crosshairs on left/right/top with camera and check if cross in middle

Done as Calibrate Widget: 
http://chilipeppr-calibrate-xpix.c9users.io/

Topic PickAndPlace
==================

* Display PNP Platform as 3d Object in 3d world (table with data load as ajax) use threejs/editor to build a model
* load JSON Table with positions of all trays and PCB Holder
* Display a Table with all Trays and a list of components
   * getComponent( eagle component );
      - get and move to tray position
      - get strategy to get a component
      - write gcode
   * setComponent( eagle component );
      - get and move to pcb position
      - get put strategy to put a component to pcb
      - write gcode

      
  
   
