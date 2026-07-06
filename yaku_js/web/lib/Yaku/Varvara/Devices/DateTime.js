package Yaku::Varvara::Devices::DateTime;

use v5.30;
use warnings;
no warnings qw(experimental deprecated);
use feature qw(signatures);
use strict;
use bytes;

use vars qw( $VERSION );
$VERSION = "1.0.0";

use constant DBG => $ENV{YAKU_DBG} // 0;

use integer;

use Yaku::Varvara::Devices::Access qw( deviceRead deviceWrite );

use Data::Dumper;
use Carp;

use Exporter;

@Yaku::Varvara::Devices::DateTime::ISA = qw(Exporter);

@Yaku::Varvara::Devices::DateTime::EXPORT = qw(
    datetime_deo
    datetime_dei
    DateTime
);

use constant {
    DateTime => 0xc0
};

# |c0 @DateTime/year $2 &month $1 &day $1 &hour $1 &minute $1 &second $1 &dotw $1 &doty $2 &isdst $1
sub datetime_dei($args,$sz,$yakuState) {
    # croak Dumper($args,$sz);
    my ($sec,$min,$hour,$mday,$mon,$year,$dotw,$doty,$isdst) = localtime();
    $year+=1900;
    @{$yakuState->{Uxn}{dev}}[0xc0..0xcf] = ($year>>8,$year&0xff,$mon,$mday,$hour,$min,$sec,$dotw,$doty>>8, $doty&0xff,$isdst);    
    return deviceRead($args,$sz,$yakuState);
}

sub datetime_deo($args,$sz,$yakuState) {
    deviceWrite($args,$sz,$yakuState)
}


1;