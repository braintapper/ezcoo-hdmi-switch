Sugar = require('sugar-and-spice')


Sugar.extend()


program = require('commander')

SerialPort = require('serialport')
InterByteTimeout = require('@serialport/parser-inter-byte-timeout')


###
{
  path: 'COM4',
  manufacturer: 'wch.cn',
  serialNumber: '',
  pnpId: 'USB\\VID_1A86&PID_7523\\5&DC4A972&0&2',
  locationId: 'Port_#0002.Hub_#0003',
  vendorId: '1A86',
  productId: '7523'
}
###

program
  .version("Ezcoo HDMI Switch Control 1.0")
  .option('-c, --call <command>', 'Serial command to issue.')

  .parse(process.argv)



command = "ezh\r\n"


if program.args.length > 0
  command = "#{program.args.join(" ")}\r\n"


console.log "Command to execute: #{command}"

execute = (path)->
  console.log "execute #{path}, #{command}"
  port = new SerialPort path,
    baudRate: 57600
    stopBits: 1
    dataBits: 8
    parity: 'none'
    autoOpen: false

  parser = port.pipe(new InterByteTimeout(interval: 30))


  response = (data) ->
    console.log "response"
    console.log data.toString()
    console.log 'done'
    port.close()
    return

  parser.on 'data', response
  # console.log parser
  console.log "port.write #{command}"
  console.log port
  port.write "ezh\r\n"#"#{command}"


SerialPort.list().then (ports) ->
  #console.log "ports"
  # console.log ports
  ezcooSwitch = ports.find { vendorId: "1A86", productId: "7523" }

  if ezcooSwitch?
    console.log "EZcoo switch found at #{ezcooSwitch.path}"
    execute ezcooSwitch.path

    # console.log port
  else
    console.error "switch not found"


  return

, (err) ->
  console.error 'Error listing ports', err
  return
