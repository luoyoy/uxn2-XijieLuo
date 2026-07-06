package Yaku::Varvara::Devices::Extension;

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

@Yaku::Varvara::Devices::Extension::ISA = qw(Exporter);

@Yaku::Varvara::Devices::Extension::EXPORT = qw(
    extension_deo
    extension_dei
    Extension
);

use constant {
    Extension => 0xd0
};

sub extension_deo($args,$sz,$yakuState) {
    my $dev_addr = $args->[0];
    my $port = $dev_addr & 0xf;
    deviceWrite($args,$sz,$yakuState);
    given($port) {
        when (-1) {
            # TBA
        }
        default {
            warn "DEO to Extension device not supported\n";
        }
    }
}

sub extension_dei($args,$sz,$yakuState) {
    warn "DEI from Extension device not supported\n";
    return deviceRead($args,$sz,$yakuState);
}

1;