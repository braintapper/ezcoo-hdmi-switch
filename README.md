# ezcoo-hdmi-switch

Script to control an Ezcoo HDMI Matrix 4x2 switch (https://www.easycoolav.com/products/hdmi-matrix-4x2-matrix-4-in-2-out-18gbps-mx42hs) using the USB port.

Has only been tested on this model switch, because that's what I have. It may or may not work with other switches depending on the serial port commands.

Tested on Windows only.



## Prerequisites

* Install the USB driver for the switch (https://www.easycoolav.com/art/tech-support-a0040.html)


## To Install

After pulling the repo, install the dependencies.

```
npm install
```


## How it works

It looks for the first port that has:

VendorID: `1A86`

ProductID: `7523`

And uses the path to establish a connection to the HDMI switch.

The script executes one command and then exits.

If you leave the parameters blank, it will run `ezh`, which is the Ezcoo switch's help command.


## To Run

From the path of this local repo:

```
# Set output x to Input y
node index ezs out0 vs in2
```


### Commands

```
===============================================================================================================================
=********************************************************Systems HELP*********************************************************=
=-----------------------------------------------------------------------------------------------------------------------------=
=                        System Address = 00           F/W Version : 1.10                                                     =
=   Azz                           :  All Commands start by Prefix System Address zz, if [01-99]                               =
=-----------------------------------------------------------------------------------------------------------------------------=
=   EZH                           : Help                                                                                      =

=   EZSTA                         : Show Global System Status                                                                 =
=   EZS RST                       : Reset to Factory Defaults                                                                 =
=   EZS ADDR xx                   : Set System Address to xx {xx=[00~99](00=Single)}                                          =
=   EZS CAS EN/DIS                : Set Cascade Mode Enable/Disable                                                           =
=   EZS OUTx VS INy               : Set Output x To Input y{x=[0~2](0=ALL), y=[1~4]}                                          =
=   EZS IR SYS xx.yy              : Set IR Custom Code{xx=[00-FFH],yy=[00-FFH]}                                               =
=   EZS IR OUTx INy CODE zz       : Set IR Data Code{x=[1~2],y=[1~4],zz=[00-FFH]}                                             =
=   EZG ADDR                      : Get System Address                                                                        =
=   EZG STA                       : Get System System Status                                                                  =
=   EZG CAS                       : Get Cascade Mode Status                                                                   =
=   EZG OUTx VS                   : Get Output x Video Route{x=[0~2](0=ALL)}                                                  =
=   EZG IR SYS                    : Get IR Custom Code                                                                        =
=   EZG IR OUTx INy CODE          : Get IR Data Code{x=[1~2],y=[1~4]}                                                         =
=   EZS OUTx VIDEOy               : Set Output VIDEO Mode                                                                     =
=                                   {x=[1~2], y=[1~2](1=BYPASS,2=4K->2K)}                                                     =
=-----------------------------------------------------------------------------------------------------------------------------=
=Input Setup Commands:(Note:input number(x)=HDMI(x),x=1)                                                                      =
=   EZS INx EDID y                : Set Input x EDID{x=[0~4](0=ALL), y=[0~15]}                                                =
=                                   0:EDID_BYPASS         1:1080P_2CH_HDR          2:1080P_6CH_HDR        3:1080P_8CH_HDR     =
=                                   4:1080P_3D_2CH_HDR    5:1080P_3D_6CH_HDR   6:1080P_3D_8CH_HDR                             =
=                                   7:4K30HZ_3D_2CH_HDR  8:4K30HZ_3D_6CH_HDR  9:4K30HZ_3D_8CH_HDR                             =
=                                   10:4K60HzY420_3D_2CH_HDR  11:4K60HzY420_3D_6CH_HDR  12:4K60HzY420_3D_8CH_HDR              =
=                                   13:4K60HZ_3D_2CH_HDR  14:4K60HZ_3D_6CH_HDR  15:4K60HZ_3D_8CH_HDR                          =
=                                   16:H4K_DOLBY_VISION_ATMOS                                                                 =
=   EZG INx EDID                  : Get Input x EDID  Index{x=[0~4](0=ALL)}                                                   =
=-----------------------------------------------------------------------------------------------------------------------------=
=*****************************************************************************************************************************=
===============================================================================================================================
```
