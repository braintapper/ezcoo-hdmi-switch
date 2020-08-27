//Sugar = require('sugar-and-spice')

//Sugar.extend()
var Readline, SerialPort, command, out, parser, port, program;

program = require('commander');

SerialPort = require('serialport');

Readline = require('@serialport/parser-readline');

// InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
command = "ezh\r\n";

console.log(`Command to execute: ${command}`);

port = new SerialPort("COM4", {
  baudRate: 57600,
  stopBits: 1,
  dataBits: 8,
  parity: 'none'
});

//autoOpen: false

//parser =  new Readline() #(new InterByteTimeout({interval: 3000}))
//port.pipe parser
parser = port.pipe(new Readline());

out = function(data) {
  console.log("out");
  console.log(data.toString());
  console.log('done');
};

//  port.close()
parser.on('data', out);

// console.log parser
// console.log "port.write #{command}"
port.write("ezh\r\n");
