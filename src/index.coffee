import Sugar from 'sugar-and-spice'
import chalk from "chalk"
import program from 'commander'
import SerialPort from 'serialport'
import InterByteTimeout from '@serialport/parser-inter-byte-timeout'

Sugar.extend()


###

Example of a found HDMI Switch
{
  path: 'COM6',
  manufacturer: 'wch.cn',
  serialNumber: '{serialnumber}',
  pnpId: 'USB\\VID_1A86&PID_7523\\{serialnumber}',
  locationId: 'Port_#0001.Hub_#0002',
  friendlyName: 'USB-SERIAL CH340 (COM6)',
  vendorId: '1A86',
  productId: '7523'
}  
###

# May add future functionality here in the form of command line switches
# For now, just wanted to get it to work.

program
  .version("Ezcoo HDMI Switch Control 1.0")
  .option("-s, --serial [char]")
  .option("-o, --out [int]")
  .option("-i, --in [int]")
  .parse(process.argv)

# Default command prints out a list of ports


program.parse()


options = program.opts()


# get an array of all available serial ports
scan_com_ports = ()->
  return await SerialPort.SerialPort.list()


scan_for_ezcoo_devices = ()->
  # get all items that appear to be made by ezcoo
  ports = await scan_com_ports()
  ezcooSwitch = ports.filter { vendorId: "1A86" } # , productId: "7523" -- 4x2 matrix,

  process.stdout.write chalk.green("Scanning for Ezcoo devices...")
  
  if ezcooSwitch?
    process.stdout.write chalk.green "#{ezcooSwitch.length} #{"device".pluralize(ezcooSwitch.length)} found!\n"
    console.log ""

    ezcooSwitch.forEach (device)->
      process.stdout.write "#{chalk.green(device.friendlyName)}:  "
      process.stdout.write chalk.yellow("Serial # #{device.serialNumber}  ")
      process.stdout.write chalk.blue("Device ID: #{device.productId}\n")
      
  else
      process.stdout.write chalk.red "No devices found.\n"


set_output = (output, input, serial)->
  console.log chalk.blue "Set HDMI output #{output} to HDMI input #{input} for device serial #{serial}"
  
  ports  = await scan_com_ports()

  matrixSwitch = ports.find { serialNumber: serial }
  process.stdout.write chalk.green("Searching COM ports for device serial number #{chalk.yellow(serial)}...  ")


  
  if matrixSwitch?
    process.stdout.write chalk.green "found at #{matrixSwitch.path}!\n"
  
    portOptions = 
      path: matrixSwitch.path
      baudRate: 57600 #115200 #57600
      stopBits: 1
      dataBits: 8
      parity: 'none'      
    comPort = new SerialPort.SerialPort portOptions
    
    parser = new InterByteTimeout.InterByteTimeoutParser ({interval: 100})
    comPort.pipe parser

    response = (data) ->
      console.log chalk.blue "Response from switch: #{chalk.yellow(data.toString())}"
      comPort.close()
      return

    # switch event post command
    parser.on 'data', response
    
    
    command = "ezs out#{options.out} vs in#{options.in}"      
    console.log chalk.blue "Sending command #{chalk.yellow(command)} to switch"
    comPort.write "#{command}\r\n" # "ezh\r\n"


  else
    process.stdout.write chalk.red "device not found! Make sure the serial number is enclosed with double quotes (\"serial number\")\n"
    # end



parse_and_execute = (command_options)->
  # console.log command_options

  input = command_options.in
  output = command_options.out
  serial = command_options.serial

  if input? && output? && serial?
    # validate commands
    if isNaN(input) || isNaN(output)
      console.log chalk.red ("Input and output must be integers")
    else
      set_output output, input, serial

  else
    console.log chalk.red "Required parameters not provided, listing ports instead."
    console.log ""
    scan_for_ezcoo_devices()

parse_and_execute options

