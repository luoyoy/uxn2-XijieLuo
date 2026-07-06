"use strict";

const VERSION = "1.0.0";

import { deviceRead, deviceWrite } from "./Access.js";

// EXPORTS
// system_dei
// system_deo
// System

export const System  = 0x00;

// |00 @System/vector 2 &expansion 2 &wst 1 &rst 1 &metadata 2 &r 2 &g 2 &b 2 &debug 1 &state 1
export function system_deo(args,sz,yakuState) {
    if (args[0] == 0x0f){ // 0x0f, System/state
        if (args[1]!=0) {
            exit(args[1] & 0x7f)
        }
    }
    else if (args[0] == 0x02){ // 0x02, System/expansion
        let addr = args[1]; 
        let operation = yakuState['Uxn']['memory'][addr];
        if (operation[1] == 1 ) {            
            let size_token = loadToken(2,yakuState,addr+1);
            let src_bank_token = loadToken(2,yakuState,addr+3);
            let src_addr_token = loadToken(2,yakuState,addr+5);
            let dst_bank_token = loadToken(2,yakuState,addr+7);
            let dst_addr_token = loadToken(2,yakuState,addr+9);

            let size = size_token[1];
            let src_bank = src_bank_token[1];
            let src_addr = src_addr_token[1];
            let dst_bank = dst_bank_token[1];
            let dst_addr = dst_addr_token[1];

            
            for ( const ii=0;ii< size;++ii ) {
                if (undefined !== yakuState['Uxn']['memory'][ii+src_addr+(src_bank<<16)]) {
                    yakuState['Uxn']['memory'][ii+dst_addr+(dst_bank<<16)] =  yakuState['Uxn']['memory'][ii+src_addr+(src_bank<<16)];
                } else {
                    yakuState['Uxn']['memory'][ii+dst_addr+(dst_bank<<16)] = [EMPTY,0,1];
                }
            }
        }
    }   
    else if (args[0] == 0x04){ // 0x04, System/wst

        yakuState['Uxn']['stackPtr'][0] = args[1];
    }
    else if (args[0] == 0x05){ // 0x05, System/rst
        yakuState['Uxn']['stackPtr'][1] = args[1];
    }
    else if (args[0] >= 0x06 ){ 
        return deviceWrite(args,sz,yakuState);
    }

}

export function system_dei(args,sz,yakuState) {
    if (args[0] == 0x04){ // 0x04, System/wst
        return yakuState['Uxn']['stackPtr'][0];
    }
    else if (args[0] == 0x05){ // 0x05, System/rst
        return yakuState['Uxn']['stackPtr'][1];
    }
    else { 
        return deviceRead(args,sz,yakuState);
    }
    
}