var options, parse_and_execute, scan_com_ports, scan_for_ezcoo_devices, set_output;

import Sugar from 'sugar-and-spice';

import chalk from "chalk";

import program from 'commander';

import SerialPort from 'serialport';

import InterByteTimeout from '@serialport/parser-inter-byte-timeout';

Sugar.extend();

/*

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
*/
// May add future functionality here in the form of command line switches
// For now, just wanted to get it to work.
program.version("Ezcoo HDMI Switch Control 1.0").option("-s, --serial [char]").option("-o, --out [int]").option("-i, --in [int]").parse(process.argv);

// Default command prints out a list of ports
program.parse();

options = program.opts();

// get an array of all available serial ports
scan_com_ports = async function() {
  return (await SerialPort.SerialPort.list());
};

scan_for_ezcoo_devices = async function() {
  var ezcooSwitch, ports;
  // get all items that appear to be made by ezcoo
  ports = (await scan_com_ports());
  ezcooSwitch = ports.filter({
    vendorId: "1A86" // , productId: "7523" -- 4x2 matrix,
  });
  process.stdout.write(chalk.green("Scanning for Ezcoo devices..."));
  if (ezcooSwitch != null) {
    process.stdout.write(chalk.green(`${ezcooSwitch.length} ${"device".pluralize(ezcooSwitch.length)} found!\n`));
    console.log("");
    return ezcooSwitch.forEach(function(device) {
      process.stdout.write(`${chalk.green(device.friendlyName)}:  `);
      process.stdout.write(chalk.yellow(`Serial # ${device.serialNumber}  `));
      return process.stdout.write(chalk.blue(`Device ID: ${device.productId}\n`));
    });
  } else {
    return process.stdout.write(chalk.red("No devices found.\n"));
  }
};

set_output = async function(output, input, serial) {
  var comPort, command, matrixSwitch, parser, portOptions, ports, response;
  console.log(chalk.blue(`Set HDMI output ${output} to HDMI input ${input} for device serial ${serial}`));
  ports = (await scan_com_ports());
  matrixSwitch = ports.find({
    serialNumber: serial
  });
  process.stdout.write(chalk.green(`Searching COM ports for device serial number ${chalk.yellow(serial)}...  `));
  if (matrixSwitch != null) {
    process.stdout.write(chalk.green(`found at ${matrixSwitch.path}!\n`));
    portOptions = {
      path: matrixSwitch.path,
      baudRate: 57600, //115200 #57600
      stopBits: 1,
      dataBits: 8,
      parity: 'none'
    };
    comPort = new SerialPort.SerialPort(portOptions);
    parser = new InterByteTimeout.InterByteTimeoutParser({
      interval: 100
    });
    comPort.pipe(parser);
    response = function(data) {
      console.log(chalk.blue(`Response from switch: ${chalk.yellow(data.toString())}`));
      comPort.close();
    };
    // switch event post command
    parser.on('data', response);
    command = `ezs out${options.out} vs in${options.in}`;
    console.log(chalk.blue(`Sending command ${chalk.yellow(command)} to switch`));
    return comPort.write(`${command}\r\n`);
  } else {
    return process.stdout.write(chalk.red("device not found! Make sure the serial number is enclosed with double quotes (\"serial number\")\n"));
  }
};

// end
parse_and_execute = function(command_options) {
  var input, output, serial;
  // console.log command_options
  input = command_options.in;
  output = command_options.out;
  serial = command_options.serial;
  if ((input != null) && (output != null) && (serial != null)) {
    // validate commands
    if (isNaN(input) || isNaN(output)) {
      return console.log(chalk.red("Input and output must be integers"));
    } else {
      return set_output(output, input, serial);
    }
  } else {
    console.log(chalk.red("Required parameters not provided, listing ports instead."));
    console.log("");
    return scan_for_ezcoo_devices();
  }
};

parse_and_execute(options);
