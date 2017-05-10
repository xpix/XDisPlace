Here some intresting links for SolderDispenser:

to generate the gcode we have to use a formula, i found this in slicr:
  https://github.com/alexrj/Slic3r/blob/master/lib/Slic3r/GCode/PressureRegulator.pm#L39-L63
````
# First calculate relative flow rate (mm of filament over mm of travel)
my $rel_flow_rate = $info->{dist_E} / $info->{dist_XY};

# Then calculate absolute flow rate (mm/sec of feedstock)
my $flow_rate = $rel_flow_rate * $F / 60;

# And finally calculate advance by using the user-configured K factor.
my $new_advance = $self->config->pressure_advance * ($flow_rate**2);
````

Think about the simplest workflow for dispenser:
*   use the flow of 3d print
*   means first make a line with calculatet 0.2mm on the side off pcb (length & witdth configurable)
*   build a webservice dispense, this will translate coordinates to dispenser gcode

````
start 10,10;end 20,10;fill:rectangle
json='"start":[10,10], 
     "end":[20,20],
     "fill":"rectangle"     '
````
Will translate to fill, use modified slicr modul for this on server.
