"use strict";

const VERSION = "1.0.0";

import { deviceRead, deviceWrite } from "./Access.js";
import { runProgram } from "../../Uxntal/Interpreter.js";
// EXPORTS 
// console_arguments
// console_input
// console_deo
// console_dei

export const Console  = 0x10; 
const EOF = -1;
const CONSOLE_NOQ = 0x0; // no-queue(0);
const CONSOLE_STD = 0x1; // stdin(1)
const CONSOLE_ARG = 0x2; // argument(2)
const CONSOLE_EOA = 0x3; // argument-spacer(3)
const CONSOLE_END = 0x4; // argument-end(4). 

// The Console device starts at 0x10, with vector*
// 0x12 is read
// 0x17 is the type
// 0x18 is write, DEO to this is handled via print-to-STDOUT 
// 0x19 is error, DEO to this is handled via print-to-STDERR
// UNTESTED
export function console_input(c, type,yakuState) 
{    
    if(ord(c) == EOF) {c = 0; type = 4};
    yakuState['Uxn']['dev'][0x12] = ord(c), yakuState['Uxn']['dev'][0x17] = type;
    // How do I call a export functionroutine? I guess I just point the pc at it and run
    yakuState['Uxn']['pc']=yakuState['Uxn']['dev'][0x10];
    
    runProgram(yakuState);
    return (type != 4)?1:0;
}

// UNTESTED
export function console_arguments(yakuState)
{
    
    // carp Dumper \@ARGV;
    // const process = require('process');
    let argc = process.argv.length;
    let j=0;
    for (const arg of process.argv) {

        for (const p of arg.split('')) {
            console_input(p, CONSOLE_ARG,yakuState);
        }
        console_input("\n", j == argc - 1 ? CONSOLE_END : CONSOLE_EOA,yakuState);
        ++j;
    }
}


// |10 @Console/vector 2 &read 5 &type 1 &write 1 &error 1
export function console_deo(args,sz,yakuState) {
    // Sending a non-null byte to the System/state port will terminate the application, 
    // on systems that can handle exit codes, the error code is the 0x7f portion of the byte. 
    // So, 0x01 terminates the program with an error, and 0x80 terminates the program succesfully.
    // #80 .System/state DEO
    if (args[0] == 0x18){ //  Console/write
        process.stdout.write( String.fromCharCode(args[1]));
    }
    if (args[0] == 0x19){ //  Console/write
        process.stderr.write( String.fromCharCode(args[1]));
    }
// |10 @Console &vector 2 &read 1 &pad 4 &type 1 &write 1 &error 1
    else if (args[0] == Console || args[0] == 0x11){ // Console/vector; in Uxn this is 0x11 though, why?
        yakuState['Uxn']['dev'][Console]=args[1];
    }
}

export function console_dei(args,sz,yakuState) {
    return deviceRead(args,sz,yakuState);
}