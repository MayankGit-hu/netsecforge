'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Server,
  Laptop,
  Cpu,
  Shield,
  Layers,
  Zap,
  Info,
  Network,
  Lock,
  CheckCircle2,
  HelpCircle,
  Radio,
  FileCode,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export type ModelMode = 'osi' | 'tcpip' | 'mapping';

interface FlowStep {
  id: number;
  phaseId: 1 | 2 | 3 | 4 | 5 | 6;
  phaseTitle: string;
  direction: 'forward' | 'transit-forward' | 'server-process' | 'backward' | 'transit-backward' | 'done';
  activeEntity: 'client' | 'wire' | 'server';
  activeLayerOsi: number; // 7 down to 1, or 0 for wire
  activeLayerTcpIp: number; // 4 down to 1
  pduName: string;
  stepTitle: string;
  whatHappens: string;
  analogy: string;
  securityInsight: string;
  headers: {
    ethernet: boolean;
    ip: boolean;
    tcp: boolean;
    data: boolean;
    fcs: boolean;
  };
  headerDetails: {
    srcMac: string;
    dstMac: string;
    srcIp: string;
    dstIp: string;
    srcPort: string;
    dstPort: string;
    payloadText: string;
    fcsStatus: string;
  };
}

const FLOW_STEPS: FlowStep[] = [
  // ── PHASE 1: CLIENT REQUEST ENCAPSULATION ─────────────────────────────────
  {
    id: 0,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 7,
    activeLayerTcpIp: 4,
    pduName: 'Data (Application Message)',
    stepTitle: 'Step 1: Application Layer (Browser Initiates Request)',
    whatHappens:
      'The user enters "https://example.com" in Chrome. The browser generates a raw HTTP GET request string asking for the web page content. No network addresses have been added yet.',
    analogy: 'Writing a letter to a friend. You have written the message on a piece of paper, but haven\'t placed it in an envelope yet.',
    securityInsight:
      'Layer 7 is where Web Application Firewalls (WAF) inspect for SQL Injection, Cross-Site Scripting (XSS), and malicious HTTP payloads.',
    headers: { ethernet: false, ip: false, tcp: false, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '—',
      dstIp: '—',
      srcPort: '—',
      dstPort: '—',
      payloadText: 'GET /index.html HTTP/1.1\\r\\nHost: example.com',
      fcsStatus: 'None',
    },
  },
  {
    id: 1,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 6,
    activeLayerTcpIp: 4,
    pduName: 'Data (Formatted & Encrypted)',
    stepTitle: 'Step 2: Presentation & Session Layers (TLS & Session Setup)',
    whatHappens:
      'OSI Layer 6 handles syntax, data formatting, and TLS/SSL encryption. Layer 5 initiates and coordinates the communication session dialog. In modern TCP/IP, both functions are handled within the Application layer.',
    analogy: 'Translating the letter into a secret language (encryption) and agreeing on how the phone call will be managed.',
    securityInsight:
      'TLS encryption prevents eavesdroppers on public Wi-Fi from reading sensitive credentials or passwords in transit.',
    headers: { ethernet: false, ip: false, tcp: false, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '—',
      dstIp: '—',
      srcPort: '—',
      dstPort: '—',
      payloadText: '🔒 TLS Encrypted Application Data [AES-256-GCM]',
      fcsStatus: 'None',
    },
  },
  {
    id: 2,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 4,
    activeLayerTcpIp: 3,
    pduName: 'Segment (TCP)',
    stepTitle: 'Step 3: Transport Layer (Adding Port Numbers)',
    whatHappens:
      'The Transport layer assigns a random dynamic Source Port (54321) to identify this specific browser tab, and Destination Port 443 (standard HTTPS web server). It adds sequence and acknowledgment numbers for reliable delivery.',
    analogy: 'Adding apartment unit numbers. The building is the destination, but Port 443 is the exact apartment unit where the web server lives.',
    securityInsight:
      'Transport Layer security involves monitoring for SYN Flood attacks (DoS) and configuring Layer 4 firewalls that filter traffic by port.',
    headers: { ethernet: false, ip: false, tcp: true, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '—',
      dstIp: '—',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '🔒 TLS Payload (HTTP Request)',
      fcsStatus: 'None',
    },
  },
  {
    id: 3,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 3,
    activeLayerTcpIp: 2,
    pduName: 'Packet (IPv4 / IPv6)',
    stepTitle: 'Step 4: Network Layer (Adding Global IP Addresses)',
    whatHappens:
      'The Network layer wraps the TCP segment into an IP Packet. It adds Source IP (192.168.1.50) and Destination IP (93.184.216.34), along with TTL (Time-To-Live = 64) to prevent infinite loops across routers.',
    analogy: 'Writing the full postal street address on the outside of the mailing box so postal distribution hubs know where to steer it.',
    securityInsight:
      'Attackers can spoof source IP addresses. Firewalls use Layer 3 Access Control Lists (ACLs) to block hostile IP subnets.',
    headers: { ethernet: false, ip: true, tcp: true, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '192.168.1.50',
      dstIp: '93.184.216.34',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '🔒 TLS Payload (HTTP Request)',
      fcsStatus: 'None',
    },
  },
  {
    id: 4,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 2,
    activeLayerTcpIp: 1,
    pduName: 'Frame (Ethernet II)',
    stepTitle: 'Step 5: Data Link Layer (Adding Local MAC Addresses & FCS)',
    whatHappens:
      'Ethernet encapsulates the IP packet into a Frame. It adds the client\'s physical Source MAC (00:1A:2B:3C:4D:5E) and the next-hop Default Gateway router\'s MAC (00:50:56:FE:ED:01). It also appends a 4-byte FCS (Frame Check Sequence) CRC-32 checksum at the tail.',
    analogy: 'Putting the package onto a courier dispatch truck. The truck\'s license plate is the MAC address for local physical delivery to the local post depot.',
    securityInsight:
      'Vulnerable to ARP Poisoning and MAC spoofing. Switches implement Dynamic ARP Inspection (DAI) and Port Security at Layer 2.',
    headers: { ethernet: true, ip: true, tcp: true, data: true, fcs: true },
    headerDetails: {
      srcMac: '00:1A:2B:3C:4D:5E',
      dstMac: '00:50:56:FE:ED:01',
      srcIp: '192.168.1.50',
      dstIp: '93.184.216.34',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '🔒 TLS Payload (HTTP Request)',
      fcsStatus: 'CRC-32: 0x9B2C4F1A (Calculated)',
    },
  },
  {
    id: 5,
    phaseId: 1,
    phaseTitle: 'Phase 1: Client Request Encapsulation (Top-Down)',
    direction: 'forward',
    activeEntity: 'client',
    activeLayerOsi: 1,
    activeLayerTcpIp: 1,
    pduName: 'Bits (Raw Binary Pulses)',
    stepTitle: 'Step 6: Physical Layer (Serialization to Voltage/Light/Radio)',
    whatHappens:
      'The Network Interface Card (NIC) converts all the binary 1s and 0s of the frame into physical signals: voltage pulses on copper Cat6 cables, light pulses on optical fiber, or electromagnetic waves on Wi-Fi.',
    analogy: 'The delivery truck rolls onto the highway. Data is now physical energy moving across space.',
    securityInsight:
      'Physical layer security requires locking server rooms, fiber-optic tap detection, and shielding against electromagnetic emanations (TEMPEST).',
    headers: { ethernet: true, ip: true, tcp: true, data: true, fcs: true },
    headerDetails: {
      srcMac: '00:1A:2B:3C:4D:5E',
      dstMac: '00:50:56:FE:ED:01',
      srcIp: '192.168.1.50',
      dstIp: '93.184.216.34',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '01001000 01100101 01111000 00100000 01010000 01100001 01100011 01101011',
      fcsStatus: 'Transmitted as bitstream',
    },
  },

  // ── PHASE 2: TRANSMISSION ACROSS WIRE & INTERNET ROUTING ───────────────────
  {
    id: 6,
    phaseId: 2,
    phaseTitle: 'Phase 2: Network Transit (Client → Server)',
    direction: 'transit-forward',
    activeEntity: 'wire',
    activeLayerOsi: 0,
    activeLayerTcpIp: 0,
    pduName: 'In-Transit Packet Stream',
    stepTitle: 'Step 7: Wire Transit & Router Hop (L3 Routing & L2 Rewriting)',
    whatHappens:
      'The packet traverses local switches, hits the Default Gateway Router, crosses the ISP and Internet Backbone. Notice: Routers strip the Layer 2 MAC frame, check the Layer 3 Destination IP, decrement TTL from 64 to 63, and build a brand-new Layer 2 frame for the server\'s subnet!',
    analogy: 'Sorting hubs at national airports. Airport workers check the destination city, swap shipping containers, but never open your inner sealed box.',
    securityInsight:
      'Network routers perform BGP routing security, DDoS scrubbing, and stateful inspection in Next-Gen Firewalls along the path.',
    headers: { ethernet: true, ip: true, tcp: true, data: true, fcs: true },
    headerDetails: {
      srcMac: 'E4:C7:22:90:11:02 (Router Out)',
      dstMac: 'AA:BB:CC:DD:EE:01 (Server NIC)',
      srcIp: '192.168.1.50',
      dstIp: '93.184.216.34',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '⚡ Flowing at light-speed across transatlantic fiber',
      fcsStatus: 'CRC-32 Validated',
    },
  },

  // ── PHASE 3: SERVER DECAPSULATION (BOTTOM-UP) ─────────────────────────────
  {
    id: 7,
    phaseId: 3,
    phaseTitle: 'Phase 3: Server Decapsulation (Bottom-Up Unwrap)',
    direction: 'server-process',
    activeEntity: 'server',
    activeLayerOsi: 1,
    activeLayerTcpIp: 1,
    pduName: 'Bits Received → Frame Reassembled',
    stepTitle: 'Step 8: Server Physical & Data Link Layer (L1 & L2 Unwrap)',
    whatHappens:
      'The Server\'s NIC receives electrical/optical pulses and reconstructs the Ethernet frame. It recalculates the CRC-32 checksum against the FCS trailer. Because there were 0 bit-flips, the checksum matches! The server verifies the destination MAC is its own, then STRIPS the Ethernet Header and FCS trailer.',
    analogy: 'The delivery truck arrives at the recipient\'s loading dock. The shipping container is opened and verified undamaged, then discarded.',
    securityInsight:
      'If the FCS checksum does not match due to line noise or interference, the frame is immediately dropped without alerting the sender.',
    headers: { ethernet: false, ip: true, tcp: true, data: true, fcs: false },
    headerDetails: {
      srcMac: 'Stripped ✂️',
      dstMac: 'Stripped ✂️',
      srcIp: '192.168.1.50',
      dstIp: '93.184.216.34',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '🔒 TLS Payload (Still Encrypted)',
      fcsStatus: 'FCS Checked & Stripped ✂️',
    },
  },
  {
    id: 8,
    phaseId: 3,
    phaseTitle: 'Phase 3: Server Decapsulation (Bottom-Up Unwrap)',
    direction: 'server-process',
    activeEntity: 'server',
    activeLayerOsi: 3,
    activeLayerTcpIp: 2,
    pduName: 'Packet → Segment',
    stepTitle: 'Step 9: Server Network Layer (L3 IP Inspection & Strip)',
    whatHappens:
      'The server\'s OS kernel receives the IP packet. It verifies that Destination IP (93.184.216.34) matches its local interface. It checks the Protocol field (6 = TCP) to determine where to hand it next, then STRIPS the IPv4 header.',
    analogy: 'Reading the recipient name on the envelope, confirming this office is indeed the destination, and slicing the outer postal envelope open.',
    securityInsight:
      'Host-based firewalls (like iptables / nftables) inspect here to ensure the source IP is not blacklisted.',
    headers: { ethernet: false, ip: false, tcp: true, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: 'Stripped ✂️',
      dstIp: 'Stripped ✂️',
      srcPort: '54321',
      dstPort: '443',
      payloadText: '🔒 TLS Payload (Still Encrypted)',
      fcsStatus: '—',
    },
  },
  {
    id: 9,
    phaseId: 3,
    phaseTitle: 'Phase 3: Server Decapsulation (Bottom-Up Unwrap)',
    direction: 'server-process',
    activeEntity: 'server',
    activeLayerOsi: 4,
    activeLayerTcpIp: 3,
    pduName: 'Segment → Reassembled Stream Data',
    stepTitle: 'Step 10: Server Transport Layer (L4 TCP Socket Match)',
    whatHappens:
      'The OS TCP stack inspects Destination Port 443. It finds the listening socket created by the web server process (e.g., NGINX/Apache). It sends an ACK packet back, verifies TCP segment order, and STRIPS the TCP header.',
    analogy: 'Walking up to apartment unit 443, knocking on the door, and handing the inner letter directly to the resident.',
    securityInsight:
      'Port scanners (like Nmap) scan these ports. Only ports running authorized services should be exposed to the internet.',
    headers: { ethernet: false, ip: false, tcp: false, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '—',
      dstIp: '—',
      srcPort: 'Stripped ✂️',
      dstPort: 'Stripped ✂️',
      payloadText: '🔒 TLS Record Layer (Session Key Decrypting...)',
      fcsStatus: '—',
    },
  },
  {
    id: 10,
    phaseId: 3,
    phaseTitle: 'Phase 3: Server Decapsulation (Bottom-Up Unwrap)',
    direction: 'server-process',
    activeEntity: 'server',
    activeLayerOsi: 7,
    activeLayerTcpIp: 4,
    pduName: 'Application Data (HTTP Request Processed)',
    stepTitle: 'Step 11: Server Application Layer (Request Received & Processed)',
    whatHappens:
      'The TLS session decrypts the payload. The web server daemon receives the clean request: "GET /index.html". The server queries its database/filesystem and prepares the HTTP response payload: "HTTP/1.1 200 OK" with HTML/CSS content!',
    analogy: 'The recipient reads the letter, understands what you asked, and immediately begins writing a friendly reply letter back to you!',
    securityInsight:
      'Application logic validation defends against unauthorized access, broken object level authorization (BOLA), and data leakage.',
    headers: { ethernet: false, ip: false, tcp: false, data: true, fcs: false },
    headerDetails: {
      srcMac: '—',
      dstMac: '—',
      srcIp: '—',
      dstIp: '—',
      srcPort: '—',
      dstPort: '—',
      payloadText: 'HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n<h1>Welcome to NetSecForge!</h1>',
      fcsStatus: 'Ready for Reverse Response',
    },
  },

  // ── PHASE 4: SERVER RESPONSE ENCAPSULATION (VICE VERSA!) ──────────────────
  {
    id: 11,
    phaseId: 4,
    phaseTitle: 'Phase 4: Server Response Encapsulation (Vice Versa!)',
    direction: 'backward',
    activeEntity: 'server',
    activeLayerOsi: 4,
    activeLayerTcpIp: 3,
    pduName: 'Response Segment (Ports Swapped!)',
    stepTitle: 'Step 12: Server Re-Encapsulates (Ports & IPs Inverted)',
    whatHappens:
      'Now the reverse process begins! The server encapsulates the HTTP 200 OK data into a TCP Segment. Notice the ports are swapped: Source Port is now 443 (Server) and Destination Port is 54321 (Client\'s browser tab). Then IP wraps it with Source IP 93.184.216.34 and Destination IP 192.168.1.50!',
    analogy: 'The server addresses their return envelope back to you, placing your address as recipient and their own as return address.',
    securityInsight:
      'Stateful firewalls remember the original outbound request in their state table, automatically allowing this established return traffic through without blocking.',
    headers: { ethernet: true, ip: true, tcp: true, data: true, fcs: true },
    headerDetails: {
      srcMac: 'AA:BB:CC:DD:EE:01',
      dstMac: 'E4:C7:22:90:11:02',
      srcIp: '93.184.216.34',
      dstIp: '192.168.1.50',
      srcPort: '443',
      dstPort: '54321',
      payloadText: '🔒 HTTP/1.1 200 OK (HTML/CSS Webpage Data)',
      fcsStatus: 'CRC-32: 0x4D8E210C (Recalculated)',
    },
  },

  // ── PHASE 5: RETURN WIRE TRANSIT (SERVER → CLIENT) ────────────────────────
  {
    id: 12,
    phaseId: 5,
    phaseTitle: 'Phase 5: Return Transit (Server → Client across Wire)',
    direction: 'transit-backward',
    activeEntity: 'wire',
    activeLayerOsi: 0,
    activeLayerTcpIp: 0,
    pduName: 'Return Bitstream on the Wire',
    stepTitle: 'Step 13: Return Transit (Wire & Gateway Routing back to Client)',
    whatHappens:
      'The response travels back across the physical fiber optic cables and routers. The client\'s home/office router receives the packet, uses NAT (Network Address Translation) to match port 54321 to the client\'s private IP, creates a local Ethernet frame, and transmits it to the client\'s Wi-Fi / Ethernet port.',
    analogy: 'The mail delivery truck navigates the highway back to your hometown post office and puts the envelope into your private mailbox.',
    securityInsight:
      'NAT (Network Address Translation) shields private RFC 1918 IPs (192.168.x.x) from direct exposure on the public internet.',
    headers: { ethernet: true, ip: true, tcp: true, data: true, fcs: true },
    headerDetails: {
      srcMac: '00:50:56:FE:ED:01 (Gateway)',
      dstMac: '00:1A:2B:3C:4D:5E (Client NIC)',
      srcIp: '93.184.216.34',
      dstIp: '192.168.1.50',
      srcPort: '443',
      dstPort: '54321',
      payloadText: '⚡ Inbound Response Bits (Returning to Client)',
      fcsStatus: 'CRC-32 Verified on Return',
    },
  },

  // ── PHASE 6: CLIENT DECAPSULATION & RENDER ────────────────────────────────
  {
    id: 13,
    phaseId: 6,
    phaseTitle: 'Phase 6: Client Decapsulation & Browser Rendering',
    direction: 'done',
    activeEntity: 'client',
    activeLayerOsi: 7,
    activeLayerTcpIp: 4,
    pduName: 'Clean Webpage Rendered',
    stepTitle: 'Step 14: Client Unwraps Response & Renders Webpage!',
    whatHappens:
      'The client NIC receives bits → checks FCS & strips MAC header (L2) → verifies destination IP & strips IP header (L3) → delivers to port 54321 & strips TCP header (L4) → TLS decrypts data → Browser receives HTTP 200 OK, parses the HTML/CSS, and renders the website on your screen! Complete round trip successful!',
    analogy: 'You open the mailbox, tear open the envelope, pull out the reply letter, read the answer, and smile! Full communication cycle complete!',
    securityInsight:
      'Browser sandbox protections, Content Security Policy (CSP), and Same-Origin Policy (SOP) protect the user from malicious scripts on the rendered page.',
    headers: { ethernet: false, ip: false, tcp: false, data: true, fcs: false },
    headerDetails: {
      srcMac: 'Stripped ✂️',
      dstMac: 'Stripped ✂️',
      srcIp: 'Stripped ✂️',
      dstIp: 'Stripped ✂️',
      srcPort: 'Delivered to Tab',
      dstPort: '54321',
      payloadText: '🎉 HTML RENDERED: "Welcome to NetSecForge!"',
      fcsStatus: 'Verified & Cleared',
    },
  },
];

// OSI Layer details for the interactive inspector
const OSI_LAYERS = [
  {
    num: 7,
    name: 'Application',
    pdu: 'Data',
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-400',
    bgBadge: 'bg-cyan-950/60 border-cyan-800 text-cyan-300',
    protocols: 'HTTP, HTTPS, DNS, SSH, FTP, SMTP, BGP, SNMP',
    devices: 'Host Applications, Web Browsers, Proxies, WAF',
    attacks: 'SQL Injection, Cross-Site Scripting (XSS), L7 HTTP Floods',
    eli5: 'The human-facing interface. When you click a link or type an email, this layer creates the message.',
  },
  {
    num: 6,
    name: 'Presentation',
    pdu: 'Data',
    color: 'from-blue-500 to-indigo-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    bgBadge: 'bg-blue-950/60 border-blue-800 text-blue-300',
    protocols: 'TLS / SSL, ASCII, UTF-8, JPEG, PNG, MPEG',
    devices: 'OS Encryption Engines, TLS Terminators',
    attacks: 'SSL Stripping, Weak Cipher Suite Downgrade (POODLE)',
    eli5: 'The translator and security guard. It encrypts private data and formats files so both sides understand the format.',
  },
  {
    num: 5,
    name: 'Session',
    pdu: 'Data',
    color: 'from-indigo-500 to-purple-500',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-400',
    bgBadge: 'bg-indigo-950/60 border-indigo-800 text-indigo-300',
    protocols: 'RPC, NetBIOS, PPTP, Sockets, Session API',
    devices: 'OS Network Subsystems, Load Balancers',
    attacks: 'Session Hijacking, Man-in-the-Middle (MitM) session fixation',
    eli5: 'The phone operator. Keeps the communication session open, handles re-connection if Wi-Fi blips, and closes cleanly.',
  },
  {
    num: 4,
    name: 'Transport',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
    protocols: 'TCP (Reliable, Handshake), UDP (Fast, Loss-Tolerant), QUIC',
    devices: 'Stateful Firewalls, Load Balancers, Layer 4 Proxies',
    attacks: 'SYN Flood DDoS, Port Scanning, UDP Amplification',
    eli5: 'The postal delivery contract. Decides whether to send via Certified Mail with delivery receipts (TCP) or regular postcard (UDP), and stamps the apartment unit number (Port).',
  },
  {
    num: 3,
    name: 'Network',
    pdu: 'Packet',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    bgBadge: 'bg-purple-950/60 border-purple-800 text-purple-300',
    protocols: 'IPv4, IPv6, ICMP (Ping), IPsec, OSPF, BGP',
    devices: 'Routers, Layer 3 Switches, Next-Gen Firewalls',
    attacks: 'IP Spoofing, Smurf Attack, ICMP Floods, Routing Hijacks',
    eli5: 'The GPS and international postal routing. Uses global IP addresses to find the shortest path across multiple cities and continents.',
  },
  {
    num: 2,
    name: 'Data Link',
    pdu: 'Frame',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    bgBadge: 'bg-amber-950/60 border-amber-800 text-amber-300',
    protocols: 'Ethernet II (IEEE 802.3), Wi-Fi (802.11), ARP, VLANs (802.1Q)',
    devices: 'Network Switches, Wireless Access Points, Network Cards (NIC)',
    attacks: 'ARP Poisoning, MAC Flooding, VLAN Hopping, CAM Exhaustion',
    eli5: 'Local neighborhood delivery. Uses physical hardware MAC addresses to move data between devices plugged into the exact same switch or Wi-Fi router.',
  },
  {
    num: 1,
    name: 'Physical',
    pdu: 'Bits',
    color: 'from-rose-500 to-red-500',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    bgBadge: 'bg-rose-950/60 border-rose-800 text-rose-300',
    protocols: '1000BASE-T, Cat6 Copper, Fiber (Single/Multi-Mode), Radio (RF)',
    devices: 'Network Cables, Fiber Transceivers, Hubs, Repeaters, Antennas',
    attacks: 'Physical Wiretapping, Cable Slicing, Radio RF Jamming, Rogue Taps',
    eli5: 'The physical medium itself. Electrical voltage pulses over copper, flashes of laser light through glass fibers, or invisible radio frequencies in the air.',
  },
];

// TCP/IP 4-Layer Architecture mapping
const TCPIP_LAYERS = [
  {
    num: 4,
    name: 'Application Layer',
    mapsToOsi: 'OSI Layers 7, 6, & 5 (Application, Presentation, Session)',
    pdu: 'Data / Messages',
    color: 'from-cyan-500 to-purple-500',
    protocols: 'HTTP/HTTPS, DNS, SSH, TLS, SMTP, FTP, DHCP',
    summary:
      'Combines application logic, encryption/encoding, and session state into a single unified software process managed directly by programs and user agents.',
  },
  {
    num: 3,
    name: 'Transport Layer',
    mapsToOsi: 'OSI Layer 4 (Transport)',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    color: 'from-emerald-500 to-teal-500',
    protocols: 'TCP, UDP, SCTP, QUIC',
    summary:
      'Provides host-to-host communication, port-level multiplexing (e.g., port 443 vs 22), flow control, error checking, and retransmission.',
  },
  {
    num: 2,
    name: 'Internet Layer',
    mapsToOsi: 'OSI Layer 3 (Network)',
    pdu: 'Packet / Datagram',
    color: 'from-purple-500 to-pink-500',
    protocols: 'IPv4, IPv6, ICMP, ARP, IPsec',
    summary:
      'Packages data into standardized IP datagrams and routes them across distinct heterogeneous networks using global logical IP addressing.',
  },
  {
    num: 1,
    name: 'Network Access / Link Layer',
    mapsToOsi: 'OSI Layers 2 & 1 (Data Link & Physical)',
    pdu: 'Frames & Physical Bits',
    color: 'from-amber-500 to-rose-500',
    protocols: 'Ethernet, Wi-Fi (802.11), Fiber Optic, DOCSIS, ARP',
    summary:
      'Encompasses hardware drivers, MAC addressing on local links, and the physical transmission of binary bits over cables or radio frequencies.',
  },
];

export function PacketFlowAnimation() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [modelMode, setModelMode] = useState<ModelMode>('osi');
  const [selectedLayerInfo, setSelectedLayerInfo] = useState<number | null>(7);
  const [showInspectorModal, setShowInspectorModal] = useState<boolean>(false);

  const stepData = FLOW_STEPS[currentStep];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const delay = (2400 / speed);
      timer = setTimeout(() => {
        if (currentStep < FLOW_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  const handleNext = () => {
    if (currentStep < FLOW_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (currentStep === FLOW_STEPS.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToPhase = (phaseId: number) => {
    const targetIndex = FLOW_STEPS.findIndex((s) => s.phaseId === phaseId);
    if (targetIndex !== -1) {
      setCurrentStep(targetIndex);
      setIsPlaying(false);
    }
  };

  // Helper to determine layer active state in Client or Server stacks
  const isLayerActiveInClient = (layerNum: number) => {
    if (stepData.activeEntity === 'client') {
      return stepData.activeLayerOsi === layerNum;
    }
    return false;
  };

  const isLayerActiveInServer = (layerNum: number) => {
    if (stepData.activeEntity === 'server') {
      return stepData.activeLayerOsi === layerNum;
    }
    return false;
  };

  const activeLayerObj = OSI_LAYERS.find((l) => l.num === (selectedLayerInfo || 7));

  return (
    <div className="rounded-3xl bg-[#070b14] border border-slate-800 shadow-2xl overflow-hidden space-y-6">
      {/* ── TOP CONTROL BAR & TITLE ────────────────────────────────────────── */}
      <div className="p-6 bg-[#0a0f1e] border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/90 border border-cyan-800 text-cyan-300">
              <Zap className="w-3 h-3 text-cyan-400" />
              INTERACTIVE 2-WAY SIMULATION
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Client ⇄ Server Round-Trip
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            OSI & TCP/IP Bidirectional Packet Flow
          </h2>
          <p className="text-xs text-slate-400">
            Watch live encapsulation (Client → Server) and reverse decapsulation/response (Server → Client).
          </p>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Model Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setModelMode('osi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                modelMode === 'osi'
                  ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OSI (7 Layers)
            </button>
            <button
              onClick={() => setModelMode('tcpip')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                modelMode === 'tcpip'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TCP/IP (4 Layers)
            </button>
            <button
              onClick={() => setModelMode('mapping')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                modelMode === 'mapping'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side Map
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="px-2 text-[10px] text-slate-400">Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                  speed === s ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Play/Pause/Prev/Next Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-all"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" /> Pause
                </>
              ) : currentStep === FLOW_STEPS.length - 1 ? (
                <>
                  <RotateCcw className="w-4 h-4" /> Replay
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Play Flow
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === FLOW_STEPS.length - 1}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-all"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Reset Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PHASE PROGRESS STEPPER ─────────────────────────────────────────── */}
      <div className="px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 1, label: '1. Client Encapsulate', sub: 'L7 → L1 Wrapping' },
            { id: 2, label: '2. Wire Transit', sub: 'Client → Server' },
            { id: 3, label: '3. Server Decapsulate', sub: 'L1 → L7 Unwrap' },
            { id: 4, label: '4. Server Respond', sub: 'L7 → L1 Wrapping' },
            { id: 5, label: '5. Return Transit', sub: 'Server → Client' },
            { id: 6, label: '6. Client Render', sub: 'L1 → L7 Unwrap & Display' },
          ].map((phase) => {
            const isCurrentPhase = stepData.phaseId === phase.id;
            const isCompletedPhase = stepData.phaseId > phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => jumpToPhase(phase.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrentPhase
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_12px_-2px_rgba(6,182,212,0.4)]'
                    : isCompletedPhase
                    ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    : 'bg-[#090d18] border-slate-800/80 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      isCurrentPhase ? 'text-cyan-400' : isCompletedPhase ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {phase.label}
                  </span>
                  {isCompletedPhase && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isCurrentPhase && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <div className="text-[9px] font-mono text-slate-400 truncate">{phase.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN INTERACTIVE STAGE: CLIENT ↔ WIRE ↔ SERVER ─────────────────── */}
      <div className="px-6">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800/90 relative overflow-hidden">
          {/* Transit Direction Notification Banner */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Current Phase:</span>
              <span className="text-cyan-300 font-bold">{stepData.phaseTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">PDU State:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold">
                {stepData.pduName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Step:</span>
              <span className="text-white font-bold">{currentStep + 1}</span>
              <span>of</span>
              <span className="text-slate-400">{FLOW_STEPS.length}</span>
            </div>
          </div>

          {/* 3-Column Visual Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* ── CLIENT SYSTEM (Left 4 cols) ── */}
            <div className="lg:col-span-4 rounded-2xl bg-[#070a14] border border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      Client Workstation
                      {stepData.activeEntity === 'client' && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </h3>
                    <div className="text-[10px] font-mono text-slate-400">IP: 192.168.1.50 : 54321</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  MAC: 00:1A:2B:3C:4D:5E
                </span>
              </div>

              {/* Stack View on Client */}
              <div className="space-y-1.5">
                {modelMode === 'osi' ? (
                  OSI_LAYERS.map((layer) => {
                    const isActive = isLayerActiveInClient(layer.num);
                    return (
                      <div
                        key={layer.num}
                        onClick={() => setSelectedLayerInfo(layer.num)}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] scale-[1.02]'
                            : 'bg-slate-900/40 border-slate-800/70 opacity-60 hover:opacity-100 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] text-white bg-gradient-to-br ${layer.color}`}
                          >
                            L{layer.num}
                          </span>
                          <div>
                            <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                              {layer.name}
                            </span>
                            <span className="text-[9px] text-slate-400 ml-1.5 font-mono">({layer.pdu})</span>
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-mono font-bold text-cyan-400 animate-pulse flex items-center gap-1">
                            ACTIVE <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : modelMode === 'tcpip' ? (
                  TCPIP_LAYERS.map((layer) => {
                    const isTcpIpActive =
                      stepData.activeEntity === 'client' && stepData.activeLayerTcpIp === layer.num;
                    return (
                      <div
                        key={layer.num}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                          isTcpIpActive
                            ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)] scale-[1.02]'
                            : 'bg-slate-900/40 border-slate-800/70 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-[10px] text-white bg-gradient-to-br ${layer.color}`}
                          >
                            T{layer.num}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{layer.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{layer.pdu}</div>
                          </div>
                        </div>
                        {isTcpIpActive && (
                          <span className="text-[10px] font-mono font-bold text-purple-400 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Mapping view */
                  <div className="p-3 bg-slate-950/60 rounded-xl text-xs space-y-2 border border-slate-800">
                    <div className="text-[11px] font-bold text-cyan-400">Client Stack Active</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      L7 (HTTP GET) encapsulates through L4 TCP (Port 54321), L3 IP (192.168.1.50), and L2 Ethernet (MAC).
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── THE WIRE & TRANSIT MEDIUM (Center 4 cols) ── */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-5 px-2 py-4">
              {/* Traffic Flow Directional Header */}
              <div className="w-full text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
                  {stepData.direction === 'forward' || stepData.direction === 'transit-forward' ? (
                    <>
                      <span className="text-cyan-400 font-bold">Client ➔ Server</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                      <span className="text-slate-400">(Request)</span>
                    </>
                  ) : stepData.direction === 'backward' || stepData.direction === 'transit-backward' ? (
                    <>
                      <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-400 font-bold">Server ➔ Client</span>
                      <span className="text-slate-400">(Response)</span>
                    </>
                  ) : (
                    <span className="text-slate-400">Processing Round-Trip</span>
                  )}
                </div>
              </div>

              {/* Physical Cable / Fiber Transit Animation */}
              <div className="w-full relative py-6">
                {/* Physical Cable Bar */}
                <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-700/80 overflow-hidden relative shadow-inner">
                  {/* Glowing pulses */}
                  <div
                    className={`absolute top-0 bottom-0 transition-all duration-700 ${
                      stepData.activeEntity === 'wire'
                        ? 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 shadow-[0_0_20px_#06b6d4]'
                        : 'bg-slate-800/40'
                    }`}
                    style={{
                      left: stepData.direction === 'transit-backward' ? '0%' : '0%',
                      width: stepData.activeEntity === 'wire' ? '100%' : '15%',
                    }}
                  />
                </div>

                {/* Animated Moving Packet Node in Transit */}
                {stepData.activeEntity === 'wire' && (
                  <div
                    className={`absolute top-0 transform -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] font-mono shadow-[0_0_15px_#10b981] flex items-center gap-1.5 animate-pulse ${
                      stepData.direction === 'transit-forward' ? 'right-1/4' : 'left-1/4'
                    }`}
                  >
                    <Radio className="w-3 h-3 animate-spin" />
                    {stepData.direction === 'transit-forward' ? 'PACKET ➔ SERVER' : 'REPLY ➔ CLIENT'}
                  </div>
                )}

                {/* Router Node in the Middle */}
                <div className="flex flex-col items-center mt-4">
                  <div
                    className={`p-3 rounded-2xl border transition-all ${
                      stepData.activeEntity === 'wire'
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)] scale-110'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <Network className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-[10px] font-mono text-white font-bold mt-1">Default Gateway Router</div>
                  <div className="text-[9px] font-mono text-slate-400">L3 Routing • TTL Decrement (64➔63)</div>
                  <div className="text-[8px] font-mono text-slate-400">L2 MAC Frame Rewritten</div>
                </div>
              </div>

              {/* Bitstream visualization */}
              <div className="w-full bg-[#050811] p-2.5 rounded-xl border border-slate-800/80 font-mono text-[10px] text-center text-slate-400 space-y-1">
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Physical Medium Signals</div>
                <div className="text-cyan-400 font-bold tracking-widest overflow-hidden text-ellipsis whitespace-nowrap animate-pulse">
                  {stepData.activeLayerOsi === 1 || stepData.activeEntity === 'wire'
                    ? '01101000 01110100 01110100 01110000 00111010 00101111'
                    : '•••• •••• •••• •••• •••• •••• •••• ••••'}
                </div>
              </div>
            </div>

            {/* ── SERVER SYSTEM (Right 4 cols) ── */}
            <div className="lg:col-span-4 rounded-2xl bg-[#070a14] border border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      Target Web Server
                      {stepData.activeEntity === 'server' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </h3>
                    <div className="text-[10px] font-mono text-slate-400">IP: 93.184.216.34 : 443</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  MAC: AA:BB:CC:DD:EE:01
                </span>
              </div>

              {/* Stack View on Server */}
              <div className="space-y-1.5">
                {modelMode === 'osi' ? (
                  OSI_LAYERS.map((layer) => {
                    const isActive = isLayerActiveInServer(layer.num);
                    return (
                      <div
                        key={layer.num}
                        onClick={() => setSelectedLayerInfo(layer.num)}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] scale-[1.02]'
                            : 'bg-slate-900/40 border-slate-800/70 opacity-60 hover:opacity-100 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] text-white bg-gradient-to-br ${layer.color}`}
                          >
                            L{layer.num}
                          </span>
                          <div>
                            <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                              {layer.name}
                            </span>
                            <span className="text-[9px] text-slate-400 ml-1.5 font-mono">({layer.pdu})</span>
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : modelMode === 'tcpip' ? (
                  TCPIP_LAYERS.map((layer) => {
                    const isTcpIpActive =
                      stepData.activeEntity === 'server' && stepData.activeLayerTcpIp === layer.num;
                    return (
                      <div
                        key={layer.num}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                          isTcpIpActive
                            ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] scale-[1.02]'
                            : 'bg-slate-900/40 border-slate-800/70 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-[10px] text-white bg-gradient-to-br ${layer.color}`}
                          >
                            T{layer.num}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{layer.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{layer.pdu}</div>
                          </div>
                        </div>
                        {isTcpIpActive && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Mapping view */
                  <div className="p-3 bg-slate-950/60 rounded-xl text-xs space-y-2 border border-slate-800">
                    <div className="text-[11px] font-bold text-emerald-400">Server Stack Active</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      Server decapsulates L2 (MAC) ➔ L3 (IP) ➔ L4 (Port 443) ➔ L7 Web Daemon, then reverses the process to send HTTP 200 OK!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE PACKET ASSEMBLY DISSECTOR (Header Stripping & Adding) ────── */}
      <div className="px-6">
        <div className="p-5 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Live Frame & Packet Header Dissector
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Headers expand as data moves down; strip as data moves up
            </span>
          </div>

          {/* Visual Packet Frame Container */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-1.5 py-3 overflow-x-auto min-h-[90px]">
            {/* L2 Ethernet Header */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-center items-center transition-all duration-500 ${
                stepData.headers.ethernet
                  ? 'bg-amber-950/40 border-amber-500/80 text-amber-300 w-full sm:w-44 opacity-100 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900/20 border-dashed border-slate-800 text-slate-600 w-full sm:w-28 opacity-40'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Layer 2 Header
              </div>
              <div className="text-xs font-bold text-white">Ethernet II (14B)</div>
              {stepData.headers.ethernet && (
                <div className="text-[9px] font-mono text-amber-400 mt-1 text-center truncate max-w-full">
                  Dst: {stepData.headerDetails.dstMac}
                </div>
              )}
            </div>

            {/* L3 IP Header */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-center items-center transition-all duration-500 ${
                stepData.headers.ip
                  ? 'bg-purple-950/40 border-purple-500/80 text-purple-300 w-full sm:w-44 opacity-100 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-900/20 border-dashed border-slate-800 text-slate-600 w-full sm:w-28 opacity-40'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Layer 3 Header
              </div>
              <div className="text-xs font-bold text-white">IPv4 (20B)</div>
              {stepData.headers.ip && (
                <div className="text-[9px] font-mono text-purple-400 mt-1 text-center truncate max-w-full">
                  {stepData.headerDetails.srcIp} ➔ {stepData.headerDetails.dstIp}
                </div>
              )}
            </div>

            {/* L4 TCP Header */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-center items-center transition-all duration-500 ${
                stepData.headers.tcp
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 w-full sm:w-44 opacity-100 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/20 border-dashed border-slate-800 text-slate-600 w-full sm:w-28 opacity-40'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Layer 4 Header
              </div>
              <div className="text-xs font-bold text-white">TCP (20B)</div>
              {stepData.headers.tcp && (
                <div className="text-[9px] font-mono text-emerald-400 mt-1 text-center truncate max-w-full">
                  Port: {stepData.headerDetails.srcPort} ➔ {stepData.headerDetails.dstPort}
                </div>
              )}
            </div>

            {/* L7 Application Payload Data */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-center items-center flex-1 transition-all duration-500 ${
                stepData.headers.data
                  ? 'bg-cyan-950/50 border-cyan-500/90 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/30 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Layer 7 Payload (DATA)
              </div>
              <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {stepData.headerDetails.payloadText}
              </div>
            </div>

            {/* L2 FCS Trailer */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-center items-center transition-all duration-500 ${
                stepData.headers.fcs
                  ? 'bg-amber-950/40 border-amber-500/80 text-amber-300 w-full sm:w-32 opacity-100'
                  : 'bg-slate-900/20 border-dashed border-slate-800 text-slate-600 w-full sm:w-24 opacity-40'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider">
                L2 Trailer
              </div>
              <div className="text-xs font-bold text-white">FCS (4B)</div>
              {stepData.headers.fcs && (
                <div className="text-[9px] font-mono text-amber-400 mt-1 text-center truncate">
                  CRC-32 Check
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── NARRATIVE & EDUCATIONAL EXPLAINER BOX ────────────────────────────── */}
      <div className="px-6 pb-6">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Detailed Analysis
              </span>
              <h3 className="text-lg font-bold text-white">{stepData.stepTitle}</h3>
            </div>
            <button
              onClick={() => setShowInspectorModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all font-mono"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Examine All 7 Layers Guide
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{stepData.whatHappens}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Beginner Analogy */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wide">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Real-World Beginner Analogy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{stepData.analogy}</p>
            </div>

            {/* Security Insight */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wide">
                <Shield className="w-4 h-4 text-purple-400" />
                Cyber Security & Defense Angle
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{stepData.securityInsight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE OSI vs TCP/IP DIRECT MAPPING (Rendered when toggled) ── */}
      {modelMode === 'mapping' && (
        <div className="p-6 bg-[#060a14] border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-emerald-400" />
                Direct Comparison: OSI 7-Layer vs. TCP/IP 4-Layer Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Understand how the theoretical ISO/OSI model maps to the real-world pragmatic Internet protocol stack.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-4">OSI Layer</th>
                  <th className="py-3 px-4">TCP/IP Equivalent</th>
                  <th className="py-3 px-4">PDU (Data Unit)</th>
                  <th className="py-3 px-4">Primary Protocols</th>
                  <th className="py-3 px-4">Hardware / Devices</th>
                  <th className="py-3 px-4">Key Cyber Attacks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {/* L7 Application */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-cyan-400">Layer 7: Application</td>
                  <td rowSpan={3} className="py-3 px-4 font-bold text-purple-400 bg-purple-950/20 border-r border-slate-800 align-middle">
                    Application Layer (T4)
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">Combines App, Presentation & Session</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">Data</td>
                  <td className="py-3 px-4 text-slate-300">HTTP, HTTPS, DNS, SSH, FTP, BGP</td>
                  <td className="py-3 px-4 text-slate-400">WAF, Proxies, L7 Gateways</td>
                  <td className="py-3 px-4 text-rose-400">SQLi, XSS, HTTP Floods, SSRF</td>
                </tr>
                {/* L6 Presentation */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-blue-400">Layer 6: Presentation</td>
                  <td className="py-3 px-4 font-mono text-slate-300">Data</td>
                  <td className="py-3 px-4 text-slate-300">TLS, SSL, JPEG, ASCII, UTF-8</td>
                  <td className="py-3 px-4 text-slate-400">TLS Terminators, OS Crypto API</td>
                  <td className="py-3 px-4 text-rose-400">Cipher Downgrade, SSL Stripping</td>
                </tr>
                {/* L5 Session */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-indigo-400">Layer 5: Session</td>
                  <td className="py-3 px-4 font-mono text-slate-300">Data</td>
                  <td className="py-3 px-4 text-slate-300">RPC, NetBIOS, Sockets, Session API</td>
                  <td className="py-3 px-4 text-slate-400">OS Sockets, Session Managers</td>
                  <td className="py-3 px-4 text-rose-400">Session Hijacking, Replay Attacks</td>
                </tr>
                {/* L4 Transport */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-emerald-400">Layer 4: Transport</td>
                  <td className="py-3 px-4 font-bold text-emerald-400 bg-emerald-950/20 border-r border-slate-800">
                    Transport Layer (T3)
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-300">Segment (TCP) / Datagram (UDP)</td>
                  <td className="py-3 px-4 text-slate-300">TCP, UDP, QUIC, SCTP</td>
                  <td className="py-3 px-4 text-slate-400">Stateful Firewalls, Load Balancers</td>
                  <td className="py-3 px-4 text-rose-400">SYN Flood, Port Scanning, UDP Spoof</td>
                </tr>
                {/* L3 Network */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-purple-400">Layer 3: Network</td>
                  <td className="py-3 px-4 font-bold text-purple-400 bg-purple-950/20 border-r border-slate-800">
                    Internet Layer (T2)
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-300">Packet</td>
                  <td className="py-3 px-4 text-slate-300">IPv4, IPv6, ICMP, IPsec, OSPF</td>
                  <td className="py-3 px-4 text-slate-400">Routers, L3 Switches</td>
                  <td className="py-3 px-4 text-rose-400">IP Spoofing, Smurf Attack, Ping Flood</td>
                </tr>
                {/* L2 Data Link */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-amber-400">Layer 2: Data Link</td>
                  <td rowSpan={2} className="py-3 px-4 font-bold text-amber-400 bg-amber-950/20 border-r border-slate-800 align-middle">
                    Network Access / Link Layer (T1)
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">Combines MAC framing & Physical Bits</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">Frame</td>
                  <td className="py-3 px-4 text-slate-300">Ethernet, Wi-Fi (802.11), ARP, VLANs</td>
                  <td className="py-3 px-4 text-slate-400">Switches, Bridges, Access Points, NICs</td>
                  <td className="py-3 px-4 text-rose-400">ARP Poisoning, MAC Flooding, VLAN Hop</td>
                </tr>
                {/* L1 Physical */}
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-rose-400">Layer 1: Physical</td>
                  <td className="py-3 px-4 font-mono text-rose-300">Bits (0s & 1s)</td>
                  <td className="py-3 px-4 text-slate-300">1000BASE-T, Cat6, Fiber Optics, RF</td>
                  <td className="py-3 px-4 text-slate-400">Cables, Fiber, Hubs, Repeaters</td>
                  <td className="py-3 px-4 text-rose-400">Cable Tapping, Radio Jamming</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LAYER DEEP DIVE MODAL / DRAWER ─────────────────────────────────── */}
      {showInspectorModal && activeLayerObj && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090e1c] border border-slate-700 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm text-white bg-gradient-to-br ${activeLayerObj.color} shadow-lg`}
                >
                  L{activeLayerObj.num}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Layer {activeLayerObj.num}: {activeLayerObj.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400">
                    Protocol Data Unit (PDU): {activeLayerObj.pdu}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInspectorModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            {/* Quick Layer Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {OSI_LAYERS.map((l) => (
                <button
                  key={l.num}
                  onClick={() => setSelectedLayerInfo(l.num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedLayerInfo === l.num
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  L{l.num} {l.name}
                </button>
              ))}
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
                <div className="font-bold text-cyan-300 uppercase tracking-wide">
                  💡 Plain-English Analogy (ELI5)
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">{activeLayerObj.eli5}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-400 uppercase tracking-wide">Common Protocols</div>
                  <div className="text-white font-mono">{activeLayerObj.protocols}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-400 uppercase tracking-wide">Network Devices</div>
                  <div className="text-white font-mono">{activeLayerObj.devices}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                <div className="font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rose-400" />
                  Security Vulnerabilities & Attacks at Layer {activeLayerObj.num}
                </div>
                <p className="text-slate-300 leading-relaxed">{activeLayerObj.attacks}</p>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowInspectorModal(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Back to Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
