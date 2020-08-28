Sugar = require('sugar-and-spice')


Sugar.extend()


program = require('commander')

SerialPort = require('serialport')
InterByteTimeout = require('@serialport/parser-inter-byte-timeout')


###

Example of a found HDMI Switch

{
  path: 'COM4',
  manufacturer: 'wch.cn',
  serialNumber: '',
  pnpId: 'USB\\VID_1A86&PID_7523\\{serialnum}',
  locationId: 'Port_#0002.Hub_#0003',
  vendorId: '1A86',
  productId: '7523'
}
###

program
  .version("Ezcoo HDMI Switch Control 1.0")
  .option('-c, --call <command>', 'Serial command to issue.')

  .parse(process.argv)



command = "ezh"


if program.args.length > 0
  command = "#{program.args.join(" ")}"



SerialPort.list().then (ports) ->

  ezcooSwitch = ports.find { vendorId: "1A86", productId: "7523" }

  if ezcooSwitch?
    console.log "EZcoo switch found at #{ezcooSwitch.path}"
    port = new SerialPort ezcooSwitch.path,
      baudRate: 57600
      stopBits: 1
      dataBits: 8
      parity: 'none'

    parser = (new InterByteTimeout({interval: 100}))

    port.pipe parser

    response = (data) ->
      console.log data.toString()
      port.close()
      return

    parser.on 'data', response


    port.write "#{command}\r\n"
  else
    console.error "switch not found"


  return

, (err) ->
  console.error 'Error listing ports', err
  return
