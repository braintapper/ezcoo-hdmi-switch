var InterByteTimeout, Readline, Ready, SerialPort, listPorts, parser, port, response;

SerialPort = require('serialport');

Readline = require('@serialport/parser-readline');

Ready = require('@serialport/parser-ready');

//const port = new SerialPort(path, { baudRate: 57600 });
// COM4    USB\VID_1A86&PID_7523\5&DC4A972&0&2     wch.cn
/*
{
  path: 'COM4',
  manufacturer: 'wch.cn',
  serialNumber: '',
  pnpId: 'USB\\VID_1A86&PID_7523\\5&DC4A972&0&2',
  locationId: 'Port_#0002.Hub_#0003',
  vendorId: '1A86',
  productId: '7523'
}
*/
listPorts = function() {
  SerialPort.list().then((function(ports) {
    ports.forEach(function(port) {
      console.log(port);
    });
  //console.log(`${port.path}\t${port.pnpId || ''}\t${port.manufacturer || ''}`)
  }), function(err) {
    console.error('Error listing ports', err);
  });
};

listPorts();

port = new SerialPort('COM4', {
  baudRate: 57600,
  stopBits: 1,
  dataBits: 8,
  parity: 'none',
  autoOpen: false
});

//const parser = port.pipe(new Ready({ delimiter: 'READY' })); //new Readline();
InterByteTimeout = require('@serialport/parser-inter-byte-timeout');

parser = port.pipe(new InterByteTimeout({
  interval: 100
}));

// port.pipe(parser);
response = function(data) {
  console.log(data.toString());
  console.log('done');
  port.close();
};

parser.on('data', response);

// port.open(function () { console.log("port opened"); port.write('ezh\r\n');});
