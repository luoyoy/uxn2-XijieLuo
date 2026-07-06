package Yaku::Varvara::Devices::Controller;

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

@Yaku::Varvara::Devices::Controller::ISA = qw(Exporter);

@Yaku::Varvara::Devices::Controller::EXPORT = qw(
    controller_deo
    controller_dei
    Controller
);

use constant {
    Controller => 0x80
};

sub controller_deo($args,$sz,$yakuState) {
    my $dev_addr = $args->[0];
    my $port = $dev_addr & 0xf;
    deviceWrite($args,$sz,$yakuState);
    given($port) {
        when (-1) {
            # TBA
        }
        default {
            warn "DEO to Controller device not supported\n";
        }
    }
}

sub controller_dei($args,$sz,$yakuState) {
    warn "DEI from Controller device not supported\n";
    return deviceRead($args,$sz,$yakuState);
}

1;