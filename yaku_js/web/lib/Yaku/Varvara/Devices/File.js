"use strict";

const VERSION = "1.0.0";

import { deviceRead, deviceWrite } from "./Access.js";
import { RAW } from "../../Uxntal/Definitions.js";

// EXPORTS
//     file_deo
//     file_dei
//     @uxn_file
//     File
//     File1
//     File2

export const uxn_file = [ init_UxnFile(),init_UxnFile() ];

export const File =  0xa0;
export const File1 =  0xa0;
export const File2 =  0xb0;
const IDLE = 0;
const FILE_READ = 1;
const FILE_WRITE = 2;
const DIR_READ = 3;
const DIR_WRITE = 4;

// File device is a0 and b0
// |a0 @File1/vector 2 &success 2 &stat 2 &delete 1 &append 1 &name 2 &length 2 &read 2 &write 2
// 0x00/0x01 vector 
// 0x02/0x03 success
// 0x04/0x05 stat
// 0x06 delete
// 0x07 append
// 0x08/0x09 name
// 0x0a/0x0b length
// 0x0c/0x0d read
// 0x0e/0x0f write

// id is 0 or 1 for a0 resp b0  
export function file_deo(uxn, dev_idx, port) {
    let id = dev_idx == 0xa0 ? 0 : 1;
    let c = uxn_file[id];
    // let d = uxn['dev'][dev_idx];


        if (port == 0x04) { // STAT
            let addr = uxn['dev'][dev_idx + 0x04 ];
            let len = uxn['dev'][dev_idx + 0x0a ];
            if(len > 0x10000 - addr) {
                len = 0x10000 - addr;
            }
            let res = file_stat(c, addr, len, uxn);
            uxn['dev'][dev_idx + 0x02] = res; // FIXME 2 bytes
        }
        else if (port == 0x06) { // DELETE
            let res = file_delete(c);
            uxn['dev'][dev_idx + 0x02] = res;
            
        }
        else if (port == 0x08) { // NAME
            let addr = uxn['dev'][dev_idx + 0x08 ];
            let res = file_init(c, addr, 0x10000 - addr, 0, uxn);
            uxn['dev'][dev_idx + 0x02] = res;
        }
        // when (0x0a) { // LENGTH
        //     let addr = uxn['dev'][dev_idx + 0x0a ];
        //     croak 'TODO';
        // }
        else if (port == 0x0c) { // READ
            let addr = uxn['dev'][dev_idx + 0x0c ];
            let len = uxn['dev'][dev_idx + 0x0a ];
            if(len > 0x10000 - addr){
                len = 0x10000 - addr;
            }
            let res = file_read(c, addr, len,uxn);
            uxn['dev'][dev_idx + 0x02] = res;
        }
        else if (port == 0x0e) { // WRITE
            let addr = uxn['dev'][dev_idx + 0x0e ];
            let len = uxn['dev'][dev_idx + 0x0a ];
            if(len > 0x10000 - addr){
                len = 0x10000 - addr;
            }
            let res = file_write(c, addr, len, uxn['dev'][dev_idx + 0x07],uxn);
            uxn['dev'][dev_idx + 0x02] = res;
        }
    
}

export function file_dei(args,sz,yakuState) {
    console.warn( "DEI from File device not supported");
    return deviceRead(args,sz,yakuState);
}

export function init_UxnFile() {
    return {
        'f' : undefined,
        'offset' :0,
        'dir' : undefined,
        'current_filename' : '',
        'de' : {},
        'state' : 0,
        'outside_sandbox' : 0
    }
}

export function reset_UxnFile(c) {
    if(undefined !== c['f']) {
        close(c['f']);
        c['f'] = undefined;
    }
    if(undefined != c['dir']) {
        closedir(c['dir']);
        c['dir'] = undefined;
    }
    c['de'] = undefined;
    c['state'] = IDLE;
    c['outside_sandbox'] = 0;
}

// I think this will not work because of dest
export function file_read(c, dest, len, uxn) {
    
    if(c['outside_sandbox']) {
        return 0;
    }
    if(c['state'] != FILE_READ && c['state'] != DIR_READ) {
        // carp 'HERE';    
        reset_UxnFile(c);
        var dh;
//TODO        let res = opendir( dh,c['current_filename']);
        if(res) {
            c['dir'] = dh; 
            c['state'] = DIR_READ;
        } else {
//TODO            use bytes;
//TODO            res = open let fh, '<:bytes', c['current_filename'];
            if(res) {
                c['f'] = fh;         
                c['state'] = FILE_READ;
            }
        }
    }
    if(c['state'] == FILE_READ){
//TODO            use bytes;
        // This only works if dest is a pointer into Uxn memory at a specific location
        let offset = c['offset'];
        
        seek(c['f'],offset,0);
        var buf;
        let res = read(c['f'], buf,len);
        
        if (res) {
            if (res!=len) {
//TODO                croak "Not all bytes read: res <> len <> ".length(buf);
            }                
            c['offset']+=res;
            if (res==1) {                
                let byte = ord(buf);
                uxn['memory'][dest]=[RAW,byte,1];
            } else {
                for (const  idx =0 ; idx< res; ++idx ) {                
                    let byte = ord(substr(buf,idx,1));
                    uxn['memory'][dest+idx]=[RAW,byte,1];
                }
            }
            return 1;            
        } else {
            return 0;
        }
    }
    
    if(c['state'] == DIR_READ){
        return file_read_dir(c, dest, len);
    }
    return 0;
} // END of file_read

export function file_stat() {
// TODO    croak 'TODO: file_stat';
}
/*
export function file_init(c, addr, dummy1, dummy2, uxn) {
    // read the file name from memory into a string
    let char=1;let i=0;let fn='';
    while(char !=0) {
        char = uxn{memory}[addr+i++][1];
        fn.= chr(char);
    }    
    // update the file record
    c{'current_filename'}=fn;
    c{'state'}=IDLE;
    return 1;
}

export function file_delete(c) {
    unlink c{'current_filename'};
    return 1;
    croak 'TODO: file_delete';
}

export function file_write {
    croak 'TODO: file_write';
}

export function file_read_dir {
    croak 'TODO: dir read';
}
=pod
|a0 @File1/vector 2 &success 2 &stat 2 &delete 1 &append 1 &name 2 &length 2 &read 2 &write 2
|b0 @File2/vector 2 &success 2 &stat 2 &delete 1 &append 1 &name 2 &length 2 &read 2 &write 2

The File/vector* is normally unused, but is reserved for systems where a portable data format(disk, etc..) can be inserted. There is no specs for disk handling at this time.

When File/name* resolves to a file, writing an address to File/read* will write the file's data at that address up to the length in File/length*. 
File/success* will be less than File/length* if the file is shorter, and will be zero if the filename is invalid. 
If the file is longer, subsequent writes to File/read* will read the next chunk of data into the memory region, so it is possible to read the contents of very large files one chunk at a time.

|0100 (  )
    ;filename .File/name DEO2
    #0010 .File/length DEO2
    ;buffer .File/read DEO2
    BRK

@filename "in.txt 1
@buffer 10

When File/name* resolves to a directory, writing the address to File/read* will read the directory as if it were a text file listing each of the directory's contents. The listing has each file or directory on its own line, prefixed with a four characters for the file information, followed by a space, the file's name and a linebreak.

001a file.txt
???? large file.mp4
---- directory/

The individual information of a file or directory can be obtained via the File/stat* port, the File/length* specifies the length of the stat buffer to write to, the data written will be in the same format as the ascii bytes above. A file size will always include the lowest nibbles. The length of the stat written will always fill the requested length.

    0-f A file
    - A directory
    ? A large file
    ! A missing file

@is-folder ( name* -- bool )
    .File/name DEO2
    #0001 .File/length DEO2
    ;&b .File/stat DEO2
    [ LIT2 &b "- ] EQU2 JMP2r

Writing files is performed by writing to File/write*. If File/append is set to 0x01, then the data in the memory region will be written after the end of the file, if it is 0x00 (the default) it will replace the contents of the file. If the file doesn't previously exist then it will be created and File/append makes no difference. File/success* will be set to File/length* if the write was successful, otherwise it will read as zero. As with reading files and directories, subsequent writes to File/write* will write more chunks of data to the file.

@on-reset (  )
    ;filename .File/name DEO2
    #0005 .File/length DEO2
    ;data .File/write DEO2
    BRK

@filename "out.txt 1
@data "hello 1

Finally, to delete a file, write any value to the File/delete byte. Writing to File/name* closes the file/directory. The device may not access files outside of the working directory.

----


typedef struct {
    FILE *f;
    DIR *dir;
    char current_filename[4096];
    struct dirent *de;
    state;
    int outside_sandbox;
} UxnFile;


let @uxn_file=[{},{}];
=cut
*/