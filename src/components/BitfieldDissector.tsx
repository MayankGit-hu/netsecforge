'use client';

import React, { useState } from 'react';
import {
  Binary,
  Layers,
  Shield,
  HelpCircle,
  Cpu,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export type ProtocolHeaderType = 'ipv4' | 'tcp' | 'ethernet';

interface BitfieldSpec {
  id: string;
  name: string;
  bitOffset: string;
  bitLength: number;
  byteLength: string;
  sampleBinary: string;
  sampleHex: string;
  color: string;
  shortSummary: string;
  whatItDoes: string;
  howItIsUsed: string;
  securityImpact: string;
  bitDetails?: { bit: string; name: string; meaning: string }[];
}

const ETHERNET_FIELDS: BitfieldSpec[] = [
  {
    id: 'eth-preamble',
    name: 'Preamble',
    bitOffset: 'Bytes 1-7 (56 bits)',
    bitLength: 56,
    byteLength: '7 Bytes',
    sampleBinary: '10101010 10101010 10101010 10101010 10101010 10101010 10101010',
    sampleHex: '0xAA AA AA AA AA AA AA',
    color: 'from-slate-600 to-slate-700',
    shortSummary: 'Clock synchronization pattern for receiving physical layer transceivers.',
    whatItDoes:
      'Consists of 7 alternating octets of 1s and 0s (10101010). It allows the receiving NIC physical layer clock circuitry to synchronize with the incoming electrical or optical bit stream frequency before data arrives.',
    howItIsUsed:
      'Stripped by hardware before reaching operating system drivers. You never see the preamble in Wireshark packet captures because the NIC chip consumes it.',
    securityImpact:
      'Generally not exploitable at layer 3+, but physical hardware wiretaps monitor clock jitter in preamble transitions to detect line anomalies.',
  },
  {
    id: 'eth-sfd',
    name: 'Start Frame Delimiter (SFD)',
    bitOffset: 'Byte 8 (8 bits)',
    bitLength: 8,
    byteLength: '1 Byte',
    sampleBinary: '10101011',
    sampleHex: '0xAB',
    color: 'from-amber-600 to-amber-700',
    shortSummary: 'Signals that the next bit begins the actual Ethernet frame destination address.',
    whatItDoes:
      'Ends with two consecutive 1s ("11"). This 8-bit delimiter breaks the preamble pattern and declares: "Attention! The very next bit is bit 0 of the Destination MAC address."',
    howItIsUsed:
      'Provides hardware boundary alignment. If an Ethernet receiver loses alignment, it resynchronizes upon detecting this byte.',
    securityImpact:
      'Corrupted SFD bytes result in runt frames or framing errors which are immediately discarded by switch ASICs.',
  },
  {
    id: 'eth-dst-mac',
    name: 'Destination MAC Address',
    bitOffset: 'Bytes 9-14 (48 bits)',
    bitLength: 48,
    byteLength: '6 Bytes',
    sampleBinary: '00000000 01010000 01010110 11111110 11101101 00000001',
    sampleHex: '00:50:56:FE:ED:01',
    color: 'from-cyan-600 to-blue-600',
    shortSummary: 'Hardware address of the intended next-hop device on the local network link.',
    whatItDoes:
      'Specifies which physical network card on the local broadcast domain should receive and process this frame. First bit indicates Unicast (0) vs Multicast (1). Second bit indicates Universally Administered (0) vs Locally Administered (1).',
    howItIsUsed:
      'Network switches look up this address in their MAC Address CAM Table to forward the frame only to the single port where the destination device is plugged in.',
    securityImpact:
      'CAM Table Flooding attacks overflow switch memory with bogus destination MACs, forcing the switch to fail-open as a hub and broadcast all traffic, enabling eavesdropping.',
  },
  {
    id: 'eth-src-mac',
    name: 'Source MAC Address',
    bitOffset: 'Bytes 15-20 (48 bits)',
    bitLength: 48,
    byteLength: '6 Bytes',
    sampleBinary: '00000000 00011010 00101011 00111100 01001101 01011110',
    sampleHex: '00:1A:2B:3C:4D:5E',
    color: 'from-emerald-600 to-teal-600',
    shortSummary: 'Hardware address of the network interface that transmitted this frame.',
    whatItDoes:
      'Identifies the physical originator on this local wire hop. The first 24 bits represent the Organizationally Unique Identifier (OUI) assigned to the hardware vendor (e.g., Intel, Apple, Cisco). The remaining 24 bits are the vendor serial number.',
    howItIsUsed:
      'Switches use the Source MAC to dynamically learn and populate their CAM table for returning traffic.',
    securityImpact:
      'MAC Spoofing: Attackers forge Source MAC addresses to bypass 802.1X Port Security, bypass Wi-Fi MAC filters, or poison ARP tables.',
  },
  {
    id: 'eth-type',
    name: 'EtherType / Length',
    bitOffset: 'Bytes 21-22 (16 bits)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '00001000 00000000',
    sampleHex: '0x0800 (IPv4)',
    color: 'from-purple-600 to-indigo-600',
    shortSummary: 'Identifies which Layer 3 protocol payload is encapsulated inside the frame.',
    whatItDoes:
      'Demultiplexing tag that instructs the operating system kernel which network layer protocol handler should receive the payload.',
    howItIsUsed:
      'Common EtherTypes include: 0x0800 (IPv4), 0x86DD (IPv6), 0x0806 (ARP), 0x8100 (802.1Q VLAN Tagged Frame). Values ≤ 1500 represent 802.3 length rather than EtherType.',
    securityImpact:
      'VLAN Hopping (Double Tagging): Attackers craft nested 802.1Q EtherType tags (0x8100) to inject frames into isolated target VLANs across native trunk links.',
  },
  {
    id: 'eth-payload',
    name: 'Payload Data',
    bitOffset: 'Bytes 23-1522 (368 - 12,000 bits)',
    bitLength: 12000,
    byteLength: '46 - 1500 Bytes (MTU)',
    sampleBinary: '[Variable IP Packet Payload Bits]',
    sampleHex: 'IPv4 / IPv6 Packet',
    color: 'from-blue-600 to-cyan-600',
    shortSummary: 'The encapsulated Layer 3 packet. Minimum 46 bytes, maximum standard 1500 bytes.',
    whatItDoes:
      'Carries the Layer 3 IP Packet. If the payload is smaller than 46 bytes (e.g. tiny ARP request), padding bytes of 0x00 are appended to satisfy the 64-byte minimum Ethernet frame size required for CSMA/CD collision detection.',
    howItIsUsed:
      'Transferred directly to the Layer 3 protocol driver in the OS networking stack.',
    securityImpact:
      'Jumbo frames (> 1500 bytes, up to 9000 bytes) reduce CPU overhead in data centers, but mismatched MTU configs cause silent packet drops and black-hole routing.',
  },
  {
    id: 'eth-fcs',
    name: 'Frame Check Sequence (FCS / CRC-32)',
    bitOffset: 'Last 4 Bytes (32 bits)',
    bitLength: 32,
    byteLength: '4 Bytes',
    sampleBinary: '10011011 00101100 01001111 00011010',
    sampleHex: '0x9B2C4F1A',
    color: 'from-rose-600 to-red-600',
    shortSummary: 'Cyclic Redundancy Check (CRC-32) trailer for hardware error detection.',
    whatItDoes:
      'The sender computes a 32-bit polynomial CRC hash over all fields from Destination MAC through Payload. The receiver recalculates the polynomial hash. If a single bit was flipped by electromagnetic noise or faulty cable, the checksum will fail.',
    howItIsUsed:
      'Frames with mismatched FCS are dropped immediately by the receiving NIC before CPU processing, preventing corrupted data from entering the OS.',
    securityImpact:
      'FCS provides error detection, NOT cryptographic integrity. An attacker capable of modifying a packet in transit can easily recalculate and overwrite a valid CRC-32.',
  },
];

const IPV4_FIELDS: BitfieldSpec[] = [
  {
    id: 'ip-version',
    name: 'Version (4 bits)',
    bitOffset: 'Bits 0-3 (0.5 Byte)',
    bitLength: 4,
    byteLength: '4 bits',
    sampleBinary: '0100',
    sampleHex: '0x4',
    color: 'from-cyan-500 to-blue-600',
    shortSummary: 'Specifies the IP format version. 0100 = IPv4, 0110 = IPv6.',
    whatItDoes:
      'The first 4 bits of any IP packet identify the protocol version. A router reads these 4 bits to immediately know which routing engine and header format to parse.',
    howItIsUsed:
      'Always 4 (binary 0100) for IPv4 packets. IPv6 packets will have 6 (binary 0110) in these same first 4 bit positions.',
    securityImpact:
      'Malicious or malformed packets with version numbers other than 4 or 6 are discarded by stateful firewalls as invalid protocol structures.',
  },
  {
    id: 'ip-ihl',
    name: 'Internet Header Length - IHL (4 bits)',
    bitOffset: 'Bits 4-7 (0.5 Byte)',
    bitLength: 4,
    byteLength: '4 bits',
    sampleBinary: '0101',
    sampleHex: '0x5 (5 words = 20 Bytes)',
    color: 'from-blue-500 to-indigo-600',
    shortSummary: 'Specifies IPv4 header size in 32-bit (4-byte) words. Minimum is 5 (20 bytes).',
    whatItDoes:
      'Because the IPv4 header can include optional parameters, IHL tells the receiver where the header ends and where the data begins. If IHL = 5, header length is 5 × 4 bytes = 20 bytes (standard base header). If options are present, IHL can be up to 15 (60 bytes max).',
    howItIsUsed:
      'The OS uses IHL to calculate the exact memory pointer offset to read the Layer 4 transport payload.',
    securityImpact:
      'Land Attack / Ping of Death: Historically, crafting packets with illegal IHL values (< 5) or inconsistent lengths crashed vulnerable OS kernel network drivers.',
  },
  {
    id: 'ip-dscp',
    name: 'DSCP (Differentiated Services - 6 bits)',
    bitOffset: 'Bits 8-13 (6 bits)',
    bitLength: 6,
    byteLength: '6 bits',
    sampleBinary: '101110',
    sampleHex: '0x2E (Expedited Forwarding / 46)',
    color: 'from-indigo-500 to-purple-600',
    shortSummary: 'Quality of Service (QoS) classification tag for traffic prioritization.',
    whatItDoes:
      'Enables enterprise routers to prioritize latency-sensitive traffic (like VoIP and live video calls) ahead of bulk file downloads during periods of bandwidth congestion.',
    howItIsUsed:
      'Values include CS0 (Default/Best Effort), AF (Assured Forwarding), and EF (Expedited Forwarding - used for voice telephone packets).',
    securityImpact:
      'QoS Abuse: Malicious actors on internal networks may tag illicit bulk exfiltration traffic with EF priority to bypass QoS throttling, unless edge switches rewrite untrusted DSCP tags to 0.',
  },
  {
    id: 'ip-ecn',
    name: 'ECN (Explicit Congestion Notification - 2 bits)',
    bitOffset: 'Bits 14-15 (2 bits)',
    bitLength: 2,
    byteLength: '2 bits',
    sampleBinary: '11',
    sampleHex: '0x3 (Congestion Encountered)',
    color: 'from-purple-500 to-pink-600',
    shortSummary: 'Allows routers to signal network congestion without dropping packets.',
    whatItDoes:
      'Traditional networks signal congestion by dropping packets (forcing TCP to timeout). ECN enables intermediate routers to set these 2 bits to "11" (Congestion Encountered) while still delivering the packet, prompting TCP to gracefully throttle speed without packet loss.',
    howItIsUsed:
      'Bit values: 00 = Not ECN-Capable, 01 = ECT(1), 10 = ECT(0), 11 = CE (Congestion Encountered).',
    securityImpact:
      'ECN Nonce (RFC 3540) was introduced to prevent rogue receivers from concealing congestion signals to greedily monopolize network bandwidth.',
  },
  {
    id: 'ip-total-length',
    name: 'Total Length (16 bits)',
    bitOffset: 'Bits 16-31 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes (16 bits)',
    sampleBinary: '00000101 11011100',
    sampleHex: '0x05DC (1500 Bytes)',
    color: 'from-pink-500 to-rose-600',
    shortSummary: 'Entire size of the IPv4 packet in bytes, including both header and payload.',
    whatItDoes:
      'A 16-bit field that can represent up to 65,535 bytes (theoretical maximum IP datagram size). The payload size is computed as: Total Length minus (IHL × 4).',
    howItIsUsed:
      'Most internet packets are limited to 1500 bytes by the standard Ethernet MTU (Maximum Transmission Unit).',
    securityImpact:
      'Ping of Death: Sending fragmented packets whose total assembled length exceeded 65,535 bytes caused buffer overflow crashes in older Windows 95/NT kernel stacks.',
  },
  {
    id: 'ip-id',
    name: 'Identification (16 bits)',
    bitOffset: 'Bits 32-47 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '01111010 11000011',
    sampleHex: '0x7AC3',
    color: 'from-amber-500 to-orange-600',
    shortSummary: 'Unique transaction ID used by the receiver to group fragmented packets.',
    whatItDoes:
      'When an IP packet is too large for an intermediate router\'s MTU and must be split into fragments, all fragments of that packet share the identical Identification number so the receiving host can reconstruct them.',
    howItIsUsed:
      'Typically incremented sequentially or generated via cryptographic PRNG by the sender OS kernel.',
    securityImpact:
      'Idle / Zombie Port Scanning (Nmap -sI): Predictable sequential IP ID counters in unpatched printers/servers allowed attackers to perform blind port scans while concealing their true IP identity.',
  },
  {
    id: 'ip-flags',
    name: 'Flags (3 bits: Reserved, DF, MF)',
    bitOffset: 'Bits 48-50 (3 bits)',
    bitLength: 3,
    byteLength: '3 bits',
    sampleBinary: '010',
    sampleHex: '0x2 (DF = 1, MF = 0)',
    color: 'from-rose-500 to-red-600',
    shortSummary: 'Controls and identifies fragmentation behavior across the network.',
    whatItDoes:
      'Three 1-bit flags controlling fragmentation rules.',
    howItIsUsed:
      'Bit 0: Reserved (Must be 0). Bit 1: DF (Don\'t Fragment) — if set to 1 and packet exceeds router MTU, router drops it and returns ICMP Type 3 Code 4 (used for Path MTU Discovery PMTUD). Bit 2: MF (More Fragments) — 1 means more fragments follow; 0 means this is the final fragment.',
    securityImpact:
      'Evil Bit: RFC 3514 humorously proposed using the reserved bit 0 as the "Evil Bit" for malware detection. In reality, fragment overlap attacks (Teardrop, Rose) exploit overlapping fragment offsets to bypass firewall inspection.',
    bitDetails: [
      { bit: 'Bit 0', name: 'Reserved', meaning: 'Must always be 0 (RFC 791). Non-zero is anomalous.' },
      { bit: 'Bit 1', name: 'DF (Don\'t Fragment)', meaning: '1 = Do not fragment. Drop if packet > MTU and send ICMP error.' },
      { bit: 'Bit 2', name: 'MF (More Fragments)', meaning: '1 = More fragments follow. 0 = Last fragment or unfragmented.' },
    ],
  },
  {
    id: 'ip-frag-offset',
    name: 'Fragment Offset (13 bits)',
    bitOffset: 'Bits 51-63 (13 bits)',
    bitLength: 13,
    byteLength: '13 bits',
    sampleBinary: '00000000 00000',
    sampleHex: '0x0000 (0 bytes offset)',
    color: 'from-emerald-500 to-teal-600',
    shortSummary: 'Specifies fragment position within original datagram in 8-byte (64-bit) units.',
    whatItDoes:
      'Enables the receiver to reassemble fragments in the exact correct order regardless of the order they arrive in. The value is multiplied by 8 to get the byte offset (e.g. Offset 185 × 8 = Byte 1480).',
    howItIsUsed:
      'The first fragment always has Offset = 0. Subsequent fragments have positive integer offsets.',
    securityImpact:
      'Tiny Fragment Attacks: Crafting the first fragment to be smaller than the TCP header pushes the TCP port numbers into the second fragment, blind-siding primitive stateless packet filters.',
  },
  {
    id: 'ip-ttl',
    name: 'Time to Live - TTL (8 bits)',
    bitOffset: 'Bits 64-71 (1 Byte)',
    bitLength: 8,
    byteLength: '1 Byte (8 bits)',
    sampleBinary: '01000000',
    sampleHex: '0x40 (64 hops)',
    color: 'from-teal-500 to-cyan-600',
    shortSummary: 'Hop counter decremented by 1 at every router to prevent infinite loops.',
    whatItDoes:
      'Prevents unroutable packets from circulating endlessly in network loops. Every router that forwards the packet subtracts 1 from TTL. When TTL reaches 0, the router drops the packet and transmits an ICMP "Time Exceeded in Transit" message back to the sender.',
    howItIsUsed:
      'Traceroute intentionally sends packets with TTL=1, TTL=2, TTL=3... to force each consecutive router along the path to identify itself via ICMP Time Exceeded messages!',
    securityImpact:
      'OS Fingerprinting: Different OSes start with distinct default TTLs (Linux = 64, Windows = 128, Cisco IOS = 255). Attackers and tools like Nmap examine inbound TTL to identify victim operating systems.',
  },
  {
    id: 'ip-protocol',
    name: 'Protocol (8 bits)',
    bitOffset: 'Bits 72-79 (1 Byte)',
    bitLength: 8,
    byteLength: '1 Byte',
    sampleBinary: '00000110',
    sampleHex: '0x06 (TCP)',
    color: 'from-blue-600 to-indigo-700',
    shortSummary: 'Identifies which Layer 4 protocol payload is encapsulated in this IP packet.',
    whatItDoes:
      'Tells the operating system kernel network stack which Layer 4 protocol engine should parse the payload.',
    howItIsUsed:
      'Standard protocol numbers (assigned by IANA): 6 = TCP, 17 = UDP, 1 = ICMP (Ping), 50 = ESP (IPsec VPN), 89 = OSPF.',
    securityImpact:
      'Protocol Scanning: Attackers send raw IP packets with various protocol numbers to discover what transport protocols an endpoint kernel supports and responds to.',
  },
  {
    id: 'ip-checksum',
    name: 'Header Checksum (16 bits)',
    bitOffset: 'Bits 80-95 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '10111000 00100001',
    sampleHex: '0xB821',
    color: 'from-amber-600 to-yellow-600',
    shortSummary: '16-bit 1\'s complement checksum calculated strictly over the IP header.',
    whatItDoes:
      'Verifies that the IP header was not corrupted in transit. Notice: Because TTL is decremented by 1 at every router hop, every router MUST recompute and rewrite this Header Checksum before forwarding!',
    howItIsUsed:
      'Receiver recalculates the 1\'s complement sum. If result is non-zero, packet is dropped.',
    securityImpact:
      'Recalculating checksums at every hop was identified as a CPU bottleneck for gigabit routers, which is why IPv6 removed the header checksum entirely (relying on Layer 2 and Layer 4 checksums).',
  },
  {
    id: 'ip-src-ip',
    name: 'Source IP Address (32 bits)',
    bitOffset: 'Bits 96-127 (4 Bytes)',
    bitLength: 32,
    byteLength: '4 Bytes (32 bits)',
    sampleBinary: '11000000 10101000 00000001 00110010',
    sampleHex: '192.168.1.50',
    color: 'from-purple-600 to-pink-600',
    shortSummary: 'Logical 32-bit address of the device sending this packet.',
    whatItDoes:
      'Dotted-decimal representation of four 8-bit octets (e.g. 192.168.1.50). Specifies where response packets should be addressed.',
    howItIsUsed:
      'Used by recipient sockets to reply, and by stateful firewalls to track connection state.',
    securityImpact:
      'IP Spoofing: In connectionless UDP attacks (DNS/NTP amplification), attackers spoof the victim\'s Source IP so that servers reflect massive responses directly onto the victim.',
  },
  {
    id: 'ip-dst-ip',
    name: 'Destination IP Address (32 bits)',
    bitOffset: 'Bits 128-159 (4 Bytes)',
    bitLength: 32,
    byteLength: '4 Bytes (32 bits)',
    sampleBinary: '01011101 10111000 11011000 00100010',
    sampleHex: '93.184.216.34',
    color: 'from-cyan-600 to-emerald-600',
    shortSummary: 'Logical 32-bit address of the final intended recipient host.',
    whatItDoes:
      'The destination address that routers evaluate against their global routing table (RIB/FIB) using Longest Prefix Match (LPM) to forward traffic across the internet.',
    howItIsUsed:
      'Remains constant throughout the packet journey (unless translated via NAT or proxy).',
    securityImpact:
      'Border routers use BGP RPKI and Unicast Reverse Path Forwarding (uRPF) to verify valid routes and drop packets with unroutable destination or forged source addresses.',
  },
];

const TCP_FIELDS: BitfieldSpec[] = [
  {
    id: 'tcp-src-port',
    name: 'Source Port (16 bits)',
    bitOffset: 'Bits 0-15 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '11010100 00110001',
    sampleHex: '0xD431 (Port 54321)',
    color: 'from-emerald-500 to-teal-600',
    shortSummary: 'Ephemeral or service port of the sending process.',
    whatItDoes:
      'Identifies the specific application socket on the client that opened the connection. Client operating systems pick a random ephemeral port (typically in range 49152-65535) so multiple browser tabs connecting to the same website don\'t mix up packets.',
    howItIsUsed:
      'The destination server uses this Source Port as the Destination Port when sending response segments.',
    securityImpact:
      'Source Port Randomization defends against DNS Cache Poisoning and blind TCP spoofing attacks by making port numbers unpredictable.',
  },
  {
    id: 'tcp-dst-port',
    name: 'Destination Port (16 bits)',
    bitOffset: 'Bits 16-31 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '00000001 10111011',
    sampleHex: '0x01BB (Port 443)',
    color: 'from-teal-500 to-cyan-600',
    shortSummary: 'Target service port on the receiving server.',
    whatItDoes:
      'Delivers data to the exact listening daemon process on the host. Well-known port numbers (0-1023) are assigned by IANA: 80 = HTTP, 443 = HTTPS, 22 = SSH, 53 = DNS, 25 = SMTP.',
    howItIsUsed:
      'The OS kernel checks its socket table (like `netstat -tlpn` or `ss -tlpn`) and transfers the segment payload to the matching listening application.',
    securityImpact:
      'Port Scanning (e.g. Nmap) probes destination ports across target servers to identify running services and unpatched software versions.',
  },
  {
    id: 'tcp-seq-num',
    name: 'Sequence Number (32 bits)',
    bitOffset: 'Bits 32-63 (4 Bytes)',
    bitLength: 32,
    byteLength: '4 Bytes (32 bits)',
    sampleBinary: '00000000 00001111 01000010 01000000',
    sampleHex: '0x000F4240 (Seq = 1,000,000)',
    color: 'from-cyan-500 to-blue-600',
    shortSummary: 'Tracks the byte position of this segment in the overall data stream.',
    whatItDoes:
      'TCP treats communication as an uninterrupted byte stream. The Sequence Number identifies the byte offset of the first data byte in this segment. It guarantees that packets arriving out of order can be reconstructed perfectly.',
    howItIsUsed:
      'During the 3-Way Handshake, both client and server negotiate a random Initial Sequence Number (ISN).',
    securityImpact:
      'TCP Sequence Prediction & Session Hijacking: If an attacker can predict sequence numbers (historical bug in early BSD/Windows stacks), they can forge packets and inject malicious commands into an active authenticated connection.',
  },
  {
    id: 'tcp-ack-num',
    name: 'Acknowledgment Number (32 bits)',
    bitOffset: 'Bits 64-95 (4 Bytes)',
    bitLength: 32,
    byteLength: '4 Bytes (32 bits)',
    sampleBinary: '00000000 00001111 01000110 00110001',
    sampleHex: '0x000F4631 (Ack = 1,001,009)',
    color: 'from-blue-500 to-indigo-600',
    shortSummary: 'Cumulative ACK: the next sequential byte the sender expects to receive.',
    whatItDoes:
      'Valid only when the ACK control flag is set to 1. Informs the communication peer: "I have successfully received all bytes up to byte X-1; I am now waiting for byte X."',
    howItIsUsed:
      'Drives the TCP Sliding Window! Receiving an ACK tells the sender it can free acknowledged buffer space and slide its transmission window forward.',
    securityImpact:
      'ACK Storms: Caused by bi-directional out-of-sync session hijacking, generating thousands of repeated ACK packets that saturate the link.',
  },
  {
    id: 'tcp-data-offset',
    name: 'Data Offset / Header Length (4 bits)',
    bitOffset: 'Bits 96-99 (4 bits)',
    bitLength: 4,
    byteLength: '4 bits',
    sampleBinary: '0101',
    sampleHex: '0x5 (5 words = 20 Bytes)',
    color: 'from-indigo-500 to-purple-600',
    shortSummary: 'Specifies TCP header length in 32-bit (4-byte) words. Minimum is 5 (20 bytes).',
    whatItDoes:
      'Tells the receiving host where the TCP header ends and where application data begins. If options like SACK or Timestamps are present, Data Offset increases up to 15 (60 bytes max).',
    howItIsUsed:
      'Used to calculate payload start pointer: `Data_Offset × 4 bytes`.',
    securityImpact:
      'Discrepancies between Data Offset and segment length can trigger firewall parsing evasion or protocol confusion.',
  },
  {
    id: 'tcp-reserved',
    name: 'Reserved (3 bits)',
    bitOffset: 'Bits 100-102 (3 bits)',
    bitLength: 3,
    byteLength: '3 bits',
    sampleBinary: '000',
    sampleHex: '0x0',
    color: 'from-slate-600 to-slate-700',
    shortSummary: 'Reserved for future use. Must be 0 in standard TCP implementations.',
    whatItDoes:
      'Preserved bits in the specification. (Historical RFC 3540 used one bit for NS Nonce Sum).',
    howItIsUsed:
      'Standard stacks zero these bits out.',
    securityImpact:
      'Covert Channels: Hackers can embed secret exfiltration data into these unused reserved bits to communicate past inspection filters.',
  },
  {
    id: 'tcp-flags',
    name: 'Control Flags (9 bits: URG, ACK, PSH, RST, SYN, FIN...)',
    bitOffset: 'Bits 103-111 (9 bits)',
    bitLength: 9,
    byteLength: '9 bits',
    sampleBinary: '000010010 (SYN + ACK)',
    sampleHex: '0x012',
    color: 'from-rose-500 to-red-600',
    shortSummary: 'The 1-bit steering flags that manage connection lifecycle and flow control.',
    whatItDoes:
      'Each bit acts as an on/off switch that dictates the purpose and state of the packet in the TCP finite state machine.',
    howItIsUsed:
      'SYN initiates connections, ACK confirms receipt, FIN gracefully closes, RST forcefully aborts, PSH asks for immediate processing, URG indicates priority data.',
    securityImpact:
      'SYN Flood DDoS exhausts server memory by initiating handshakes without finishing them. Christmas Tree (XMAS) scans turn on FIN, URG, and PSH simultaneously to map operating system responses.',
    bitDetails: [
      { bit: 'Bit 0 (CWR)', name: 'Congestion Window Reduced', meaning: 'Sender received an ECN-Echo flag and reduced its sending rate.' },
      { bit: 'Bit 1 (ECE)', name: 'ECN-Echo', meaning: 'Receiver tells sender that intermediate routers experienced congestion.' },
      { bit: 'Bit 2 (URG)', name: 'Urgent Pointer', meaning: '1 = Urgent pointer field is valid; prioritize urgent byte in buffer.' },
      { bit: 'Bit 3 (ACK)', name: 'Acknowledgment', meaning: '1 = Ack number field is valid. Present on all packets after initial SYN.' },
      { bit: 'Bit 4 (PSH)', name: 'Push Function', meaning: '1 = Push buffered data to receiving app immediately without waiting for full buffer.' },
      { bit: 'Bit 5 (RST)', name: 'Reset Connection', meaning: '1 = Abruptly kill connection due to unrecoverable error or closed port.' },
      { bit: 'Bit 6 (SYN)', name: 'Synchronize', meaning: '1 = Synchronize Sequence Numbers; used only in 3-Way Handshake initiation.' },
      { bit: 'Bit 7 (FIN)', name: 'Finish', meaning: '1 = No more data from sender; begins graceful 4-way connection teardown.' },
    ],
  },
  {
    id: 'tcp-window-size',
    name: 'Window Size (16 bits) — Flow Control',
    bitOffset: 'Bits 112-127 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes (16 bits)',
    sampleBinary: '11111111 11111111',
    sampleHex: '0xFFFF (65,535 Bytes)',
    color: 'from-amber-500 to-yellow-600',
    shortSummary: 'Advertises how many bytes of buffer the receiver can accept (Flow Control).',
    whatItDoes:
      'Core of the TCP Sliding Window! The receiver tells the sender: "I currently have X bytes of empty buffer space. Do NOT send more than X bytes without waiting for an ACK." Prevents fast senders from drowning slow receivers.',
    howItIsUsed:
      'If the receiver buffer fills up, it sends Window Size = 0 (Zero Window), forcing the sender to halt transmission until space clears.',
    securityImpact:
      'TCP Window Scale option (RFC 7323) is required for modern 10Gbps+ links, expanding the 16-bit window up to 1 Gigabyte using a bit-shift multiplier.',
  },
  {
    id: 'tcp-checksum',
    name: 'TCP Checksum (16 bits)',
    bitOffset: 'Bits 128-143 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '11001100 01010101',
    sampleHex: '0xCC55',
    color: 'from-purple-600 to-pink-600',
    shortSummary: 'Error check over TCP header, payload, AND a 12-byte IP pseudo-header.',
    whatItDoes:
      'Mandatory mathematical checksum that catches bit errors. Uniquely, TCP incorporates an "IP Pseudo-Header" (Source IP, Destination IP, Protocol 6, TCP Length) into the calculation to guarantee the packet wasn\'t delivered to the wrong IP address.',
    howItIsUsed:
      'Calculated in software or offloaded to the physical NIC via TCP Checksum Offloading (Tx/Rx Checksum).',
    securityImpact:
      'Corrupted checksums cause immediate silent drops by the kernel stack with no ACK returned.',
  },
  {
    id: 'tcp-urgent-ptr',
    name: 'Urgent Pointer (16 bits)',
    bitOffset: 'Bits 144-159 (2 Bytes)',
    bitLength: 16,
    byteLength: '2 Bytes',
    sampleBinary: '00000000 00000000',
    sampleHex: '0x0000',
    color: 'from-slate-600 to-slate-700',
    shortSummary: 'Points to the last byte of urgent priority data when URG flag is set.',
    whatItDoes:
      'Specifies an offset from the Sequence Number indicating out-of-band urgent data that must be processed ahead of queued stream bytes (historical telnet Ctrl+C interrupt signal).',
    howItIsUsed:
      'Rarely used in modern applications; modern protocols use separate control channels instead.',
    securityImpact:
      'Historical NIDS evasion techniques manipulated the Urgent Pointer to hide exploit payloads from intrusion detection inspection.',
  },
];

export function BitfieldDissector() {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolHeaderType>('ipv4');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('ip-ttl');

  const currentFieldList =
    selectedProtocol === 'ipv4'
      ? IPV4_FIELDS
      : selectedProtocol === 'tcp'
      ? TCP_FIELDS
      : ETHERNET_FIELDS;

  const activeField =
    currentFieldList.find((f) => f.id === selectedFieldId) || currentFieldList[0];

  return (
    <div className="rounded-3xl bg-[#070b14] border border-slate-800 shadow-2xl overflow-hidden space-y-6">
      {/* ── HEADER & PROTOCOL SELECTOR ───────────────────────────────────── */}
      <div className="p-6 bg-[#0a0f1e] border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950/90 border border-purple-800 text-purple-300">
              <Binary className="w-3 h-3 text-purple-400" />
              BIT-LEVEL PROTOCOL DISSECTOR
            </span>
            <span className="text-xs font-mono text-slate-400">
              Inspect every bit, byte, flag, and security use
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Bit-by-Bit Header Field Deep Dive
          </h2>
          <p className="text-xs text-slate-400">
            Click any field or bit block below to uncover exactly what it does, why it exists, and how security engineers analyze it.
          </p>
        </div>

        {/* Protocol Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setSelectedProtocol('ethernet');
              setSelectedFieldId('eth-dst-mac');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedProtocol === 'ethernet'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ethernet II (L2)
          </button>
          <button
            onClick={() => {
              setSelectedProtocol('ipv4');
              setSelectedFieldId('ip-ttl');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedProtocol === 'ipv4'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IPv4 Header (L3)
          </button>
          <button
            onClick={() => {
              setSelectedProtocol('tcp');
              setSelectedFieldId('tcp-flags');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedProtocol === 'tcp'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TCP Header (L4)
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE 32-BIT GRID MAP ──────────────────────────────────── */}
      <div className="px-6">
        <div className="p-5 rounded-2xl bg-[#090d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              Standard 32-Bit Word Header Layout (RFC Specification)
            </span>
            <span className="text-[11px] text-cyan-400">
              Click a block to inspect its bits ➔
            </span>
          </div>

          {/* Header Field Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
            {currentFieldList.map((field) => {
              const isSelected = activeField.id === field.id;
              return (
                <button
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_15px_-2px_rgba(6,182,212,0.4)] scale-[1.02] z-10'
                      : 'bg-[#060a14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {field.bitOffset}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {field.byteLength}
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {field.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
                    Sample: {field.sampleHex}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BIT-LEVEL DISSECTION INSPECTOR ───────────────────────────────── */}
      <div className="px-6 pb-6">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-6">
          {/* Active Field Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-300">
                  {activeField.bitOffset}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Total Size: {activeField.byteLength} ({activeField.bitLength} bits)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {activeField.name}
              </h3>
              <p className="text-xs text-slate-300">{activeField.shortSummary}</p>
            </div>

            {/* Binary Sample Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 shrink-0">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Binary Representation</div>
              <div className="text-emerald-400 font-bold tracking-widest text-[11px] truncate max-w-xs">
                {activeField.sampleBinary}
              </div>
              <div className="text-[10px] text-slate-400">
                Hex: <span className="text-amber-400 font-bold">{activeField.sampleHex}</span>
              </div>
            </div>
          </div>

          {/* Sub-Bit Breakdown Table (e.g. for Flags) */}
          {activeField.bitDetails && activeField.bitDetails.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5" />
                Bit-by-Bit Flag Definitions:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeField.bitDetails.map((b, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#060a14] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-400 font-bold">{b.bit}</span>
                      <span className="font-bold text-white text-[11px]">{b.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">{b.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed 3-Column Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: What It Does */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wide">
                <Info className="w-4 h-4 text-cyan-400" />
                1. What This Bitfield Does
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeField.whatItDoes}</p>
            </div>

            {/* Card 2: How It Is Used */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-emerald-400" />
                2. Real-World Engineering Use
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeField.howItIsUsed}</p>
            </div>

            {/* Card 3: Security Impact */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wide">
                <Shield className="w-4 h-4 text-rose-400" />
                3. Cyber Security & Attack Angle
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeField.securityImpact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
