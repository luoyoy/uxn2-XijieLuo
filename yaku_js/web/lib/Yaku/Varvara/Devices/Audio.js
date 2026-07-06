package Yaku::Varvara::Devices::Audio;

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

@Yaku::Varvara::Devices::Audio::ISA = qw(Exporter);

@Yaku::Varvara::Devices::Audio::EXPORT = qw(
    audio_deo
    audio_dei
    Audio
);

use constant {
    Audio => 0x30
};


# Audio device is 30

sub audio_deo($args,$sz,$yakuState) {
    my $dev_addr = $args->[0];
    my $port = $dev_addr & 0xf;
    deviceWrite($args,$sz,$yakuState);
    given($port) {
        when (-1) {
            # TBA
        }
        default {
            warn "DEO to Audio device not supported\n";
        }
    }
}

sub audio_dei($args,$sz,$yakuState) {
    warn "DEI from Audio device not supported\n";
    return deviceRead($args,$sz,$yakuState);
}

1;