var InterByteTimeout, SerialPort, Sugar, command, program;

Sugar = require('sugar-and-spice');

Sugar.extend();

program = require('commander');

SerialPort = require('serialport');

InterByteTimeout = require('@serialport/parser-inter-byte-timeout');

/*

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
*/
// May add future functionality here in the form of command line switches
// For now, just wanted to get it to work.
program.version("Ezcoo HDMI Switch Control 1.0").parse(process.argv);

command = "ezh";

if (program.args.length > 0) {
  command = `${program.args.join(" ")}`;
}

SerialPort.list().then(function(ports) {
  var ezcooSwitch, parser, port, response;
  // Find the >first< plugged in Ezcoo switch
  // If you have multiples, only the first will be found
  // You can modify this script to include the serial number to get a higher degree of granularity
  ezcooSwitch = ports.find({
    vendorId: "1A86",
    productId: "7523"
  });
  if (ezcooSwitch != null) {
    console.log(`EZcoo switch found at ${ezcooSwitch.path}`);
    port = new SerialPort(ezcooSwitch.path, {
      baudRate: 57600,
      stopBits: 1,
      dataBits: 8,
      parity: 'none'
    });
    // terminate after 100ms of inactivity
    parser = new InterByteTimeout({
      interval: 100
    });
    port.pipe(parser);
    response = function(data) {
      console.log(data.toString());
      port.close();
    };
    parser.on('data', response);
    port.write(`${command}\r\n`);
  } else {
    console.error("Ezcoo HDMI switch with product id 7523 not found");
  }
}, function(err) {
  console.error('Error listing ports', err);
});
