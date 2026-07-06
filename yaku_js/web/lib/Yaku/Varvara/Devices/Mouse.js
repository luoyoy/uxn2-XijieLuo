package Yaku::Varvara::Devices::Mouse;

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

@Yaku::Varvara::Devices::Mouse::ISA = qw(Exporter);

@Yaku::Varvara::Devices::Mouse::EXPORT = qw(
    mouse_deo
    mouse_dei
    Mouse
);

use constant {
    Mouse => 0x90
};

sub mouse_deo($args,$sz,$yakuState) {
    my $dev_addr = $args->[0];
    my $port = $dev_addr & 0xf;
    deviceWrite($args,$sz,$yakuState);
    given($port) {
        when (-1) {
            # TBA
        }
        default {
            warn "DEO to Mouse device not supported\n";
        }
    }
}

sub mouse_dei($args,$sz,$yakuState) {
    warn "DEI from Mouse device not supported\n";
    return deviceRead($args,$sz,$yakuState);
}

1;