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

      
  
   
