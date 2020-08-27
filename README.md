# ezcoo-hdmi-switch

Script to control an Ezcoo HDMI Matrix 4x2 switch (https://www.easycoolav.com/products/hdmi-matrix-4x2-matrix-4-in-2-out-18gbps-mx42hs) using the USB port.

Has only been tested on this model switch, because that's what I have. It may or may not work with other switches depending on the serial port commands.


## Prerequisites

* Install the USB driver for the switch (https://www.easycoolav.com/art/tech-support-a0040.html)


## To Install

Install the dependencies.

```
npm install
```


## To Run

```
node index ezs out0 vs in2
```


### Commands

```
# help (default when no parameters passed)
ezh

# reset to factory defaults
ezs rst

# enable hdcp (cascade mode)
ezs cas en

# disable hdcp
ezs cas dis

# set output x to input y [x=0-2 0=all, y = 1-4]
ezs out{x} vs in{y}

# set all outputs to input 2
ezs out0 vs in2
```
