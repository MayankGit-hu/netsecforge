import { CurriculumTopic } from '@/types';

export const CURRICULUM_TIERS = [
  {
    id: 'tier-0',
    number: '0',
    title: 'Tier 0: Networking & Systems Foundations',
    subtitle: 'Zero to Solid Base',
    color: '#06b6d4',
    bgBorder: 'border-cyan-500/30',
    description: 'Master bit-level frame encapsulation, core OSI/TCP layers, routing, switching, and essential Linux networking CLI tools.',
    badge: 'Foundations',
    topicCount: 5,
  },
  {
    id: 'tier-1',
    number: '1',
    title: 'Tier 1: Core Network Security & Cryptography',
    subtitle: 'Perimeter & Crypto Defense',
    color: '#10b981',
    bgBorder: 'border-emerald-500/30',
    description: 'Deep dive into stateful packet inspection, NAT mechanics, PKI/TLS 1.3 handshakes, IPsec tunnels, and IDS/IPS signature engineering.',
    badge: 'Core Defense',
    topicCount: 4,
  },
  {
    id: 'tier-2',
    number: '2',
    title: 'Tier 2: Enterprise NGFW & Zero Trust Architecture',
    subtitle: 'Enterprise Scale & Modern Edge',
    color: '#8b5cf6',
    bgBorder: 'border-purple-500/30',
    description: 'Deploy Next-Gen Firewalls (Palo Alto, Fortinet, Check Point), NSPM orchestration (AlgoSec), SASE/ZTNA, and 802.1X NAC.',
    badge: 'Enterprise Architecture',
    topicCount: 4,
  },
  {
    id: 'tier-3',
    number: '3',
    title: 'Tier 3: SOC Operations, SIEM/SOAR & Cloud Security',
    subtitle: 'Telemetry, Hunting & Cloud VPCs',
    color: '#f59e0b',
    bgBorder: 'border-amber-500/30',
    description: 'Ingest NetFlow/Zeek telemetry, craft Splunk SPL and Sentinel KQL correlation rules, execute SOAR playbooks, and secure AWS/Azure VPCs.',
    badge: 'SecOps & Cloud',
    topicCount: 4,
  },
  {
    id: 'tier-4',
    number: '4',
    title: 'Tier 4: Offensive Auditing, Deep Forensics & DevSecOps',
    subtitle: 'Expert Mastery & Red/Purple Operations',
    color: '#f43f5e',
    bgBorder: 'border-rose-500/30',
    description: 'Dissect malformed packet exploits, conduct internal pivoting with SSH/SOCKS, and enforce Policy-as-Code with Terraform and OPA Rego.',
    badge: 'Offensive & DevSecOps',
    topicCount: 3,
  },
] as const;

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  // ─── TIER 0 ────────────────────────────────────────────────────────────────
  {
    id: 'osi-tcpip-model',
    slug: 'osi-vs-tcpip-encapsulation',
    tierId: 'tier-0',
    tierName: 'Tier 0: Networking & Systems Foundations',
    title: 'OSI vs. TCP/IP Models & Frame Encapsulation',
    category: 'Architecture & Foundations',
    summary: 'Bit-level analysis of Ethernet II frames, IPv4/IPv6 headers, TCP/UDP transport segments, and encapsulation mechanics.',
    estimatedMinutes: 45,
    difficulty: 'Beginner',
    prerequisites: [],
    certAlignments: ['CompTIA Network+ (N10-008)', 'CompTIA Security+ (SY0-701)', 'Cisco CCNA (200-301)'],
    rfcs: [
      { number: 'RFC 791', title: 'Internet Protocol (IPv4)', url: 'https://datatracker.ietf.org/doc/html/rfc791' },
      { number: 'RFC 793', title: 'Transmission Control Protocol (TCP)', url: 'https://datatracker.ietf.org/doc/html/rfc793' },
    ],

    beginner: {
      whatIsIt: `Imagine the internet is like an international postal system. When you send a letter, it doesn't just magically appear — it goes into an envelope, which goes into a postal bag, which goes onto a truck, which goes onto a plane. Each "wrapper" adds address info and routing details. The OSI and TCP/IP models describe exactly this wrapping (called encapsulation) for network data.`,
      whyItMatters: `Every security tool — firewalls, intrusion detection systems, packet captures — works by reading these wrappers. If you don't know what each layer does, you can't understand why traffic is blocked, why an attack worked, or how to defend against it.`,
      realWorldAnalogy: `Think of sending a birthday gift internationally: You wrap the gift (data), put it in a box (TCP segment), write the postal address (IP packet), hand it to a courier (Ethernet frame). At every step, a new "label" is added. When it arrives, each label is peeled off in reverse order.`,
      commonMisconception: `People think packets travel as one whole unit from source to destination. In reality, each router along the path strips the Ethernet frame, reads the IP address, and re-wraps it in a new frame before forwarding it.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Client Application creates data (L7-L5)',
        description: 'Your browser wants to load "https://example.com". It creates an HTTP GET request ("GET /index.html") and negotiates TLS encryption.',
        detail: 'In OSI, this spans Layers 7 (Application), 6 (Presentation - TLS encryption), and 5 (Session). In TCP/IP, this is unified in the Application Layer.',
        tip: 'PDU at this stage is called pure "Data" or "Message".',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Transport layer attaches TCP ports (L4)',
        description: 'TCP adds a header with a random client Source Port (e.g. 54321) and the target Destination Port (443 for HTTPS web traffic).',
        detail: 'Ports are like apartment numbers inside a building. Sequence numbers are assigned for reliable ordering.',
        tip: 'Well-known ports: 80=HTTP, 443=HTTPS, 22=SSH, 53=DNS. The PDU is now a "Segment".',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Network layer adds IP addresses (L3)',
        description: 'IP wraps the segment with Source IP (192.168.1.50) and Destination IP (93.184.216.34), plus a TTL of 64.',
        detail: 'The IP header enables global internet routing across different networks and autonomous systems.',
        tip: 'The PDU is now a "Packet". Routers use this layer to determine the best path.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Data Link layer adds MAC addresses & FCS (L2)',
        description: 'Ethernet wraps the packet with your NIC\'s Source MAC and your Default Gateway Router\'s Destination MAC, plus a CRC-32 FCS trailer.',
        detail: 'MAC addresses are physical local hardware identifiers. The FCS trailer lets the receiver verify zero bit errors.',
        tip: 'The PDU is now a "Frame". MAC addresses are local and rewritten at every router hop.',
        color: '#f59e0b',
      },
      {
        step: 5,
        title: 'Physical layer converts to bits & transmits (L1)',
        description: 'Your Network Interface Card (NIC) converts binary 1s and 0s into voltage pulses (copper), laser light (fiber), or radio waves (Wi-Fi).',
        detail: 'Data travels across physical medium, switches, and WAN internet routers towards the server.',
        tip: 'The PDU is now "Bits". This is the only physical layer in the model.',
        color: '#f43f5e',
      },
      {
        step: 6,
        title: 'Server receives & decapsulates bottom-up (L1 ➔ L7)',
        description: 'Server NIC receives bits → checks FCS trailer & strips MAC header (L2) → verifies destination IP & strips IP header (L3) → delivers to Port 443 & strips TCP header (L4).',
        detail: 'Decapsulation is encapsulation in exact reverse. The web server daemon (NGINX) receives the clean HTTP GET request.',
        tip: 'If the CRC checksum in FCS fails at Layer 2, the frame is immediately dropped!',
        color: '#06b6d4',
      },
      {
        step: 7,
        title: 'Server encapsulates HTTP 200 OK Response (Vice Versa!)',
        description: 'The server processes the request and prepares the response: "HTTP/1.1 200 OK" with webpage HTML. It then encapsulates down the stack with inverted addresses!',
        detail: 'Ports swap: Source Port 443 ➔ Destination Port 54321. IPs swap: Source IP 93.184.216.34 ➔ Destination IP 192.168.1.50.',
        tip: 'Stateful firewalls recognize this as returning established traffic and permit it through.',
        color: '#10b981',
      },
      {
        step: 8,
        title: 'Client decapsulates response & renders webpage',
        description: 'Response travels back over the wire to your laptop. Client NIC unwraps L2, L3, L4, and hands clean HTTP 200 OK data to the browser, which renders the webpage!',
        detail: 'The bidirectional round-trip communication cycle is now complete!',
        tip: 'Full lifecycle: Request Encapsulation ➔ Wire ➔ Server Decapsulation ➔ Response Encapsulation ➔ Wire ➔ Client Decapsulation.',
        color: '#ec4899',
      },
    ],

    realWorldExamples: [
      {
        title: 'Loading a Secure Webpage (HTTPS GET & 200 OK)',
        scenario: 'You type "https://example.com" in Chrome and hit Enter',
        howItApplies: 'Browser (App L7) wraps HTTP GET → TCP adds port 443 (Transport L4) → IP adds source and destination IPs (Network L3) → Ethernet adds MAC addresses & FCS (Data Link L2) → Wi-Fi radio waves (Physical L1). At the server, all wrappers peel off in reverse. The server crafts a "200 OK" response, inverts ports & IPs, wraps it back down to bits, and sends it back to your laptop to render the website!',
        emoji: '🌐',
      },
      {
        title: 'Why Ping Shows "TTL Expired in Transit"',
        scenario: 'You ping an IP address and get "TTL expired in transit" error',
        howItApplies: 'The IP packet (Layer 3) has a Time-To-Live counter. Every router decrements TTL by 1. If routing loops occur or distance exceeds TTL, it hits 0 and the router drops it, returning an ICMP Time Exceeded packet back to you. This exact mechanism is how traceroute maps every router hop!',
        emoji: '📡',
      },
      {
        title: 'Stateful Firewalls & Reverse Traffic',
        scenario: 'Your home router allows the server\'s response without opening inbound port 54321',
        howItApplies: 'When your browser sends an outbound TCP segment from port 54321 to port 443, the stateful firewall records the connection (Src IP, Dst IP, Src Port, Dst Port) in its state table. When the server responds with ports and IPs inverted, the firewall matches the state table entry and automatically permits it back into your local machine.',
        emoji: '🛡️',
      },
    ],

    flowDiagram: {
      title: 'Bidirectional Packet Flow (Client ⇄ Server Lifecycle)',
      description: 'Data wraps down on the sender (encapsulation), traverses the wire, unwraps up on the receiver (decapsulation), then repeats in reverse for the response.',
      layout: 'vertical',
      nodes: [
        { id: 'client_app',   label: '1. Client HTTP GET (L7)',     sublabel: 'Browser generates Data payload',  type: 'start',   color: '#06b6d4' },
        { id: 'client_tcp',   label: '2. TCP Segment (L4)',          sublabel: '+ Source 54321 / Dest 443 Ports', type: 'process', color: '#10b981' },
        { id: 'client_ip',    label: '3. IP Packet (L3)',            sublabel: '+ Client & Server IP Addresses',  type: 'process', color: '#8b5cf6' },
        { id: 'client_eth',   label: '4. Ethernet Frame (L2)',       sublabel: '+ MAC Addresses & FCS CRC-32',    type: 'process', color: '#f59e0b' },
        { id: 'wire',         label: '5. Wire Transit & Router (L1)', sublabel: 'Bits on wire • L2 MAC rewritten',type: 'process', color: '#f43f5e' },
        { id: 'server_decap', label: '6. Server Decapsulation',      sublabel: 'FCS verified ➔ Headers stripped',  type: 'process', color: '#06b6d4' },
        { id: 'server_resp',  label: '7. Server HTTP 200 OK (Resp)', sublabel: 'Re-encapsulated with inverted IPs/Ports', type: 'process', color: '#10b981' },
        { id: 'client_disp',  label: '8. Client Decap & Render',     sublabel: 'Browser parses HTML & renders!',  type: 'end',     color: '#ec4899' },
      ],
      edges: [
        { from: 'client_app',   to: 'client_tcp',   label: 'Encapsulate' },
        { from: 'client_tcp',   to: 'client_ip',    label: 'Wrap IP' },
        { from: 'client_ip',    to: 'client_eth',   label: 'Wrap MAC' },
        { from: 'client_eth',   to: 'wire',         label: 'Transmit Bits' },
        { from: 'wire',         to: 'server_decap', label: 'Unwrap L1-L7' },
        { from: 'server_decap', to: 'server_resp',  label: 'Generate Reply' },
        { from: 'server_resp',  to: 'client_disp',  label: 'Return & Render' },
      ],
    },

    quiz: [
      {
        question: 'At which layer does a router primarily operate when forwarding traffic?',
        options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
        correctIndex: 2,
        explanation: 'Routers operate at Layer 3 (Network). They read the destination IP address in each packet to decide where to forward it, then rewrite the Layer 2 MAC address for the next hop.',
      },
      {
        question: 'What happens to the Ethernet MAC address as a packet travels from your laptop to a server on the internet?',
        options: [
          'It stays the same the entire journey',
          'It is rewritten at every router hop',
          'It is removed after the first router',
          'Only the destination MAC changes',
        ],
        correctIndex: 1,
        explanation: 'MAC addresses are Layer 2 (local network) addresses. Every time a packet crosses a router (Layer 3 boundary), the old Ethernet frame is discarded and a new one is created with updated source/destination MACs for the next network segment.',
      },
      {
        question: 'What is the purpose of the TTL (Time To Live) field in an IP packet?',
        options: [
          'To set an expiry time for the data',
          'To prevent packets from looping forever in the network',
          'To prioritize VoIP traffic over regular traffic',
          'To encrypt the IP header',
        ],
        correctIndex: 1,
        explanation: 'TTL is a counter (typically starting at 64 or 128) that is decremented by 1 at each router hop. When TTL hits 0, the packet is dropped and an ICMP "Time Exceeded" message is sent back to the sender — preventing infinite routing loops.',
      },
      {
        question: 'What is the primary function of the TCP Sliding Window mechanism?',
        options: [
          'To encrypt the packet payload before sending',
          'To allow pipelined transmission of multiple segments and prevent overflowing the receiver buffer',
          'To route packets across different subnets',
          'To dynamically change the IP address during transmission',
        ],
        correctIndex: 1,
        explanation: 'The TCP Sliding Window enables pipelined transmission (sending multiple segments without stopping for each individual ACK) and enforces flow control so a fast sender does not overflow the receiver\'s buffer.',
      },
      {
        question: 'Why is the TCP Window Scale option (RFC 7323) required on modern high-speed networks?',
        options: [
          'Because the standard 16-bit Window Size field caps at 65,535 bytes (64 KB), severely limiting throughput on high-bandwidth links',
          'To support IPv6 addresses inside the TCP header',
          'To enable 256-bit AES encryption in TCP',
          'To replace the 3-way handshake with a 1-way handshake',
        ],
        correctIndex: 0,
        explanation: 'A 16-bit window can only represent up to 65,535 bytes (~64 KB). On high Bandwidth-Delay Product (BDP) links (like 10 Gbps with 50ms latency), a 64 KB window limits speeds to only ~10 Mbps. Window Scale allows multiplying the window by up to 2^14, expanding window capacity up to 1 Gigabyte.',
      },
    ],

    overview: `Network communication relies on strict protocol layering where each tier attaches control metadata (headers/trailers) through encapsulation. The 7-layer OSI conceptual model maps directly into the pragmatic 4-layer TCP/IP stack (Link, Internet, Transport, Application). Understanding byte boundaries and bitfield flags is non-negotiable for security analysts inspecting packets or debugging dropped traffic.`,
    keyConcepts: [
      {
        title: 'Ethernet II Header Structure (14 Bytes / 112 Bits)',
        explanation: 'Destination MAC (48b: includes I/G unicast/multicast bit and U/L universal/local bit) → Source MAC (48b: 24b OUI vendor + 24b serial) → EtherType (16b: 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP) → Payload (46-1500B) → FCS Trailer (32b CRC-32 polynomial error check).',
      },
      {
        title: 'IPv4 Header Bitfield Architecture (20 Bytes / 160 Bits)',
        explanation: 'Version (4b: 0100), IHL (4b: length in 32-bit words, min 5=20B), DSCP (6b: QoS priority), ECN (2b: explicit congestion signaling), Total Length (16b: packet size in bytes), Identification (16b: fragment group ID), Flags (3b: Reserved, DF Don\'t Fragment, MF More Fragments), Fragment Offset (13b: 8-byte units), TTL (8b: hop decrement counter), Protocol (8b: 6=TCP, 17=UDP, 1=ICMP), Header Checksum (16b), Source IP (32b), Destination IP (32b).',
      },
      {
        title: 'TCP Header Bitfield & 9 Control Flags (20 Bytes / 160 Bits)',
        explanation: 'Source/Destination Ports (16b each: 0-65535), Sequence Number (32b: byte-stream offset), Acknowledgment Number (32b: cumulative next byte expected), Data Offset (4b: header length), Reserved (3b: zeroed), 9 Control Flags (NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN), Window Size (16b: receiver flow control buffer), Checksum (16b: over pseudo-header + TCP + payload), Urgent Pointer (16b).',
      },
      {
        title: 'TCP Sliding Window & Flow Control Mechanics',
        explanation: 'Instead of slow Stop-and-Wait, TCP pipelines data. The receiver advertises its available buffer space via the 16-bit Window Size field (rwnd). The sender may transmit up to rwnd bytes into the network without waiting for an individual ACK. As cumulative ACKs arrive, the left edge of the sender\'s window slides forward, opening new transmission credits on the right edge.',
      },
      {
        title: 'Window Scale Option (RFC 7323) & Bandwidth-Delay Product (BDP)',
        explanation: 'Because a 16-bit window caps at 65,535 bytes (64 KB), gigabit links with high round-trip times (BDP = Bandwidth × RTT) would starve. The TCP Window Scale option negotiates a power-of-2 shift multiplier (up to 14 bits), expanding the maximum effective window size up to 1 Gigabyte (1,073,725,440 bytes).',
      },
      {
        title: 'Receiver Window (rwnd) vs. Congestion Window (cwnd)',
        explanation: 'Effective Window = min(rwnd, cwnd). Flow Control (rwnd) prevents the sender from overwhelming a slow receiver application buffer. Congestion Control (cwnd, managed by BBR, Cubic, or Reno) prevents the sender from overwhelming intermediate network switches and routers.',
      },
    ],
    packetStructure: {
      protocol: 'IPv4 Header Structure (RFC 791)',
      description: 'Standard 20-byte base header formatted into 32-bit rows.',
      fields: [
        { name: 'Version (4b) & IHL (4b)', sizeBits: 8, description: 'Version=0100 (4), IHL=0101 (5 words = 20 bytes)', color: '#06b6d4' },
        { name: 'DSCP (6b) & ECN (2b)', sizeBits: 8, description: 'QoS traffic class and congestion signaling', color: '#38bdf8' },
        { name: 'Total Length (16b)', sizeBits: 16, description: 'Total IP datagram size in octets (Header + Payload)', color: '#0284c7' },
        { name: 'Identification (16b)', sizeBits: 16, description: 'Unique fragment grouping ID', color: '#10b981' },
        { name: 'Flags (3b) & Frag Offset (13b)', sizeBits: 16, description: 'Bit 0: Reserved (0), Bit 1: DF (Do not frag), Bit 2: MF (More frags)', color: '#059669' },
        { name: 'Time to Live (TTL)', sizeBits: 8, description: 'Hop limit counter to prevent routing loops', color: '#f59e0b' },
        { name: 'Protocol', sizeBits: 8, description: 'Next header: 6 (TCP), 17 (UDP), 1 (ICMP), 50 (ESP)', color: '#ea580c' },
        { name: 'Header Checksum', sizeBits: 16, description: '16-bit ones complement checksum of IP header only', color: '#ef4444' },
        { name: 'Source IP Address', sizeBits: 32, description: '32-bit originator IPv4 address', color: '#a855f7' },
        { name: 'Destination IP Address', sizeBits: 32, description: '32-bit intended recipient IPv4 address', color: '#9333ea' },
      ],
    },
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Inspecting raw packet encapsulation with tcpdump',
        configSnippet: '# Capture first 5 packets on eth0 with full link-level header and hex dump\ntcpdump -i eth0 -nn -e -XX -c 5 "tcp and port 443"',
        notes: '-e prints the Ethernet frame MAC addresses; -XX prints both hex and ASCII bytes.',
      },
      {
        vendor: 'Cisco',
        context: 'Checking MTU and interface encapsulation',
        configSnippet: 'Router# show interfaces GigabitEthernet 0/0/1\n! MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec\n! Encapsulation ARPA, loopback not set',
        notes: 'Encapsulation ARPA indicates standard Ethernet II encapsulation.',
      },
    ],
    commonPitfalls: [
      'Confusing MTU (Maximum Transmission Unit, typically 1500 bytes Layer 3 payload) with MSS (Maximum Segment Size, typically 1460 bytes TCP payload).',
      'Overlooking PMTUD (Path MTU Discovery) black holes caused by firewalls indiscriminately dropping ICMP Type 3 Code 4 (Fragmentation Needed).',
      'Assuming Layer 2 MAC addresses persist across routers; MAC addresses are rewritten at every Layer 3 hop.',
      'Confusing Flow Control (Receiver Advertised Window rwnd) with Congestion Control (cwnd). Flow control protects the receiving endpoint buffer, while congestion control protects intermediate network routers.',
      'Disabling TCP Window Scale (RFC 7323) on high-speed gigabit or transatlantic links, causing 10 Gbps lines to artificially bottleneck at ~6.5 Mbps due to the legacy 16-bit 64 KB window limit.',
      'Silly Window Syndrome: Applications reading data 1 byte at a time generate 40 bytes of TCP/IP headers for 1 byte of payload (97% overhead). Always rely on Nagle\'s algorithm and Clark\'s solution.',
    ],
    labId: 'packet-dissector-sample-1',
  },

  {
    id: 'core-dns-dhcp-arp',
    slug: 'dns-dhcp-arp-security-mechanisms',
    tierId: 'tier-0',
    tierName: 'Tier 0: Networking & Systems Foundations',
    title: 'Core Protocols: DNS, DHCP, and ARP Security',
    category: 'Core Protocols',
    summary: 'Mechanics and defense of DNSSEC, DHCP DORA with snooping/Option 82, and ARP cache poisoning vulnerabilities.',
    estimatedMinutes: 50,
    difficulty: 'Beginner',
    prerequisites: ['osi-tcpip-model'],
    certAlignments: ['CompTIA Network+', 'CompTIA Security+', 'Cisco CCNA (200-301)'],
    rfcs: [
      { number: 'RFC 1035', title: 'Domain Names - Implementation and Specification', url: 'https://datatracker.ietf.org/doc/html/rfc1035' },
      { number: 'RFC 4033', title: 'DNS Security Introduction and Requirements (DNSSEC)', url: 'https://datatracker.ietf.org/doc/html/rfc4033' },
      { number: 'RFC 2131', title: 'Dynamic Host Configuration Protocol', url: 'https://datatracker.ietf.org/doc/html/rfc2131' },
      { number: 'RFC 826', title: 'Ethernet Address Resolution Protocol (ARP)', url: 'https://datatracker.ietf.org/doc/html/rfc826' },
    ],

    beginner: {
      whatIsIt: `DNS, DHCP, and ARP are three "helper" protocols that make networking automatic and easy — but they were all designed in a time when the internet was a friendly place. None of them originally had any security. Think of them as the unlocked doors of the networking world.`,
      whyItMatters: `Attackers love these protocols because they're trusted by default. An attacker on your network can impersonate a DNS server to redirect you to fake websites, act as a fake DHCP server to hijack all your traffic, or poison ARP tables to eavesdrop on every packet on the LAN.`,
      realWorldAnalogy: `DNS is like a phone book — you look up "google.com" and get "142.250.80.46". DHCP is like a hotel reception desk that gives you a room number (IP) when you check in. ARP is like shouting "Hey, who has room 42?" in the hallway — whoever responds gets trusted immediately.`,
      commonMisconception: `People think HTTPS protects against DNS attacks. It doesn't — if DNS is poisoned to send you to the wrong server, your browser will warn you (certificate mismatch), but many users click through warnings.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'DNS: Looking up a domain name',
        description: 'Your computer asks: "What is the IP address of google.com?" It sends a DNS query to a Resolver (usually provided by your ISP or 8.8.8.8).',
        detail: 'The resolver checks its cache first. If it doesn\'t know, it asks the Root → TLD (.com) → Authoritative server in sequence.',
        tip: 'Try it: run "nslookup google.com" or "dig google.com" in your terminal.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'DNS Attack: Cache Poisoning',
        description: 'An attacker intercepts the DNS query and sends a fake reply with a malicious IP before the real server responds.',
        detail: 'The resolver caches the fake answer. Every user who queries that resolver now goes to the attacker\'s server.',
        tip: 'DNSSEC prevents this by cryptographically signing DNS records.',
        color: '#f43f5e',
      },
      {
        step: 3,
        title: 'DHCP: Getting an IP address automatically',
        description: 'When your laptop connects to WiFi, it broadcasts: "I\'m new here, can anyone give me an IP address?" (DHCP Discover). The router replies with an offer.',
        detail: 'Full process: Discover → Offer → Request → Acknowledge (DORA). The server assigns IP, subnet mask, gateway, and DNS server.',
        tip: 'A rogue DHCP server can give you a fake gateway — routing all your traffic through an attacker.',
        color: '#10b981',
      },
      {
        step: 4,
        title: 'ARP: Finding MAC addresses on the LAN',
        description: 'Your computer has an IP (10.0.0.50) and wants to send data to the router (10.0.0.1). It broadcasts: "Who has 10.0.0.1? Tell me your MAC address."',
        detail: 'ARP has no authentication. Any machine can reply "I have 10.0.0.1 — my MAC is XX:XX:XX:XX:XX:XX" even if it\'s lying.',
        tip: 'This lie is called a Gratuitous ARP (GARP) and is the basis of ARP poisoning attacks.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'DNS Hijacking Attack',
        scenario: 'You\'re on a coffee shop WiFi and try to visit your bank\'s website',
        howItApplies: 'An attacker on the same WiFi runs a rogue DNS server. When your laptop queries "bank.com", the attacker\'s DNS replies with their own server\'s IP. Your browser loads a fake bank page. DNSSEC would have prevented this — the fake record wouldn\'t have a valid cryptographic signature.',
        emoji: '☕',
      },
      {
        title: 'ARP Poisoning / Man-in-the-Middle',
        scenario: 'An attacker is on your LAN and wants to intercept your traffic',
        howItApplies: 'The attacker sends a Gratuitous ARP to your PC: "I am the router (10.0.0.1), my MAC is AA:BB:CC:DD:EE:FF". Your PC updates its ARP table. Now all your traffic flows through the attacker first. Tools like Wireshark will show duplicate ARP replies — a classic detection indicator.',
        emoji: '🕵️',
      },
    ],

    flowDiagram: {
      title: 'DNS Resolution Flow',
      description: 'How your computer finds the IP address for a domain name — from your browser to the authoritative server and back.',
      layout: 'vertical',
      nodes: [
        { id: 'browser', label: 'Your Browser',       sublabel: 'Wants: google.com',           type: 'actor',   color: '#06b6d4' },
        { id: 'cache',   label: 'Local DNS Cache',    sublabel: 'Check OS cache first',         type: 'decision',color: '#f59e0b' },
        { id: 'res',     label: 'DNS Resolver',       sublabel: 'ISP or 8.8.8.8',              type: 'process', color: '#10b981' },
        { id: 'root',    label: 'Root DNS Server',    sublabel: '13 root server clusters',      type: 'process', color: '#8b5cf6' },
        { id: 'tld',     label: 'TLD Server',         sublabel: '.com, .org, .net',             type: 'process', color: '#8b5cf6' },
        { id: 'auth',    label: 'Authoritative NS',   sublabel: 'google.com → 142.250.80.46',  type: 'data',    color: '#10b981' },
        { id: 'reply',   label: 'IP Address Returned',sublabel: '142.250.80.46',               type: 'end',     color: '#06b6d4' },
      ],
      edges: [
        { from: 'browser', to: 'cache',   label: 'Query' },
        { from: 'cache',   to: 'res',     label: 'Cache miss' },
        { from: 'res',     to: 'root',    label: 'Ask root' },
        { from: 'root',    to: 'tld',     label: 'Refer to .com' },
        { from: 'tld',     to: 'auth',    label: 'Refer to NS' },
        { from: 'auth',    to: 'reply',   label: 'A record' },
        { from: 'reply',   to: 'browser', label: 'Answer' },
      ],
    },

    quiz: [
      {
        question: 'What is the correct order of the DHCP process when a device joins a network?',
        options: [
          'Acknowledge → Request → Offer → Discover',
          'Discover → Offer → Request → Acknowledge',
          'Request → Discover → Acknowledge → Offer',
          'Offer → Discover → Request → Acknowledge',
        ],
        correctIndex: 1,
        explanation: 'DHCP uses the DORA process: Discover (client broadcasts looking for a server), Offer (server offers an IP), Request (client requests that IP), Acknowledge (server confirms the assignment).',
      },
      {
        question: 'An attacker sends an unsolicited ARP reply claiming to be the default gateway. What attack is this?',
        options: ['DNS Spoofing', 'DHCP Starvation', 'ARP Cache Poisoning', 'BGP Hijacking'],
        correctIndex: 2,
        explanation: 'This is ARP Cache Poisoning (also called ARP Spoofing). By sending a fake ARP reply (Gratuitous ARP), the attacker tricks devices into updating their ARP cache with the wrong MAC address, routing traffic through the attacker\'s machine.',
      },
      {
        question: 'Which feature on a Cisco switch prevents rogue DHCP servers from operating on untrusted ports?',
        options: ['Port Security', 'DHCP Snooping', 'Dynamic ARP Inspection', 'BPDU Guard'],
        correctIndex: 1,
        explanation: 'DHCP Snooping designates ports as "trusted" (towards legitimate DHCP servers) or "untrusted" (towards clients). DHCP Offer/Ack packets from untrusted ports are dropped, preventing rogue server attacks.',
      },
    ],

    overview: `DNS, DHCP, and ARP form the circulatory system of modern local and wide-area networks. Because they were originally designed without authentication, they represent prime vectors for Man-in-the-Middle (MITM), cache poisoning, rogue DHCP servers, and reconnaissance. Modern secure architectures deploy cryptographic extensions (DNSSEC, DoT/DoH) and switch-enforced security (DHCP Snooping, Dynamic ARP Inspection - DAI).`,
    keyConcepts: [
      {
        title: 'DNS Resolution Chain & DNSSEC Validation',
        explanation: 'Root Servers (.) → TLD Servers (.com) → Authoritative Servers (example.com). DNSSEC signs RRsets using cryptographic records: RRSIG (signature), DNSKEY (public key), DS (Delegation Signer hash in parent zone), and NSEC/NSEC3 (authenticated denial of existence).',
      },
      {
        title: 'DHCP 4-Step DORA Process & Snooping',
        explanation: 'Discover (Client Broadcast) → Offer (Server Unicast/Broadcast) → Request (Client Broadcast) → Acknowledge (Server). DHCP Snooping establishes a trusted/untrusted port boundary on switches and builds a binding database: MAC, IP, Lease, VLAN, Port.',
      },
      {
        title: 'ARP Mechanics & Poisoning (MITM)',
        explanation: 'ARP translates Layer 3 IP to Layer 2 MAC addresses. Stateless design allows Gratuitous ARP (GARP) spoofing where an attacker sends unsolicited ARP replies to poison victim caches. Mitigated via Dynamic ARP Inspection (DAI) cross-referencing the DHCP snooping table.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Cisco',
        context: 'Enabling DHCP Snooping and Dynamic ARP Inspection (DAI)',
        configSnippet: '! Global configuration\nip dhcp snooping\nip dhcp snooping vlan 10,20\nip arp inspection vlan 10,20\n\n! Trust upstream trunk towards legitimate DHCP server\ninterface GigabitEthernet 0/1\n ip dhcp snooping trust\n ip arp inspection trust',
        notes: 'Untrusted access ports will drop unauthorized DHCP offers and spoofed ARP replies.',
      },
      {
        vendor: 'Linux',
        context: 'Inspecting local ARP table and DNS records',
        configSnippet: '# Inspect ARP cache\nip neigh show\n\n# Query DNS record with DNSSEC validation flag\ndig @1.1.1.1 cloudflare.com +dnssec +multiline',
        notes: 'Look for the "ad" (Authenticated Data) flag in the dig header output.',
      },
    ],
    commonPitfalls: [
      'Forgetting to configure "ip arp inspection trust" on inter-switch trunks, resulting in switch-wide traffic blackout.',
      'Treating DoH (DNS over HTTPS) purely as a security upgrade without acknowledging that it bypasses enterprise perimeter DNS filtering and visibility.',
      'Relying solely on static ARP entries which do not scale in enterprise dynamic networks.',
    ],
    labId: 'terminal-lab-cisco-acl',
  },

  {
    id: 'routing-switching-vlans',
    slug: 'vlans-trunking-stp-lacp-routing',
    tierId: 'tier-0',
    tierName: 'Tier 0: Networking & Systems Foundations',
    title: 'Switching, VLANs (802.1Q), STP & LACP',
    category: 'Routing & Switching',
    summary: 'Subnetting (VLSM/CIDR), 802.1Q VLAN tagging, inter-VLAN routing (Router-on-a-Stick & SVI), STP loop prevention, and 802.3ad port channels.',
    estimatedMinutes: 60,
    difficulty: 'Beginner',
    prerequisites: ['osi-tcpip-model'],
    certAlignments: ['CompTIA Network+', 'Cisco CCNA (200-301)', 'CCNP Enterprise (350-401 ENCOR)'],
    rfcs: [
      { number: 'IEEE 802.1Q', title: 'Bridges and Bridged Networks: VLAN Tagging', url: 'https://standards.ieee.org/' },
      { number: 'IEEE 802.1w', title: 'Rapid Spanning Tree Protocol (RSTP)', url: 'https://standards.ieee.org/' },
      { number: 'RFC 4632', title: 'Classless Inter-domain Routing (CIDR)', url: 'https://datatracker.ietf.org/doc/html/rfc4632' },
    ],

    beginner: {
      whatIsIt: `A VLAN (Virtual Local Area Network) lets you create separate, isolated networks on the same physical switch — like having invisible walls inside a building that separate different departments. Even though HR and Finance share the same floor (switch), they can't talk to each other without going through a security checkpoint (router/firewall).`,
      whyItMatters: `VLANs are the first line of lateral movement prevention. If an attacker compromises a device in the guest WiFi VLAN, they can't directly reach the servers in the data center VLAN. Spanning Tree Protocol (STP) prevents catastrophic broadcast storms that can take down entire networks.`,
      realWorldAnalogy: `Imagine an office building: VLANs are like floors separated by locked stairwells. Each floor (VLAN) has its own broadcast domain. To move between floors, you need an elevator with a security check (the router). The building's single physical structure (switch fabric) supports all the floors.`,
      commonMisconception: `People think that because VLANs share the same physical switch, they can communicate freely. Wrong — without a Layer 3 device (router or Layer 3 switch) explicitly allowing traffic between VLANs, they are completely isolated.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'What a switch does without VLANs',
        description: 'A standard switch floods traffic to all ports in the same broadcast domain. Every device hears every ARP broadcast — this wastes bandwidth and creates security risks.',
        tip: 'A single flat network with 500 devices creates massive broadcast traffic.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Creating VLANs — logical segmentation',
        description: 'You tell the switch: "Ports 1-10 belong to VLAN 10 (Finance), ports 11-20 belong to VLAN 20 (HR)." Now broadcasts stay within each VLAN.',
        detail: 'VLANs are identified by a number (1–4094). VLAN 1 is the default — change it for security.',
        tip: 'VLAN IDs are carried in 802.1Q tags — a 4-byte header inserted into the Ethernet frame.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Trunk ports — carrying multiple VLANs',
        description: 'When traffic needs to flow between switches, you use a "trunk" port. Trunk ports carry frames tagged with their VLAN ID so the receiving switch knows which VLAN each frame belongs to.',
        detail: 'The 802.1Q tag inserts 4 bytes between the source MAC and EtherType fields of the Ethernet frame.',
        tip: 'Native VLAN traffic on a trunk is sent untagged — always change native VLAN from VLAN 1.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Spanning Tree Protocol — preventing loops',
        description: 'If you connect two switches with two cables for redundancy, you create a loop. Broadcast storms will destroy the network in seconds. STP blocks redundant paths automatically.',
        detail: 'STP elects a Root Bridge (lowest Bridge ID wins), then blocks all redundant paths. RSTP converges in under 1 second vs 30-50 seconds for classic STP.',
        tip: 'Always enable BPDU Guard on access ports to prevent attackers from connecting rogue switches.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Enterprise Network Segmentation',
        scenario: 'A hospital has doctors, nurses, admin staff, and medical devices all on the same physical network',
        howItApplies: 'VLANs separate: VLAN 10 (Medical Devices — ultra-restricted), VLAN 20 (Clinical Staff), VLAN 30 (Admin), VLAN 40 (Guest WiFi). Firewall rules between VLANs allow doctors to access medical records but guests can only reach the internet.',
        emoji: '🏥',
      },
      {
        title: 'VLAN Hopping Attack',
        scenario: 'An attacker on VLAN 40 (Guest) wants to reach VLAN 10 (Servers)',
        howItApplies: 'If DTP (Dynamic Trunking Protocol) is enabled on access ports, an attacker can negotiate a trunk and gain access to all VLANs. Fix: disable DTP with "switchport nonegotiate" and explicitly set all ports to access mode.',
        emoji: '🔓',
      },
    ],

    flowDiagram: {
      title: 'VLAN Traffic Flow & Inter-VLAN Routing',
      description: 'How traffic flows within a VLAN and how it must pass through a router to reach another VLAN.',
      layout: 'vertical',
      nodes: [
        { id: 'pc1',     label: 'PC1 (VLAN 10)',     sublabel: '192.168.10.5',    type: 'actor',   color: '#06b6d4' },
        { id: 'sw',      label: 'Layer 2 Switch',    sublabel: 'VLAN-aware',      type: 'process', color: '#475569' },
        { id: 'block',   label: 'VLAN Boundary',     sublabel: 'Isolated',        type: 'decision',color: '#f43f5e' },
        { id: 'router',  label: 'Router / L3 Switch',sublabel: 'Inter-VLAN ACL',  type: 'process', color: '#10b981' },
        { id: 'pc2',     label: 'PC2 (VLAN 20)',     sublabel: '192.168.20.8',    type: 'actor',   color: '#8b5cf6' },
      ],
      edges: [
        { from: 'pc1',    to: 'sw',     label: 'Tagged VLAN 10' },
        { from: 'sw',     to: 'block',  label: 'Different VLAN?' },
        { from: 'block',  to: 'router', label: 'Yes → route' },
        { from: 'router', to: 'pc2',    label: 'Permitted by ACL' },
      ],
    },

    quiz: [
      {
        question: 'What protocol adds a 4-byte tag to Ethernet frames to identify VLAN membership?',
        options: ['LACP (802.3ad)', '802.1X', '802.1Q', 'STP (802.1D)'],
        correctIndex: 2,
        explanation: 'IEEE 802.1Q inserts a 4-byte tag between the Source MAC and EtherType fields of an Ethernet frame. The tag contains a 12-bit VLAN ID (supporting VLANs 1–4094) and a 3-bit Priority Code Point (PCP) for QoS.',
      },
      {
        question: 'Why is leaving VLAN 1 as the native VLAN on trunk ports a security risk?',
        options: [
          'VLAN 1 traffic is always encrypted',
          'VLAN 1 cannot carry management traffic',
          'Untagged frames on a trunk are assigned to the native VLAN, enabling double-tagging attacks',
          'VLAN 1 cannot be configured with an IP address',
        ],
        correctIndex: 2,
        explanation: 'In a double-tagging attack, an attacker on VLAN 1 sends a frame with two 802.1Q tags. The first switch strips the outer VLAN 1 tag (untagged native traffic), and the inner tag gets the frame into the target VLAN. Changing the native VLAN from 1 mitigates this.',
      },
    ],

    overview: `Enterprise security starts with layer 2 isolation. Virtual LANs (VLANs) segment broadcast domains, restricting lateral movement before Layer 3 firewalls inspect inter-subnet traffic. Protocols like Spanning Tree (STP/RSTP) eliminate catastrophic broadcast storms while LACP provides link redundancy and bandwidth aggregation.`,
    keyConcepts: [
      {
        title: '802.1Q VLAN Tagging (4 Bytes Inserted)',
        explanation: 'TPID (2 Bytes: 0x8100 identifies 802.1Q) + TCI (2 Bytes: 3 bits Priority Code Point, 1 bit Drop Eligible, 12 bits VLAN ID supporting 4094 VLANs).',
      },
      {
        title: 'Spanning Tree Protocol (802.1D vs 802.1w RSTP)',
        explanation: 'Elects Root Bridge based on lowest Bridge ID (Priority + MAC). Port states: Blocking → Listening → Learning → Forwarding (STP: 30-50s convergence; RSTP: <1s via proposal-agreement handshakes). BPDU Guard prevents rogue switch injection on access ports.',
      },
      {
        title: 'Inter-VLAN Routing: ROAS vs. Layer 3 SVI',
        explanation: 'Router-on-a-Stick (ROAS) uses subinterfaces with 802.1Q encapsulation on a single physical link. Switched Virtual Interfaces (SVIs) route within Layer 3 switches at wire speed using hardware ASICs.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Cisco',
        context: 'Hardening switchports with Port Security & BPDU Guard',
        configSnippet: 'interface range GigabitEthernet 0/2 - 24\n switchport mode access\n switchport access vlan 10\n switchport port-security\n switchport port-security maximum 2\n switchport port-security violation shutdown\n spanning-tree portfast\n spanning-tree bpduguard enable',
        notes: 'BPDU Guard automatically err-disables the port if an unauthorized bridge or switch is attached.',
      },
    ],
    commonPitfalls: [
      'VLAN Hopping attacks via DTP (Dynamic Trunking Protocol) negotiation enabled by default on old switches. Always run "switchport nonegotiate".',
      'Leaving VLAN 1 as the native VLAN on trunks, enabling double-tagging exploits.',
    ],
  },

  {
    id: 'routing-ospf-bgp',
    slug: 'dynamic-routing-ospf-bgp-fundamentals',
    tierId: 'tier-0',
    tierName: 'Tier 0: Networking & Systems Foundations',
    title: 'Dynamic Routing: OSPFv2/v3 & BGP Architecture',
    category: 'Routing & Switching',
    summary: 'Interior Gateway Protocols (OSPF LSA types, Area 0 hierarchy, SPF algorithm) and Exterior Gateway Protocols (BGP AS path attributes, peering, route filtering).',
    estimatedMinutes: 60,
    difficulty: 'Intermediate',
    prerequisites: ['routing-switching-vlans'],
    certAlignments: ['Cisco CCNA (200-301)', 'CCNP Enterprise (350-401 ENCOR)', 'PCNSE'],
    rfcs: [
      { number: 'RFC 2328', title: 'OSPF Version 2', url: 'https://datatracker.ietf.org/doc/html/rfc2328' },
      { number: 'RFC 4271', title: 'A Border Gateway Protocol 4 (BGP-4)', url: 'https://datatracker.ietf.org/doc/html/rfc4271' },
    ],

    beginner: {
      whatIsIt: `Routing protocols are how routers automatically learn about all the networks in existence and figure out the best path to get traffic there. Without them, network engineers would have to manually type in routes to every network — impossible at internet scale. OSPF works inside a company; BGP is the protocol that runs the entire internet.`,
      whyItMatters: `Attackers who can inject fake routes into OSPF or BGP can redirect internet traffic through their own servers (route hijacking). This has caused real incidents — in 2010, China Telecom briefly "hijacked" 15% of internet traffic for 18 minutes by announcing bogus BGP routes.`,
      realWorldAnalogy: `Think of routers as GPS systems in self-driving cars. OSPF is like cars in a city sharing real-time traffic data with each other to find the best route. BGP is like the international highway authority that decides which countries' roads connect to which — and what the agreements between them are.`,
      commonMisconception: `BGP doesn't automatically verify that an Autonomous System (AS) is authorized to announce a particular IP prefix. This is why route hijacking works — anyone with a BGP session can announce any prefix.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'OSPF: Routers share their "link state"',
        description: 'Every OSPF router sends a "Link State Advertisement" (LSA) describing all its directly connected networks. Routers flood these LSAs to all other routers in the same OSPF area.',
        detail: 'After exchange, every router has an identical map of the entire area (LSDB - Link State Database).',
        tip: 'This is why OSPF is called a "link-state" protocol — routers share the state of their links, not just their routes.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'OSPF: Running Dijkstra\'s algorithm',
        description: 'With the complete network map (LSDB), each router independently runs the Shortest Path First (SPF) algorithm to calculate the best route to every destination.',
        detail: 'The result is a routing table: "To reach 10.2.0.0/24, send packets out GigE0/1 via next-hop 10.1.1.2".',
        tip: 'OSPF converges fast (seconds) because all routers have complete topology information.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'BGP: Peering between Autonomous Systems',
        description: 'BGP routers form a manual TCP session (port 179) with their peers — they don\'t auto-discover like OSPF. A BGP peer relationship must be explicitly configured.',
        detail: 'eBGP = peering between different AS numbers (internet). iBGP = peering within the same AS.',
        tip: 'Always authenticate BGP sessions with MD5 or TCP-AO to prevent session hijacking.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'BGP: Route selection & security',
        description: 'BGP selects routes using a complex decision process. Key attributes: Weight (Cisco-specific, local), Local Preference (prefer exit within AS), AS-Path length (prefer shorter), MED (metric from neighbor).',
        detail: 'RPKI (Resource Public Key Infrastructure) adds cryptographic validation — routers only accept routes that are authorized by the IP address owner.',
        tip: 'Use prefix-list and route-map filters on all eBGP sessions to prevent route leaks.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'BGP Route Hijacking (Real Incident)',
        scenario: 'In April 2010, China Telecom announced 50,000 IP prefixes it didn\'t own via BGP',
        howItApplies: 'Because BGP has no built-in authentication, other ASes accepted these routes. For 18 minutes, traffic destined for US military, Senate, and tech companies was routed through China. RPKI ROA (Route Origin Authorization) records would have caused compliant routers to reject these announcements.',
        emoji: '🌏',
      },
      {
        title: 'OSPF Authentication Prevents Route Injection',
        scenario: 'An attacker gets access to a network segment running OSPF',
        howItApplies: 'Without authentication, the attacker can inject fake LSAs advertising a route to 0.0.0.0/0 (default route) via their machine — all traffic flows through them. With HMAC-SHA-256 OSPF authentication, fake LSAs are rejected because they lack the correct cryptographic signature.',
        emoji: '🛡️',
      },
    ],

    flowDiagram: {
      title: 'OSPF Area 0 Backbone Design',
      description: 'OSPF areas connect to Area 0 (backbone). ABRs (Area Border Routers) summarize routes between areas.',
      layout: 'vertical',
      nodes: [
        { id: 'r1',   label: 'Router R1',       sublabel: 'Area 1 internal',  type: 'process', color: '#06b6d4' },
        { id: 'abr1', label: 'ABR (Area 1↔0)',  sublabel: 'Summarizes Area 1', type: 'actor',  color: '#10b981' },
        { id: 'area0',label: 'OSPF Area 0',     sublabel: 'Backbone',          type: 'data',   color: '#8b5cf6' },
        { id: 'abr2', label: 'ABR (Area 0↔2)',  sublabel: 'Summarizes Area 2', type: 'actor',  color: '#10b981' },
        { id: 'r2',   label: 'Router R2',       sublabel: 'Area 2 internal',  type: 'process', color: '#06b6d4' },
      ],
      edges: [
        { from: 'r1',   to: 'abr1',  label: 'LSA flood' },
        { from: 'abr1', to: 'area0', label: 'Type 3 LSA' },
        { from: 'area0',to: 'abr2',  label: 'Type 3 LSA' },
        { from: 'abr2', to: 'r2',    label: 'Route update' },
      ],
    },

    quiz: [
      {
        question: 'OSPF runs the Shortest Path First algorithm. What data structure does it use to calculate best paths?',
        options: ['BGP Route Table', 'ARP Cache', 'Link State Database (LSDB)', 'MAC Address Table'],
        correctIndex: 2,
        explanation: 'Every OSPF router maintains a Link State Database (LSDB) — a complete map of all routers and links in the OSPF area. Dijkstra\'s SPF algorithm runs against this database to compute the best path tree rooted at the local router.',
      },
      {
        question: 'What is RPKI used for in BGP?',
        options: [
          'Encrypting BGP session traffic',
          'Cryptographically validating that an AS is authorized to announce a specific IP prefix',
          'Compressing BGP route updates',
          'Load balancing between multiple BGP paths',
        ],
        correctIndex: 1,
        explanation: 'RPKI (Resource Public Key Infrastructure) allows IP address holders to create Route Origin Authorizations (ROAs) — cryptographically signed records stating which AS is authorized to originate their prefixes. BGP routers check ROAs and can reject INVALID routes, preventing route hijacking.',
      },
    ],

    overview: `Enterprise network security depends on predictable path selection. OSPF maintains complete topological maps using Link State Advertisements (LSAs) within autonomous systems. BGP governs the global Internet routing fabric using path attributes, peering policies, and prefix filtering. Security misconfigurations in routing protocols cause catastrophic route hijacking and traffic black-holing.`,
    keyConcepts: [
      {
        title: 'OSPF LSA Types & Hierarchical Design',
        explanation: 'Area 0 (Backbone) anchors all traffic. LSA 1 (Router LSA), LSA 2 (Network LSA from DR), LSA 3 (Summary from ABR), LSA 4 (ASBR Summary), LSA 5 (AS-External from ASBR).',
      },
      {
        title: 'BGP Path Selection & Routing Security',
        explanation: 'Selection order: Weight → Local Preference → Locally originated → Shortest AS_PATH → Lowest Origin code → Lowest MED → eBGP over iBGP → Lowest IGP metric → Lowest Router ID. BGP Hijacking countered with RPKI and ROA.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Cisco',
        context: 'OSPFv2 secure configuration with cryptographic authentication',
        configSnippet: 'router ospf 1\n router-id 10.255.255.1\n area 0 authentication message-digest\n network 10.10.0.0 0.0.255.255 area 0\n passive-interface default\n no passive-interface GigabitEthernet0/0/0\n\ninterface GigabitEthernet0/0/0\n ip ospf message-digest-key 1 md5 Secr3tKey#2026',
        notes: 'passive-interface default prevents sending hello packets on client-facing subnets.',
      },
    ],
    commonPitfalls: [
      'Discontiguous Area 0 design without virtual links, causing split-brain intra-area routing.',
      'Forgetting to filter customer prefixes on eBGP peer sessions, allowing accidental transit of full internet routing tables (BGP route leak).',
    ],
  },

  {
    id: 'linux-sys-socket-tooling',
    slug: 'linux-socket-troubleshooting-netsec-tools',
    tierId: 'tier-0',
    tierName: 'Tier 0: Networking & Systems Foundations',
    title: 'Linux Systems, Sockets, tcpdump & NetSec Tooling',
    category: 'Systems & Tooling',
    summary: 'CLI mastery: iproute2, ss socket investigation, tcpdump packet carving, iptables/nftables packet flow, and Scapy packet synthesis.',
    estimatedMinutes: 55,
    difficulty: 'Beginner',
    prerequisites: ['osi-tcpip-model'],
    certAlignments: ['CompTIA Security+', 'CompTIA CySA+ (CS0-003)', 'OffSec OSCP (PEN-200)'],
    rfcs: [
      { number: 'RFC 792', title: 'Internet Control Message Protocol (ICMP)', url: 'https://datatracker.ietf.org/doc/html/rfc792' },
    ],

    beginner: {
      whatIsIt: `Linux is the operating system that runs most of the internet — web servers, routers, firewalls, cloud infrastructure. As a security engineer, the Linux command line is your most powerful tool. You'll use it to see exactly what traffic is flowing, what ports are open, what connections are established, and why something isn't working.`,
      whyItMatters: `When a breach happens, graphical tools aren't available. You'll SSH into a compromised server and need to quickly answer: "What processes are listening on the network? What connections does this machine have? Is there suspicious traffic?" These CLI tools give you ground truth.`,
      realWorldAnalogy: `Linux CLI tools are like X-ray vision for your network. "ss" lets you see every socket connection (like looking at all the phone calls on a switchboard). "tcpdump" lets you read every packet (like recording every conversation). "ip route" shows you the routing table (like reading the GPS map).`,
      commonMisconception: `"netstat is the best tool for checking connections." Actually, netstat is deprecated and slow (it reads /proc files). "ss" reads directly from the kernel via netlink sockets — it's 10x faster and more accurate, especially on servers with thousands of connections.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'See all listening ports with ss',
        description: 'Run "ss -tulpn" to list all TCP (-t) and UDP (-u) listening (-l) sockets with process names (-p) and numeric ports (-n).',
        detail: 'Output columns: Netid (tcp/udp), State (LISTEN/ESTAB), Recv-Q, Send-Q, Local Address:Port, Peer Address:Port, Process.',
        tip: 'Any unexpected LISTEN port is a red flag — could be a backdoor or misconfigured service.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Capture traffic with tcpdump',
        description: 'Run "tcpdump -i eth0 -nn -c 100" to capture 100 packets on eth0 without resolving hostnames (-nn) for speed.',
        detail: 'Add filters: "tcpdump -i any host 1.2.3.4 and port 443" to capture only traffic to/from a specific host and port.',
        tip: 'Always use -nn (no name resolution) in incident response — DNS lookups alert attackers and slow analysis.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Inspect network interfaces with ip',
        description: '"ip addr show" lists all interfaces and their IP addresses. "ip route show" shows the routing table. "ip neigh show" shows the ARP cache.',
        detail: 'The iproute2 suite replaces the old ifconfig, route, and arp commands. Always prefer ip, ss over the legacy tools.',
        tip: '"ip link set eth0 down" can isolate a compromised machine from the network during incident response.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'View and manipulate firewall rules with nftables',
        description: '"nft list ruleset" shows all current firewall rules. Rules are organized into tables, chains, and rules — similar to iptables but with cleaner syntax.',
        detail: 'nftables replaces the older iptables. The kernel netfilter hook processes: prerouting → input/forward → output → postrouting.',
        tip: 'Always save your rules before editing ("nft list ruleset > backup.nft") — a wrong rule can lock you out of SSH.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Incident Response: Finding a Backdoor',
        scenario: 'You suspect a server has been compromised and a backdoor is listening',
        howItApplies: '"ss -tulpn" instantly shows all listening ports. If you see an unexpected port like 31337 or 4444, check the process: "ss -tulpn | grep 4444" → reveals PID. Then "ls -la /proc/[PID]/exe" shows the actual binary. "netstat -an" would give the same info but much slower on a busy server.',
        emoji: '🔍',
      },
      {
        title: 'Diagnosing Dropped Packets',
        scenario: 'A new firewall rule is blocking traffic but you\'re not sure which rule',
        howItApplies: '"tcpdump -i eth0 -nn host 10.1.2.3" on the firewall shows if packets are arriving. If they arrive but don\'t leave, a firewall rule is dropping them. "nft list ruleset" with counters ("nft list counters") shows which rules are matching traffic.',
        emoji: '🔥',
      },
    ],

    flowDiagram: {
      title: 'Linux Packet Processing Path (netfilter)',
      description: 'How packets flow through the Linux kernel\'s netfilter framework — where iptables/nftables rules apply.',
      layout: 'vertical',
      nodes: [
        { id: 'in',      label: 'Incoming Packet',   sublabel: 'NIC receives frame',       type: 'start',   color: '#06b6d4' },
        { id: 'pre',     label: 'PREROUTING',         sublabel: 'DNAT / Port Forwarding',   type: 'process', color: '#8b5cf6' },
        { id: 'route',   label: 'Routing Decision',   sublabel: 'Local or Forward?',        type: 'decision',color: '#f59e0b' },
        { id: 'input',   label: 'INPUT chain',        sublabel: 'To local process',         type: 'process', color: '#10b981' },
        { id: 'fwd',     label: 'FORWARD chain',      sublabel: 'Route to next hop',        type: 'process', color: '#10b981' },
        { id: 'post',    label: 'POSTROUTING',        sublabel: 'SNAT / Masquerade',        type: 'process', color: '#8b5cf6' },
        { id: 'out',     label: 'Packet Leaves NIC',  sublabel: 'Transmitted',              type: 'end',     color: '#06b6d4' },
      ],
      edges: [
        { from: 'in',    to: 'pre',   },
        { from: 'pre',   to: 'route', },
        { from: 'route', to: 'input', label: 'For me' },
        { from: 'route', to: 'fwd',   label: 'Forward' },
        { from: 'fwd',   to: 'post',  },
        { from: 'post',  to: 'out',   },
      ],
    },

    quiz: [
      {
        question: 'Which command shows all listening TCP and UDP sockets with process names on Linux?',
        options: ['netstat -a', 'ss -tulpn', 'ip addr show', 'tcpdump -i lo'],
        correctIndex: 1,
        explanation: '"ss -tulpn" shows TCP (-t) and UDP (-u) sockets in LISTEN state (-l), with process info (-p) and numeric ports/addresses (-n). It reads from the kernel\'s netlink socket interface, making it significantly faster than the deprecated netstat command.',
      },
      {
        question: 'Why should you always use "-nn" with tcpdump during incident response?',
        options: [
          'It enables hexadecimal output',
          'It prevents tcpdump from modifying packets',
          'It disables DNS/hostname resolution, making captures faster and preventing alert-triggering DNS queries',
          'It enables network name resolution for readability',
        ],
        correctIndex: 2,
        explanation: 'Without -nn, tcpdump performs reverse DNS lookups for every IP address it sees. These lookups: (1) slow down the capture significantly, (2) generate DNS traffic that could alert an attacker monitoring their C2 infrastructure\'s DNS queries, and (3) can cause missed packets due to resolver delays.',
      },
    ],

    overview: `Network security engineers must live in the terminal. When modern graphical consoles fail or obscure low-level anomalies, raw Linux utilities (ss, ip, tcpdump, nftables) provide absolute truth about socket bindings, kernel routing tables, connection states, and raw byte transfers.`,
    keyConcepts: [
      {
        title: 'iproute2 Suite vs Legacy net-tools',
        explanation: 'ip addr (replaces ifconfig), ip route (replaces route), ip neigh (replaces arp), ss (replaces netstat). ss reads directly from kernel netlink sockets for 10x faster connection state inspection.',
      },
      {
        title: 'TCP Connection States in Kernel',
        explanation: 'LISTEN → SYN_SENT → SYN_RECV → ESTABLISHED → FIN_WAIT_1 → CLOSE_WAIT → FIN_WAIT_2 → LAST_ACK → TIME_WAIT (2MSL timer) → CLOSED.',
      },
      {
        title: 'tcpdump Berkeley Packet Filter (BPF) Syntax',
        explanation: 'Filtering by primitives: host, net, port, proto, src, dst. Complex bitmasking: "tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn" isolates initial connection attempts.',
        command: 'tcpdump -i eth0 -nn -s 0 "tcp[tcpflags] & tcp-syn != 0"',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Essential socket and packet diagnostics commands',
        configSnippet: '# Show listening TCP & UDP sockets with PIDs\nss -tulpn\n\n# Trace active TCP states\nss -tan state established\n\n# Capture HTTP GET requests with tcpdump\ntcpdump -i eth0 -s 0 -A "tcp port 80"',
        notes: 'The -A flag prints packet payloads as ASCII — useful for inspecting unencrypted HTTP traffic.',
      },
    ],
    commonPitfalls: [
      'Running tcpdump without "-nn", which forces DNS reverse lookups on every packet, introducing latency and polluting the packet capture with DNS traffic.',
      'Misinterpreting TIME_WAIT sockets as hung connections; TIME_WAIT is normal TCP teardown behavior (lasts 2×MSL, typically 60-120 seconds).',
    ],
    labId: 'terminal-lab-linux-tools',
  },

  // ─── TIER 1 ────────────────────────────────────────────────────────────────
  {
    id: 'stateful-filtering-nat',
    slug: 'stateful-packet-inspection-nat-pat-mechanics',
    tierId: 'tier-1',
    tierName: 'Tier 1: Core Network Security & Cryptography',
    title: 'Stateful Filtering & NAT Architecture',
    category: 'Perimeter Defense',
    summary: 'Connection tracking (conntrack) state tables, TCP sequence validation, Source NAT, Destination NAT / Port Forwarding, and Hairpin NAT.',
    estimatedMinutes: 50,
    difficulty: 'Intermediate',
    prerequisites: ['osi-tcpip-model', 'linux-sys-socket-tooling'],
    certAlignments: ['CompTIA Security+', 'Cisco CCNA (200-301)', 'PCNSA', 'FCF / NSE 4'],
    rfcs: [
      { number: 'RFC 2663', title: 'IP Network Address Translator (NAT) Terminology', url: 'https://datatracker.ietf.org/doc/html/rfc2663' },
      { number: 'RFC 3022', title: 'Traditional IP Network Address Translator', url: 'https://datatracker.ietf.org/doc/html/rfc3022' },
    ],

    beginner: {
      whatIsIt: `A stateful firewall is like a security guard with a memory. A simple (stateless) guard just checks each person's ID at the door. A stateful guard also remembers: "I let Alice out 5 minutes ago, so when someone claiming to be Alice's response comes back, I'll let it in automatically." This is connection tracking.`,
      whyItMatters: `Without stateful inspection, you'd have to write rules allowing ALL return traffic from the internet — which is dangerous. Stateful firewalls automatically allow return traffic for established connections while blocking unsolicited inbound traffic. NAT also hides your internal IP addressing from the internet.`,
      realWorldAnalogy: `Imagine a hotel concierge. When a guest (your PC) goes out (sends traffic), the concierge notes it in a logbook (state table). When the response comes back, the concierge checks the logbook: "Yes, room 205 went to restaurant X — this food delivery is for them." NAT is like the concierge giving everyone the hotel's address (public IP) to the outside world while managing rooms internally.`,
      commonMisconception: `"A firewall with NAT is automatically secure." NAT provides no real security — it's just IP address translation. A device behind NAT is still vulnerable to attacks initiated from the inside, malware callbacks, and exploitation via forwarded ports.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Stateless vs Stateful — the difference',
        description: 'A stateless ACL only looks at individual packets. Rule: "Allow TCP port 443 from any." This also allows an attacker to send crafted TCP port 443 packets inbound at any time.',
        detail: 'A stateful firewall tracks the full connection. It allows port 443 inbound ONLY if your internal host sent a SYN first (connection was initiated from inside).',
        tip: 'Stateful firewalls track: NEW → ESTABLISHED → RELATED → INVALID connection states.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'The connection state table (conntrack)',
        description: 'When your PC sends a SYN packet, the firewall creates an entry: [SrcIP:SrcPort → DstIP:DstPort, Protocol, State=NEW]. When the SYN-ACK arrives back, state changes to ESTABLISHED.',
        detail: 'The 5-tuple (Src IP, Src Port, Dst IP, Dst Port, Protocol) uniquely identifies each connection. Return traffic matching a conntrack entry is automatically allowed.',
        tip: 'View conntrack entries on Linux: "conntrack -L" (requires conntrack-tools package).',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Source NAT (SNAT) — hiding internal IPs',
        description: 'When your PC (192.168.1.5) sends traffic to google.com, the firewall replaces 192.168.1.5 with its own public IP (203.0.113.1). Google sees the connection from 203.0.113.1.',
        detail: 'PAT (Port Address Translation / NAT Overload) is SNAT where thousands of internal hosts share one public IP by using different source ports to differentiate connections.',
        tip: 'This is why 192.168.x.x (private RFC 1918 addresses) never appear on the public internet.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Destination NAT (DNAT) — port forwarding',
        description: 'When traffic arrives at your public IP on port 443, DNAT rewrites the destination to an internal server (10.0.0.10:443). This is how you host a public web server behind NAT.',
        detail: 'Common name: "Port Forwarding." The firewall maintains a mapping and reverses the translation for return traffic.',
        tip: 'DNAT only works if there\'s a corresponding security rule explicitly allowing the forwarded traffic.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Home Router as Stateful Firewall + NAT',
        scenario: 'Your home router with 3 devices all sharing one public IP',
        howItApplies: 'All three devices can browse the web simultaneously because PAT assigns different source ports to each connection. Your router\'s conntrack table might have: PC1:54321→8.8.8.8:53 (DNS), Laptop:55000→google.com:443 (HTTPS), Phone:56100→netflix.com:443 (streaming). Inbound unsolicited traffic is dropped because there\'s no matching conntrack entry.',
        emoji: '🏠',
      },
      {
        title: 'Asymmetric Routing — The Silent Killer',
        scenario: 'Two firewalls in an active-active cluster handling the same traffic flow',
        howItApplies: 'If the SYN packet enters Firewall A (which creates the conntrack entry) but the SYN-ACK return packet enters Firewall B (which has no conntrack entry for this connection), Firewall B drops it as INVALID. This causes connection failures that are incredibly hard to debug without understanding stateful inspection.',
        emoji: '⚖️',
      },
    ],

    flowDiagram: {
      title: 'NAT/PAT Translation — Outbound Traffic',
      description: 'How Source NAT rewrites the source IP of outbound connections so internal hosts share one public IP.',
      layout: 'vertical',
      nodes: [
        { id: 'pc',     label: 'Internal PC',       sublabel: '192.168.1.5:54321',          type: 'actor',   color: '#06b6d4' },
        { id: 'fw',     label: 'Firewall / Router',  sublabel: 'Conntrack + SNAT',            type: 'process', color: '#10b981' },
        { id: 'nat',    label: 'NAT Translation',    sublabel: '→ 203.0.113.1:54321',        type: 'data',    color: '#f59e0b' },
        { id: 'inet',   label: 'Internet Server',    sublabel: 'Sees: 203.0.113.1',          type: 'actor',   color: '#8b5cf6' },
        { id: 'ret',    label: 'Return Traffic',     sublabel: '→ 203.0.113.1 (reversed)',   type: 'data',    color: '#f59e0b' },
        { id: 'back',   label: 'PC receives reply',  sublabel: 'DNAT reversal → 192.168.1.5',type: 'end',     color: '#06b6d4' },
      ],
      edges: [
        { from: 'pc',  to: 'fw',  label: 'SYN from 192.168.1.5' },
        { from: 'fw',  to: 'nat', label: 'SNAT rewrites src IP' },
        { from: 'nat', to: 'inet',label: 'Public IP used' },
        { from: 'inet',to: 'ret', label: 'SYN-ACK response' },
        { from: 'ret', to: 'back',label: 'Conntrack reverses NAT' },
      ],
    },

    quiz: [
      {
        question: 'A packet arrives at a stateful firewall with TCP flags RST+ACK but no matching entry in the state table. What should the firewall do?',
        options: [
          'Forward it — RST packets should always be allowed',
          'Drop it as INVALID — no matching session exists',
          'Create a new state entry and allow it',
          'Send it to the RELATED queue for inspection',
        ],
        correctIndex: 1,
        explanation: 'A RST+ACK packet with no corresponding conntrack entry is classified as INVALID. Stateful firewalls drop INVALID packets to prevent TCP reset injection attacks, spoofed teardowns, and other crafted packet exploits that could disrupt legitimate sessions.',
      },
      {
        question: 'What is the difference between SNAT and PAT (NAT Overload)?',
        options: [
          'SNAT changes destination IPs; PAT changes source ports',
          'SNAT maps one internal IP to one public IP; PAT maps many internal IPs to one public IP using port differentiation',
          'SNAT is for TCP only; PAT works for UDP only',
          'They are identical — PAT is just a Cisco-specific name for SNAT',
        ],
        correctIndex: 1,
        explanation: 'SNAT replaces the source IP but can still result in one-to-one mappings. PAT (also called NAT Overload or IP Masquerading) additionally translates source ports, allowing thousands of internal hosts to share a single public IP address simultaneously — each differentiated by a unique source port number.',
      },
    ],

    overview: `Unlike primitive stateless packet filters, stateful firewalls track the full lifecycle of Layer 4 connections using state tables. They verify SYN/ACK flag sequences, window sizing, and teardowns, automatically permitting return traffic without requiring permissive inbound ACLs. Combined with NAT/PAT, they protect private IPv4 addressing spaces.`,
    keyConcepts: [
      {
        title: 'State Table Mechanics (Conntrack)',
        explanation: 'Records 5-tuple: [Source IP, Source Port, Destination IP, Destination Port, Protocol]. State transitions: NEW (initiating SYN), ESTABLISHED (bidirectional handshake confirmed), RELATED (secondary connections like FTP data), INVALID (out-of-window or illegal flag combinations).',
      },
      {
        title: 'SNAT vs. DNAT vs. PAT / NAT Overload',
        explanation: 'Source NAT (SNAT): translates internal client IP to firewall egress public IP. Destination NAT (DNAT): translates public VIP to internal server IP (port forwarding). Port Address Translation (PAT): maps multiple private IPs to one public IP by allocating distinct ephemeral source port numbers.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Palo Alto',
        context: 'Configuring Source NAT (Dynamic IP and Port) in PAN-OS',
        configSnippet: 'set rulebase nat rules "Outbound-Internet-NAT" from Trust to Untrust source any destination any service any\nset rulebase nat rules "Outbound-Internet-NAT" source-translation dynamic-ip-and-port interface-address interface ethernet1/1',
        notes: 'PAN-OS processes NAT policy before security policy evaluation.',
      },
      {
        vendor: 'Linux',
        context: 'nftables stateful connection tracking and masquerading rule',
        configSnippet: 'table inet filter {\n  chain forward {\n    type filter hook forward priority 0; policy drop;\n    ct state established,related accept\n    ct state invalid drop\n    iifname "eth1" oifname "eth0" ct state new accept\n  }\n}\ntable ip nat {\n  chain postrouting {\n    type nat hook postrouting priority 100;\n    oifname "eth0" masquerade\n  }\n}',
        notes: 'nftables replaces legacy iptables with clean unified rule syntax.',
      },
    ],
    commonPitfalls: [
      'Asymmetric routing: when SYN enters Firewall A and SYN-ACK returns through Firewall B, Firewall B drops it as INVALID.',
      'NAT port exhaustion during heavy microservice outbound connection bursts without proper port pool allocation.',
    ],
  },

  {
    id: 'applied-crypto-pki',
    slug: 'applied-cryptography-pki-tls13-mechanics',
    tierId: 'tier-1',
    tierName: 'Tier 1: Core Network Security & Cryptography',
    title: 'Applied Cryptography, PKI & TLS 1.2 vs. 1.3',
    category: 'Cryptography & PKI',
    summary: 'Symmetric (AES-GCM, ChaCha20-Poly1305) vs Asymmetric (RSA, Ed25519), X.509 certificate chains, CRL/OCSP stapling, and TLS 1.3 1-RTT handshake.',
    estimatedMinutes: 55,
    difficulty: 'Intermediate',
    prerequisites: ['osi-tcpip-model'],
    certAlignments: ['CompTIA Security+', 'Cisco CCNP Security (350-701 SCOR)', 'CISSP'],
    rfcs: [
      { number: 'RFC 8446', title: 'The Transport Layer Security (TLS) Protocol Version 1.3', url: 'https://datatracker.ietf.org/doc/html/rfc8446' },
      { number: 'RFC 5280', title: 'Internet X.509 Public Key Infrastructure Certificate and CRL Profile', url: 'https://datatracker.ietf.org/doc/html/rfc5280' },
    ],

    beginner: {
      whatIsIt: `Cryptography is the science of hiding information. In networking, it solves three problems: (1) Confidentiality — nobody can read your data in transit. (2) Integrity — nobody can tamper with your data. (3) Authentication — you're really talking to who you think you are. TLS (Transport Layer Security) is the protocol that combines all three and powers HTTPS, the padlock in your browser.`,
      whyItMatters: `Every website you log into, every bank transaction, every email — all protected by TLS. Without understanding how it works, you can't identify weak cipher suites, expired certificates, or MITM proxy setups. You also can't properly configure your organization's HTTPS services.`,
      realWorldAnalogy: `Asymmetric cryptography is like a special mailbox with two slots: anyone can drop mail in the public slot (encrypt with public key), but only you have the key to retrieve mail (decrypt with private key). Symmetric encryption is like a physical safe — whoever has the combination (shared key) can open it. TLS uses asymmetric crypto to safely exchange a symmetric key, then uses the fast symmetric key for all actual data.`,
      commonMisconception: `"HTTPS means the website is safe and legitimate." HTTPS only means the connection is encrypted — even phishing sites can have HTTPS. The padlock means your connection to the server is private, not that the server itself is trustworthy.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Symmetric Encryption — fast bulk encryption',
        description: 'AES (Advanced Encryption Standard) uses the same key to encrypt and decrypt. AES-256-GCM is the gold standard — 256-bit key, Galois/Counter Mode provides both encryption and integrity (AEAD).',
        detail: 'Problem: How do two parties securely share the same key over an untrusted network? This is the key exchange problem that asymmetric crypto solves.',
        tip: 'GCM mode provides Authenticated Encryption with Associated Data (AEAD) — combining confidentiality and integrity in one operation.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Asymmetric Encryption — secure key exchange',
        description: 'RSA and ECDH use mathematically linked key pairs (public key + private key). You can share the public key with anyone. Only the private key holder can decrypt messages encrypted with the public key.',
        detail: 'ECDH (Elliptic Curve Diffie-Hellman) is used in TLS 1.3 for Perfect Forward Secrecy — a new ephemeral key pair is generated for every session, so compromising the server\'s private key doesn\'t expose past sessions.',
        tip: 'Perfect Forward Secrecy (PFS) means past recorded traffic can\'t be decrypted even if you later steal the server\'s private key.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'X.509 Certificates — proving identity',
        description: 'A certificate is a digital identity document: "This public key belongs to google.com" — signed by a trusted Certificate Authority (CA). Your browser has a built-in list of trusted CAs.',
        detail: 'Certificate chain: Root CA → Intermediate CA → Leaf certificate. Root CA is trusted by the OS/browser. Intermediate CAs are trusted because they\'re signed by the Root. Leaf cert is trusted because it\'s signed by Intermediate.',
        tip: 'Check certificate details: click the padlock in Chrome → Certificate → Certification Path.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'TLS 1.3 Handshake — 1 Round Trip',
        description: 'TLS 1.3 completes in just 1 round trip. Client sends: ClientHello (supported ciphers, key share). Server replies with: ServerHello (chosen cipher, key share, encrypted certificate). Data flows immediately.',
        detail: 'TLS 1.2 required 2 round trips and supported weak legacy ciphers (RC4, 3DES, CBC mode). TLS 1.3 removed them all. Only AEAD ciphers are allowed: AES-256-GCM, ChaCha20-Poly1305.',
        tip: 'TLS 1.3 also supports 0-RTT (Zero Round Trip) for resumed sessions — clients can send data with the first packet.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'SSL Stripping Attack',
        scenario: 'An attacker on your network intercepts your HTTPS request',
        howItApplies: 'The attacker proxies traffic and presents HTTP (not HTTPS) to your browser while maintaining HTTPS to the server. Your browser shows no padlock. Fix: HSTS (HTTP Strict Transport Security) — websites send a header telling browsers to ALWAYS use HTTPS, even if the user types HTTP. After the first HTTPS visit, browsers refuse HTTP connections.',
        emoji: '🔓',
      },
      {
        title: 'Enterprise TLS Inspection (SSL Proxy)',
        scenario: 'Your company firewall decrypts and re-encrypts all HTTPS traffic',
        howItApplies: 'The firewall acts as a MITM proxy — it terminates TLS from the internet and re-encrypts to clients using a corporate CA certificate. Your browser trusts it because your IT department installed the corporate CA in the trust store. This allows the firewall to inspect encrypted traffic for malware and DLP violations.',
        emoji: '🏢',
      },
    ],

    flowDiagram: {
      title: 'TLS 1.3 Handshake (1-RTT)',
      description: 'TLS 1.3 establishes an encrypted session in just one round trip — significantly faster than TLS 1.2\'s two round trips.',
      layout: 'vertical',
      nodes: [
        { id: 'client',    label: 'Client (Browser)',    sublabel: 'Wants secure connection',     type: 'actor',   color: '#06b6d4' },
        { id: 'ch',        label: 'ClientHello',         sublabel: 'Ciphers + Key Share',          type: 'data',    color: '#10b981' },
        { id: 'sh',        label: 'ServerHello',         sublabel: 'Cipher chosen + Key Share',    type: 'data',    color: '#10b981' },
        { id: 'cert',      label: 'Certificate',         sublabel: 'Signed by trusted CA',         type: 'data',    color: '#8b5cf6' },
        { id: 'keys',      label: 'Session Keys Derived',sublabel: 'ECDH shared secret → AES key', type: 'process', color: '#f59e0b' },
        { id: 'data',      label: 'Encrypted App Data',  sublabel: 'AES-256-GCM / ChaCha20',      type: 'end',     color: '#06b6d4' },
      ],
      edges: [
        { from: 'client', to: 'ch',   label: 'Client sends →' },
        { from: 'ch',     to: 'sh',   label: '← Server replies' },
        { from: 'sh',     to: 'cert', label: 'Attached' },
        { from: 'cert',   to: 'keys', label: 'ECDH + verify cert' },
        { from: 'keys',   to: 'data', label: 'Encrypt everything' },
      ],
    },

    quiz: [
      {
        question: 'What does "Perfect Forward Secrecy" (PFS) guarantee?',
        options: [
          'The same encryption key is used across all TLS sessions for performance',
          'Compromising the server\'s long-term private key cannot decrypt past recorded sessions',
          'All TLS sessions use 4096-bit RSA keys',
          'The client\'s certificate is verified before the server\'s',
        ],
        correctIndex: 1,
        explanation: 'PFS uses ephemeral key pairs (generated fresh per session, then discarded) for key exchange (ECDHE). Even if an attacker later steals the server\'s long-term private key, they cannot decrypt previously recorded traffic because the ephemeral keys no longer exist. TLS 1.3 mandates PFS — it only allows ECDHE key exchange.',
      },
      {
        question: 'Why was TLS 1.0 and 1.1 deprecated?',
        options: [
          'They were too fast and unnecessary',
          'They used CBC mode ciphers vulnerable to BEAST and POODLE attacks, and didn\'t require PFS',
          'They were too slow for modern hardware',
          'They didn\'t support IPv6',
        ],
        correctIndex: 1,
        explanation: 'TLS 1.0/1.1 allowed weak CBC-mode cipher suites vulnerable to BEAST (Browser Exploit Against SSL/TLS) and POODLE attacks. They also didn\'t mandate Perfect Forward Secrecy, meaning past sessions could be decrypted if the private key was compromised. RFC 8996 officially deprecated them in 2021.',
      },
    ],

    overview: `Cryptography is the cornerstone of confidentiality, integrity, and authenticity across hostile networks. TLS 1.3 stripped obsolete primitives, mandated Perfect Forward Secrecy (PFS via Ephemeral Diffie-Hellman), and reduced the handshake to 1-RTT.`,
    keyConcepts: [
      {
        title: 'Symmetric vs. Asymmetric Primitives',
        explanation: 'Symmetric (AES-256-GCM, ChaCha20-Poly1305): single shared key, hardware-accelerated, encrypts bulk payload. Asymmetric (RSA-4096, ECDSA P-256, Ed25519): public/private keypair, used for key exchange and digital signatures.',
      },
      {
        title: 'X.509 Certificate Hierarchy & Revocation',
        explanation: 'Root CA → Intermediate CA → Leaf Certificate. Revocation: CRL (Certificate Revocation List, slow/bulky) vs OCSP (Online Certificate Status Protocol) vs OCSP Stapling (server bundles signed OCSP response in TLS handshake).',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Testing TLS configuration with OpenSSL',
        configSnippet: '# Test TLS version and cipher suite\nopenssl s_client -connect google.com:443 -tls1_3\n\n# Verify certificate chain\nopenssl s_client -connect google.com:443 -showcerts\n\n# Check certificate expiry\necho | openssl s_client -connect google.com:443 2>/dev/null | openssl x509 -noout -dates',
        notes: 'Look for "Protocol: TLSv1.3" and "Cipher: TLS_AES_256_GCM_SHA384" in the output.',
      },
    ],
    commonPitfalls: [
      'Leaving TLS 1.0/1.1 enabled "for compatibility" — scan with SSLLabs.com and enforce minimum TLS 1.2.',
      'Not implementing OCSP Stapling — causes slow page loads as browsers query CA OCSP servers on every connection.',
      'Using self-signed certificates in production without adding them to the trust store — causes errors and trains users to ignore cert warnings.',
    ],
  },

  {
    id: 'ipsec-vpn-tunneling',
    slug: 'ipsec-vpn-ikev2-tunneling',
    tierId: 'tier-1',
    tierName: 'Tier 1: Core Network Security & Cryptography',
    title: 'IPsec VPN & IKEv2 Tunneling Architecture',
    category: 'VPN & Encryption',
    summary: 'IKEv2 phase negotiation (ISAKMP SA → IPsec SA), ESP vs AH transport, tunnel vs transport mode, and site-to-site vs client VPN architectures.',
    estimatedMinutes: 55,
    difficulty: 'Intermediate',
    prerequisites: ['applied-crypto-pki'],
    certAlignments: ['Cisco CCNP Security (350-701 SCOR)', 'PCNSE', 'FCF / NSE 4'],
    rfcs: [
      { number: 'RFC 7296', title: 'Internet Key Exchange Protocol Version 2 (IKEv2)', url: 'https://datatracker.ietf.org/doc/html/rfc7296' },
      { number: 'RFC 4303', title: 'IP Encapsulating Security Payload (ESP)', url: 'https://datatracker.ietf.org/doc/html/rfc4303' },
    ],

    beginner: {
      whatIsIt: `A VPN (Virtual Private Network) creates an encrypted "tunnel" through the public internet. Imagine digging a private underground pipe between two offices — even though the pipe runs under public roads, nobody outside can see what flows through it. IPsec is the most secure and widely used VPN protocol for connecting offices (site-to-site) or remote workers.`,
      whyItMatters: `Without VPN, traffic between offices traverses the internet in plaintext. An attacker who can tap the connection (e.g., at an ISP) sees everything. IPsec encrypts all traffic between sites. Understanding IPsec is critical because misconfiguration (wrong encryption, no authentication) creates a false sense of security.`,
      realWorldAnalogy: `IKEv2 is like two offices negotiating the terms of a secret communication channel: "I'll use AES-256. I'll authenticate with this certificate. Here's my Diffie-Hellman public value." After agreement (Phase 1), they establish the actual encrypted data channel (Phase 2). ESP (Encapsulating Security Payload) is the actual armored truck carrying the data.`,
      commonMisconception: `"Once VPN is set up, all traffic is secure." A site-to-site VPN only encrypts traffic between the two specific endpoints. An attacker who compromises one end of the tunnel can see all traffic decrypted inside that site's network.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'IKEv2 Phase 1 — IKE SA (Secure Channel)',
        description: 'The two VPN gateways first establish a secure control channel. They negotiate: encryption algorithm (AES-256), integrity (SHA-256), DH group (key exchange), and authenticate each other (pre-shared key or certificates).',
        detail: 'Result: An IKE Security Association (SA) — a secure channel used to negotiate the actual data tunnel.',
        tip: 'Always use certificates (not pre-shared keys) for site-to-site VPNs — PSKs are a single point of failure.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'IKEv2 Phase 2 — IPsec SA (Data Tunnel)',
        description: 'Using the Phase 1 channel, gateways negotiate the actual data encryption: which traffic to encrypt (selectors), what encryption to use (AES-256-GCM), and for how long (lifetime in KB or seconds).',
        detail: 'Result: Two unidirectional IPsec SAs (one for each direction). Each SA has a Security Parameter Index (SPI) that identifies it.',
        tip: 'Use AES-GCM (AEAD) for Phase 2 — it provides both encryption and integrity in one pass, unlike AES-CBC which needs separate HMAC.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'ESP — Encapsulating Security Payload',
        description: 'ESP (Protocol 50) encrypts the packet payload and authenticates the entire ESP header + payload. In tunnel mode, it wraps the entire original IP packet inside a new IP packet.',
        detail: 'AH (Authentication Header) only provides integrity — no encryption. Never use AH alone in production. ESP provides both.',
        tip: 'Tunnel mode: entire original packet is encrypted (site-to-site). Transport mode: only payload encrypted (host-to-host).',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Remote Worker VPN',
        scenario: 'An employee working from home needs access to corporate resources',
        howItApplies: 'Their laptop runs an IKEv2 client. It connects to the corporate VPN gateway, negotiates IPsec SAs, and all traffic is encrypted in an ESP tunnel. The corporate firewall sees their traffic as coming from the VPN gateway\'s IP, not the home IP. Split tunneling can route only corporate traffic through VPN.',
        emoji: '🏠',
      },
    ],

    flowDiagram: {
      title: 'IPsec IKEv2 Tunnel Establishment',
      description: 'Two-phase process: first establish a secure control channel (IKE SA), then negotiate the encrypted data tunnel (IPsec SA).',
      layout: 'vertical',
      nodes: [
        { id: 'gw1',   label: 'Gateway A',       sublabel: 'Site 1 (10.1.0.0/24)',   type: 'actor',   color: '#06b6d4' },
        { id: 'p1',    label: 'IKE Phase 1',     sublabel: 'Negotiate IKE SA',       type: 'process', color: '#10b981' },
        { id: 'auth',  label: 'Authentication',  sublabel: 'PSK or Certificates',    type: 'decision',color: '#f59e0b' },
        { id: 'p2',    label: 'IKE Phase 2',     sublabel: 'Negotiate IPsec SA',     type: 'process', color: '#10b981' },
        { id: 'esp',   label: 'ESP Tunnel',      sublabel: 'AES-256-GCM Encrypted',  type: 'data',    color: '#8b5cf6' },
        { id: 'gw2',   label: 'Gateway B',       sublabel: 'Site 2 (10.2.0.0/24)',   type: 'actor',   color: '#06b6d4' },
      ],
      edges: [
        { from: 'gw1', to: 'p1',   label: 'Initiate IKEv2' },
        { from: 'p1',  to: 'auth', label: 'Authenticate' },
        { from: 'auth',to: 'p2',   label: 'Auth OK' },
        { from: 'p2',  to: 'esp',  label: 'SAs established' },
        { from: 'esp', to: 'gw2',  label: 'Encrypted data' },
      ],
    },

    quiz: [
      {
        question: 'What is the key difference between IPsec Tunnel Mode and Transport Mode?',
        options: [
          'Tunnel mode encrypts only the payload; Transport mode encrypts the entire packet',
          'Tunnel mode encrypts the entire original IP packet inside a new IP header; Transport mode only encrypts the payload',
          'Tunnel mode uses AH; Transport mode uses ESP',
          'There is no difference — they are the same',
        ],
        correctIndex: 1,
        explanation: 'In Tunnel mode, the entire original IP packet (including the original IP header) is encrypted and encapsulated inside a new IP packet with a new outer IP header. This is used for site-to-site VPNs where the original endpoint IPs must be hidden. Transport mode only encrypts the payload, leaving the original IP headers visible — used for host-to-host communication.',
      },
    ],

    overview: `IPsec provides network-layer encryption and authentication for VPN tunnels. IKEv2 is the modern key exchange protocol combining the ISAKMP framework with Diffie-Hellman for Perfect Forward Secrecy and mutual authentication via certificates or PSK.`,
    keyConcepts: [
      {
        title: 'IKEv2 Two-Phase Negotiation',
        explanation: 'Phase 1: IKE SA — establishes encrypted control channel. Phase 2: IPsec SA — negotiates data plane encryption selectors and algorithms. IKEv2 combines CREATE_CHILD_SA exchange to renegotiate SAs without re-authenticating.',
      },
      {
        title: 'ESP vs AH Protocol Numbers',
        explanation: 'ESP (IP Protocol 50): encrypts + authenticates payload. AH (IP Protocol 51): authenticates header + payload but NO encryption. Always use ESP in production. AH breaks NAT traversal because NAT modifies the IP header which AH signs.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Cisco',
        context: 'IKEv2 Site-to-Site VPN Configuration',
        configSnippet: 'crypto ikev2 proposal STRONG-PROP\n encryption aes-cbc-256\n integrity sha512\n group 20\n!\ncrypto ikev2 policy SITE-POLICY\n proposal STRONG-PROP\n!\ncrypto ipsec transform-set STRONG-TS esp-aes 256 esp-sha512-hmac\n mode tunnel',
        notes: 'Group 20 = NIST P-384 Elliptic Curve DH. Prefer ECDH groups over classical DH for quantum resistance.',
      },
    ],
    commonPitfalls: [
      'Using DH Group 1 or 2 (768/1024-bit) — cryptographically broken. Use Group 19 (P-256) or 20 (P-384) minimum.',
      'Not configuring Dead Peer Detection (DPD) — stale SAs accumulate when remote peer crashes, causing traffic blackholes.',
    ],
  },

  {
    id: 'ids-ips-signatures',
    slug: 'ids-ips-signature-engineering',
    tierId: 'tier-1',
    tierName: 'Tier 1: Core Network Security & Cryptography',
    title: 'IDS/IPS & Network Detection Engineering',
    category: 'Detection & Prevention',
    summary: 'Signature vs. anomaly-based detection, Snort/Suricata rule anatomy, PCRE patterns, and rate-limiting thresholds for DoS detection.',
    estimatedMinutes: 50,
    difficulty: 'Intermediate',
    prerequisites: ['stateful-filtering-nat'],
    certAlignments: ['CompTIA CySA+ (CS0-003)', 'CompTIA Security+', 'GCIA', 'GICSP'],
    rfcs: [],

    beginner: {
      whatIsIt: `An IDS (Intrusion Detection System) watches network traffic and alerts when it sees something suspicious — like a security camera that triggers an alarm. An IPS (Intrusion Prevention System) does the same but also automatically blocks the attack — like a security guard who can physically stop the threat. Signatures are the "known bad patterns" the system looks for.`,
      whyItMatters: `Firewalls block based on ports and IPs. IDS/IPS goes deeper — it reads the actual packet content. A firewall might allow traffic on port 80 (HTTP), but an IPS can detect if that HTTP traffic contains SQL injection code or a known malware command-and-control beacon.`,
      realWorldAnalogy: `Imagine a post office inspector who doesn't just check addresses (firewall) but actually opens suspicious packages and scans them for dangerous contents (IDS/IPS). Signatures are their list of known dangerous contents: "Envelope containing X is suspicious." Anomaly detection is: "This person normally sends 5 letters/day — today they sent 50,000."`,
      commonMisconception: `"IPS replaces firewalls." IPS and firewalls are complementary. Firewalls filter by network/transport layer attributes. IPS inspects application-layer content. You need both — an IPS without a firewall means all traffic still flows through for inspection (inefficient). An IPS inline with a firewall is defense-in-depth.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Signature-based detection — pattern matching',
        description: 'Signatures are rules that describe known attack patterns. Snort/Suricata rules match on packet fields: IP protocol, ports, payload content, flags, sizes.',
        detail: 'Example: A Snort rule that alerts whenever it sees a packet containing the string "/etc/passwd" in the HTTP payload — a classic path traversal indicator.',
        tip: 'Signature databases (like Snort VRT, Emerging Threats) contain thousands of rules updated daily for new CVEs.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Anatomy of a Snort/Suricata rule',
        description: 'Format: action proto srcIP srcPort → dstIP dstPort (options)\n\nalert tcp any any → $HOME_NET 80 (msg:"SQL Injection"; content:"UNION SELECT"; sid:10001;)',
        detail: 'Action (alert/drop/reject), Protocol (tcp/udp/icmp), Flow direction, Content match (payload bytes), PCRE for complex regex patterns, Threshold to limit alert frequency.',
        tip: 'Always test new rules in "alert" mode first before switching to "drop" — false positives in drop mode block legitimate traffic.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Anomaly detection — baseline deviation',
        description: 'Instead of matching known patterns, anomaly-based systems build a statistical baseline of "normal" behavior. Deviations from the baseline trigger alerts.',
        detail: 'Examples: A server that normally receives 100 connections/second now receives 100,000/second (DDoS). A user who normally logs in from London suddenly logs in from Russia 2 hours later (impossible travel).',
        tip: 'Anomaly detection generates more false positives than signature detection. Machine learning models improve accuracy over time.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Detecting SQL Injection with Snort',
        scenario: 'An attacker targets your web application\'s login form with SQL injection',
        howItApplies: 'The attacker sends: "admin\' OR \'1\'=\'1" as the username. Without IPS, the request reaches the database. With IPS: a Snort rule matches "OR \'1\'=\'1" in the HTTP payload, drops the packet, and generates an alert. The database never receives the malicious query.',
        emoji: '💉',
      },
      {
        title: 'Rate-Based DoS Detection',
        scenario: 'Your server is being hit with a SYN flood DoS attack',
        howItApplies: 'Snort threshold rules count SYN packets per source IP per second. "threshold: type both, track by_src, count 100, seconds 1" — if any single IP sends >100 SYN packets/second, drop all subsequent packets from that source. This rate-limits attackers while allowing legitimate users.',
        emoji: '🌊',
      },
    ],

    flowDiagram: {
      title: 'IDS vs IPS: Detection & Response Flow',
      description: 'IDS monitors a copy of traffic (passive). IPS sits inline and can drop traffic in real-time.',
      layout: 'vertical',
      nodes: [
        { id: 'traffic', label: 'Network Traffic',   sublabel: 'All packets flowing',     type: 'start',   color: '#06b6d4' },
        { id: 'tap',     label: 'TAP / SPAN Port',   sublabel: 'Copy of traffic (IDS)',   type: 'process', color: '#475569' },
        { id: 'ids',     label: 'IDS Engine',        sublabel: 'Alerts only, no block',   type: 'actor',   color: '#f59e0b' },
        { id: 'inline',  label: 'Inline IPS',        sublabel: 'All traffic passes thru', type: 'process', color: '#10b981' },
        { id: 'sig',     label: 'Signature Match?',  sublabel: 'Pattern detected?',       type: 'decision',color: '#f43f5e' },
        { id: 'drop',    label: 'DROP Packet',       sublabel: 'Attack blocked',          type: 'end',     color: '#f43f5e' },
        { id: 'pass',    label: 'PASS Packet',       sublabel: 'Clean traffic',           type: 'end',     color: '#10b981' },
      ],
      edges: [
        { from: 'traffic', to: 'tap',    label: 'Copy' },
        { from: 'tap',     to: 'ids',    label: 'Analyze' },
        { from: 'traffic', to: 'inline', label: 'Direct' },
        { from: 'inline',  to: 'sig',    label: 'Inspect' },
        { from: 'sig',     to: 'drop',   label: 'Yes (attack)' },
        { from: 'sig',     to: 'pass',   label: 'No (clean)' },
      ],
    },

    quiz: [
      {
        question: 'What is the main operational difference between an IDS and an IPS?',
        options: [
          'IDS uses signatures; IPS uses anomaly detection only',
          'IDS passively monitors and alerts; IPS sits inline and can actively block traffic',
          'IPS only works on encrypted traffic; IDS handles plaintext',
          'IDS is deployed at the endpoint; IPS is only network-based',
        ],
        correctIndex: 1,
        explanation: 'IDS (Intrusion Detection System) receives a copy of traffic (via TAP or SPAN port) and generates alerts — it cannot block traffic. IPS (Intrusion Prevention System) sits inline in the traffic path and can actively drop malicious packets before they reach the destination. The trade-off is that IPS adds latency and can cause outages if misconfigured.',
      },
    ],

    overview: `Network-based intrusion detection and prevention systems (NIDS/NIPS) provide deep packet inspection beyond what stateful firewalls offer. Snort and Suricata are the dominant open-source platforms, using rule-based detection with PCRE regex content matching and flow-based anomaly detection.`,
    keyConcepts: [
      {
        title: 'Snort Rule Anatomy',
        explanation: 'Format: action proto src_ip src_port -> dst_ip dst_port (msg; content; pcre; threshold; sid; rev). Actions: alert (log+notify), drop (IPS only), pass (whitelist). Content matching uses Boyer-Moore algorithm for performance.',
        command: 'alert tcp $EXTERNAL_NET any -> $HOME_NET 445 (msg:"ETERNALBLUE MS17-010 SMB"; flow:to_server; content:"|00 00 00 00 00 00 00|"; depth:16; sid:41978; rev:1;)',
      },
      {
        title: 'Anomaly vs Signature Detection Trade-offs',
        explanation: 'Signatures: low false positives, detect known threats only, require constant updates. Anomaly: detects novel/zero-day attacks, high false positives during learning phase, requires accurate baseline. Most production systems use both.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Snort',
        context: 'Writing a custom Snort rule to detect a reverse shell beacon',
        configSnippet: '# Detect common reverse shell patterns (Metasploit default)\nalert tcp $HOME_NET any -> $EXTERNAL_NET 4444 (msg:"MALWARE Metasploit Reverse Shell Port 4444"; flow:established,to_server; dsize:>0; threshold:type both, track by_src, count 3, seconds 60; sid:9000001; rev:1;)',
        notes: 'Port 4444 is Metasploit\'s default listener port. Threshold prevents alert storms.',
      },
    ],
    commonPitfalls: [
      'Deploying IPS rules without tuning thresholds — default rulesets generate thousands of false positives and overwhelm SOC analysts.',
      'Not inspecting TLS traffic — most modern attacks hide in HTTPS. Requires TLS inspection proxy upstream of IPS.',
      'Over-relying on signature-based detection — zero-day attacks evade all signatures by definition.',
    ],
  },

  // ─── TIER 2 ────────────────────────────────────────────────────────────────
  {
    id: 'ngfw-app-layer',
    slug: 'next-gen-firewall-app-id-user-id',
    tierId: 'tier-2',
    tierName: 'Tier 2: Enterprise NGFW & Zero Trust Architecture',
    title: 'Next-Generation Firewall: App-ID, User-ID & SSL Inspection',
    category: 'Enterprise NGFW',
    summary: 'NGFW App-ID engine (Layer 7 classification), User-ID (LDAP/AD integration), Decryption policy (SSL Forward Proxy), Security Profiles (AV, Vulnerability, URL Filtering).',
    estimatedMinutes: 65,
    difficulty: 'Advanced',
    prerequisites: ['stateful-filtering-nat', 'ids-ips-signatures'],
    certAlignments: ['PCNSA', 'PCNSE', 'FCF / NSE 4', 'CCNP Security (350-701 SCOR)'],
    rfcs: [],

    beginner: {
      whatIsIt: `A traditional firewall asks: "What port is this on?" A Next-Generation Firewall (NGFW) asks: "What application is this, who is the user, and is it safe?" NGFW identifies 3,000+ applications regardless of port or encryption. It knows Facebook, Netflix, BitTorrent, and SQL injection even if they all travel on port 443.`,
      whyItMatters: `Attackers routinely use port 80 and 443 (web ports) to hide malicious traffic because old firewalls allow these ports for web browsing. NGFWs see through this by identifying actual application signatures, not just ports. Without NGFW, an attacker can run a command-and-control server on port 443 and bypass your perimeter.`,
      realWorldAnalogy: `A traditional firewall is like a nightclub bouncer who checks if you're over 18 (correct port). An NGFW bouncer also checks your ID (who you are), looks at your clothes (application identity), and checks a watchlist (threat signatures). Even if you're over 18 (correct port), you're not getting in if you're on the watchlist (known malicious signature).`,
      commonMisconception: `"App-ID blocks all unknown applications by default." Not true — unknown applications get classified as "unknown-tcp" or "unknown-udp" and a policy decision must be made to block or allow them. Best practice: block all unknown applications explicitly with a catch-all deny rule.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'App-ID: Application Identification Engine',
        description: 'When traffic first arrives, NGFW applies App-ID — it analyzes the application\'s behavioral signatures, protocol decoding, and heuristics to identify what application it is (not just what port it\'s on).',
        detail: 'App-ID uses: signatures (byte patterns), decoders (protocol parsing), heuristics (behavioral patterns). Example: Identifies "facebook-base" even on port 443 by matching Facebook\'s SSL certificate CN and API patterns.',
        tip: 'App-ID reclassification: initial connection looks like "web-browsing" (port 443) then reclassifies to "youtube" once the application is identified.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'User-ID: Who is generating the traffic?',
        description: 'User-ID maps IP addresses to Active Directory usernames. Security policies can now say: "Allow Marketing group to access social media. Block IT department from accessing gaming sites."',
        detail: 'User-ID uses: WMI (reading Windows security events), Syslog parsing, Captive Portal, GlobalProtect VPN. The firewall maintains an IP-to-Username mapping table.',
        tip: 'User-ID requires domain admin credentials on Palo Alto to read AD security event logs — protect these credentials carefully.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'SSL/TLS Decryption — seeing inside HTTPS',
        description: 'SSL Forward Proxy: NGFW intercepts HTTPS sessions, decrypts them, inspects content for threats, re-encrypts with a corporate CA certificate, and forwards to the server.',
        detail: 'Requires: (1) Corporate CA certificate installed on NGFW. (2) Corporate CA trusted by all endpoints (via GPO). (3) Decryption policy defining which traffic to decrypt (not banking/healthcare for privacy).',
        tip: 'Decryption is computationally expensive — size your NGFW for decryption throughput, not just total throughput specs.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Security Profiles — what to do with identified threats',
        description: 'After App-ID identifies traffic, Security Profiles inspect content: Antivirus (file scanning), Vulnerability Protection (IPS), Anti-Spyware (C2 detection), URL Filtering (web categories), File Blocking.',
        detail: 'Profiles are attached to Security policy rules. Best practice: never allow traffic without attaching at minimum Vulnerability Protection and Anti-Spyware profiles.',
        tip: 'Palo Alto WildFire submits unknown files to a cloud sandbox for behavioral analysis — zero-day detection.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Blocking Malware on Port 443',
        scenario: 'Malware on an employee\'s laptop connects to a C2 server over HTTPS (port 443)',
        howItApplies: 'Traditional firewall: allows it (port 443 = web traffic). NGFW with SSL inspection: decrypts the HTTPS traffic, App-ID identifies it as "unknown-ssl" (not a known browser application), Anti-Spyware profile matches C2 beacon patterns, blocks the connection and generates an alert. The malware is isolated from its command-and-control server.',
        emoji: '🦠',
      },
    ],

    flowDiagram: {
      title: 'NGFW Traffic Processing Order (Palo Alto PAN-OS)',
      description: 'Palo Alto processes every packet through a specific ordered pipeline. Understanding this order is critical for policy design.',
      layout: 'vertical',
      nodes: [
        { id: 'pkt',   label: 'Incoming Packet',    sublabel: 'Hits interface',         type: 'start',   color: '#06b6d4' },
        { id: 'nat',   label: 'NAT Policy',         sublabel: 'Evaluated first',        type: 'process', color: '#f59e0b' },
        { id: 'sec',   label: 'Security Policy',    sublabel: 'Allow / Deny / Drop',    type: 'decision',color: '#10b981' },
        { id: 'appid', label: 'App-ID',             sublabel: 'Identify application',   type: 'process', color: '#8b5cf6' },
        { id: 'dec',   label: 'Decryption Policy',  sublabel: 'Decrypt SSL?',           type: 'decision',color: '#f59e0b' },
        { id: 'prof',  label: 'Security Profiles',  sublabel: 'AV/IPS/URL/C2',         type: 'process', color: '#f43f5e' },
        { id: 'allow', label: 'Traffic Forwarded',  sublabel: 'Clean and allowed',      type: 'end',     color: '#10b981' },
      ],
      edges: [
        { from: 'pkt',   to: 'nat',   },
        { from: 'nat',   to: 'sec',   },
        { from: 'sec',   to: 'appid', label: 'Allowed zone/IP' },
        { from: 'appid', to: 'dec',   label: 'App identified' },
        { from: 'dec',   to: 'prof',  label: 'Inspect content' },
        { from: 'prof',  to: 'allow', label: 'No threats found' },
      ],
    },

    quiz: [
      {
        question: 'What is the primary advantage of NGFW App-ID over traditional port-based firewall rules?',
        options: [
          'App-ID is faster because it skips deep packet inspection',
          'App-ID identifies applications by behavior and signatures regardless of port, preventing port evasion',
          'App-ID only works with encrypted traffic',
          'App-ID replaces the need for security profiles',
        ],
        correctIndex: 1,
        explanation: 'App-ID uses behavioral signatures, protocol decoding, and heuristics to identify applications regardless of which port they run on. This prevents "port evasion" — where attackers run malicious tools on common allowed ports like 80 or 443 to bypass traditional port-based firewall rules.',
      },
    ],

    overview: `Next-Generation Firewalls transcend port/IP-based filtering by integrating App-ID (application classification), User-ID (identity mapping), Content-ID (threat inspection), and decryption capabilities. They enforce policy based on application, user identity, content type, and threat intelligence rather than just port numbers.`,
    keyConcepts: [
      {
        title: 'PAN-OS Security Policy Evaluation Order',
        explanation: 'NAT Policy → Security Policy → App-ID Reclassification → Decryption Policy → Security Profile inspection. NAT is evaluated before security policy, meaning security rules must reference post-NAT destination zones.',
      },
      {
        title: 'SSL Forward Proxy Mechanics',
        explanation: 'NGFW terminates the SSL session from client, presents a dynamically generated certificate signed by internal CA, establishes new SSL to destination, inspects decrypted content, and re-encrypts. Requires corporate CA trusted by endpoints.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Palo Alto',
        context: 'Creating a Zero Trust security rule with App-ID and User-ID',
        configSnippet: 'set rulebase security rules "Allow-Finance-SAP" from Trust to DataCenter\nset rulebase security rules "Allow-Finance-SAP" source-user "domain\\Finance-Group"\nset rulebase security rules "Allow-Finance-SAP" application sap\nset rulebase security rules "Allow-Finance-SAP" service application-default\nset rulebase security rules "Allow-Finance-SAP" action allow\nset rulebase security rules "Allow-Finance-SAP" profile-setting profiles vulnerability "Strict" anti-spyware "Strict"',
        notes: 'Policy allows SAP application only from Finance AD group to DataCenter zone, with Strict security profiles attached.',
      },
      {
        vendor: 'Fortinet',
        context: 'Configuring Deep Packet Inspection (SSL/TLS) certificate inspection',
        configSnippet: 'config firewall ssl-ssh-profile\n edit "corporate-inspection"\n  config https\n   set ports 443 8443\n   set status deep-inspection\n  end\n  set caname "corporate-ca-cert"\n next\nend',
        notes: 'deep-inspection performs full SSL proxy decryption. certificate-inspection only validates the certificate without decrypting content.',
      },
    ],
    commonPitfalls: [
      'Attaching broad "any" application rules with no security profiles — defeats NGFW purpose entirely.',
      'Not sizing NGFW for SSL inspection throughput — decryption requires 3-8x more CPU than plain traffic.',
      'Blocking all unknown applications without a process to allow legitimate unknown apps — creates operational friction.',
    ],
  },

  {
    id: 'zero-trust-sase-ztna',
    slug: 'zero-trust-sase-ztna-architecture',
    tierId: 'tier-2',
    tierName: 'Tier 2: Enterprise NGFW & Zero Trust Architecture',
    title: 'Zero Trust Architecture, SASE & ZTNA',
    category: 'Modern Architecture',
    summary: 'Zero Trust principles (never trust, always verify), SASE convergence (SD-WAN + SSE), ZTNA vs VPN comparison, and continuous access evaluation.',
    estimatedMinutes: 60,
    difficulty: 'Advanced',
    prerequisites: ['ngfw-app-layer', 'applied-crypto-pki'],
    certAlignments: ['PCNSE', 'CISSP', 'CCNP Security (350-701 SCOR)', 'CompTIA SecurityX (CAS-005)'],
    rfcs: [],

    beginner: {
      whatIsIt: `The old network security model assumed: "Everything inside the firewall is trusted." Zero Trust says: "Trust nothing and nobody by default — verify every user, every device, every request, every time." This is critical because modern attacks start inside the network (phishing, supply chain, insider threats) and traditional perimeter firewalls can't stop them.`,
      whyItMatters: `COVID-19 destroyed the network perimeter. Employees work from home, cloud apps run outside corporate data centers, and mobile devices access resources from anywhere. Zero Trust provides security that works regardless of where users and resources are located — verifying every access attempt based on identity, device health, and context.`,
      realWorldAnalogy: `Traditional security is like a castle with a moat — once you're inside (VPN), you're trusted everywhere. Zero Trust is like a secure government building where you need to badge through every door, every floor, every room — even if you already entered the building. The badge isn't enough; each door also checks your job role and whether you have permission to be there right now.`,
      commonMisconception: `"Zero Trust is a product you can buy." Zero Trust is a security architecture philosophy — a way of designing systems. No single product delivers Zero Trust. It requires combining identity (MFA, SSO), device management (MDM, EDR), network controls (ZTNA, microsegmentation), and continuous monitoring.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'The five Zero Trust pillars',
        description: 'Identity (verify who), Device (verify device health), Network (limit access to what\'s needed), Application (authorize specific apps), Data (classify and protect data).',
        detail: 'NIST SP 800-207 defines Zero Trust Architecture. Key principle: grant minimum required access, verify continuously, assume breach.',
        tip: 'Start with Identity — strong MFA is the highest-ROI Zero Trust control. 99.9% of account takeover attacks are stopped by MFA.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'ZTNA vs Traditional VPN',
        description: 'Traditional VPN gives network-level access — once connected, you can reach any IP on the corporate network. ZTNA provides application-level access — you can only reach specific applications you\'re authorized for, nothing else.',
        detail: 'ZTNA uses an identity-aware proxy. Users authenticate to the proxy; the proxy forwards only authorized application connections. The backend server\'s IP is never exposed to the user.',
        tip: 'With ZTNA, a compromised laptop can only access the specific apps approved for that user — lateral movement is impossible without additional authorization.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'SASE — Security and Networking Converged',
        description: 'SASE (Secure Access Service Edge) delivers security (CASB, SWG, ZTNA, FWaaS) and networking (SD-WAN) as a cloud service. Users connect to the nearest SASE PoP, which applies all security policies before connecting to apps.',
        detail: 'SASE replaces the "backhauling" model — where all branch traffic was sent back to HQ for security inspection, creating latency. With SASE, inspection happens at the cloud edge near the user.',
        tip: 'Key SASE vendors: Palo Alto Prisma SASE, Zscaler ZIA/ZPA, Cloudflare SASE, Cato Networks.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Continuous access evaluation',
        description: 'Zero Trust doesn\'t just check access at login — it continuously re-evaluates: Did the device become unhealthy? Did the user\'s location change suddenly? Did their risk score increase? Access can be revoked in real-time.',
        detail: 'Microsoft CAE (Continuous Access Evaluation) revokes Azure AD tokens within minutes when user account changes (password reset, MFA disabled, location change to high-risk country).',
        tip: 'Traditional tokens are valid for hours even after account compromise. CAE limits the attack window to minutes.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'SolarWinds Attack — Why Perimeter Security Failed',
        scenario: '2020: Attackers compromised SolarWinds build pipeline, delivered malicious updates to 18,000+ organizations',
        howItApplies: 'Once inside the network via the "trusted" SolarWinds agent, attackers moved laterally because the internal network trusted all internal traffic. A Zero Trust architecture with microsegmentation would have: isolated each system, required explicit authorization for every lateral connection, detected anomalous authentication patterns, and limited blast radius to only what the compromised host was authorized to access.',
        emoji: '☀️',
      },
    ],

    flowDiagram: {
      title: 'ZTNA vs VPN Access Model',
      description: 'VPN gives full network access. ZTNA provides application-level access only to authorized resources.',
      layout: 'vertical',
      nodes: [
        { id: 'user',  label: 'Remote User',      sublabel: 'With MFA verified',       type: 'actor',   color: '#06b6d4' },
        { id: 'vpn',   label: 'VPN Gateway',      sublabel: 'Full network access',     type: 'process', color: '#f43f5e' },
        { id: 'corp',  label: 'Entire Corp Network',sublabel: 'All IPs accessible',    type: 'data',    color: '#f43f5e' },
        { id: 'ztna',  label: 'ZTNA Broker',      sublabel: 'Identity-aware proxy',    type: 'process', color: '#10b981' },
        { id: 'app1',  label: 'Authorized App',   sublabel: 'SAP ERP — allowed',       type: 'end',     color: '#10b981' },
        { id: 'app2',  label: 'Blocked Resource', sublabel: 'DB Server — not allowed', type: 'end',     color: '#f43f5e' },
      ],
      edges: [
        { from: 'user', to: 'vpn',  label: 'Old model' },
        { from: 'vpn',  to: 'corp', label: 'Full access' },
        { from: 'user', to: 'ztna', label: 'ZTNA model' },
        { from: 'ztna', to: 'app1', label: 'Authorized' },
        { from: 'ztna', to: 'app2', label: 'Blocked', style: 'dashed' },
      ],
    },

    quiz: [
      {
        question: 'What is the core philosophical difference between traditional perimeter security and Zero Trust?',
        options: [
          'Zero Trust uses stronger encryption than perimeter security',
          'Perimeter security trusts all inside traffic; Zero Trust verifies every access request regardless of location',
          'Zero Trust only applies to cloud environments',
          'Perimeter security uses firewalls; Zero Trust uses VPNs',
        ],
        correctIndex: 1,
        explanation: 'Traditional perimeter security operates on "trust but verify inside the perimeter" — once you\'re inside the firewall/VPN, you\'re largely trusted. Zero Trust operates on "never trust, always verify" — every access request is verified based on identity, device health, and context, regardless of whether the request comes from inside or outside the network perimeter.',
      },
    ],

    overview: `Zero Trust Architecture (ZTA) eliminates implicit trust based on network location. Every access request is authenticated, authorized, and encrypted. SASE converges SD-WAN with cloud-delivered security services, enabling consistent policy enforcement regardless of user location or application hosting.`,
    keyConcepts: [
      {
        title: 'NIST SP 800-207 Zero Trust Tenets',
        explanation: 'All resources treated as external. All communication secured regardless of network location. Access per-session based on dynamic policy. Monitor and measure integrity and security posture of all assets. Authenticate and authorize dynamically before granting access.',
      },
      {
        title: 'ZTNA vs VPN — Access Granularity',
        explanation: 'VPN: Layer 3 network access — user can ping any IP on the network segment. ZTNA: Application-level proxy — user can only access specific application URLs/ports they\'re authorized for. Backend IPs never exposed.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Palo Alto',
        context: 'Prisma Access ZTNA 2.0 — Application-based access policy',
        configSnippet: '# Prisma Access Application Policy\n# Allow Finance users to access SAP from managed devices only\napplication: sap-b1\nusers: finance-group@company.com\ndevice-posture: managed-device-compliant\nlocations: any\naction: allow\nthreat-prevention: enabled',
        notes: 'ZTNA 2.0 adds continuous trust verification and deep inspection even for allowed connections.',
      },
    ],
    commonPitfalls: [
      'Treating Zero Trust as a one-time project — it\'s a continuous maturity journey requiring ongoing measurement.',
      'Implementing ZTNA without device posture checking — a compromised managed device bypasses all identity-based controls.',
      'Confusing SASE with SD-WAN — SD-WAN is only the networking component; SASE adds the full security stack.',
    ],
  },

  {
    id: 'microsegmentation-nac',
    slug: 'microsegmentation-802-1x-nac-policy',
    tierId: 'tier-2',
    tierName: 'Tier 2: Enterprise NGFW & Zero Trust Architecture',
    title: 'Microsegmentation & 802.1X Network Access Control',
    category: 'Access Control',
    summary: '802.1X EAP authentication (EAP-TLS, PEAP-MSCHAPv2), RADIUS/TACACS+ policy engines, microsegmentation with host-based firewalls, and East-West traffic control.',
    estimatedMinutes: 55,
    difficulty: 'Advanced',
    prerequisites: ['zero-trust-sase-ztna', 'applied-crypto-pki'],
    certAlignments: ['CCNP Security (350-701 SCOR)', 'PCNSE', 'CompTIA SecurityX (CAS-005)'],
    rfcs: [
      { number: 'RFC 3748', title: 'Extensible Authentication Protocol (EAP)', url: 'https://datatracker.ietf.org/doc/html/rfc3748' },
      { number: 'RFC 2865', title: 'Remote Authentication Dial In User Service (RADIUS)', url: 'https://datatracker.ietf.org/doc/html/rfc2865' },
    ],

    beginner: {
      whatIsIt: `Microsegmentation is the practice of dividing a network into tiny zones with strict access controls between them — instead of one big flat network where everything can talk to everything. 802.1X is the standard that controls WHO can connect to your network in the first place. Before any device gets on the network, it must authenticate and prove it has the right to be there.`,
      whyItMatters: `In traditional flat networks, once an attacker gets one foothold (one compromised device), they can scan and attack everything on the same network segment. Microsegmentation limits this — a compromised device in the marketing VLAN can't even reach the database servers in another segment without going through a firewall that denies the connection.`,
      realWorldAnalogy: `Imagine a hospital: without microsegmentation, it's one big open floor where anyone who gets inside can walk anywhere. With microsegmentation, there are locked doors between: patient rooms, ICU, pharmacy, records room, server room. Even if a visitor gets in the front door (network access), they can't reach the server room (database servers) without specific authorization.`,
      commonMisconception: `"802.1X is too complex to deploy." While 802.1X has many components, certificate-based EAP-TLS (using machine certificates from your PKI) is the most secure and can be automated via Group Policy. The complexity is a one-time setup cost that delivers permanent protection against unauthorized device access.`,
    },

    stepByStep: [
      {
        step: 1,
        title: '802.1X roles: Supplicant, Authenticator, Authentication Server',
        description: 'Supplicant = the device trying to connect (your laptop). Authenticator = the switch or WiFi AP (it blocks access until authentication succeeds). Authentication Server = RADIUS server (validates credentials and makes the policy decision).',
        detail: 'The switch blocks all traffic except EAP authentication packets until RADIUS says "OK". Then it opens the port/assigns the VLAN.',
        tip: 'Before 802.1X success, the switch port carries only EAPOL (EAP over LAN) frames — nothing else.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'EAP Methods: EAP-TLS vs PEAP-MSCHAPv2',
        description: 'EAP-TLS: Both client and server authenticate with certificates — most secure. Requires deploying machine certificates (via PKI/GPO). PEAP-MSCHAPv2: Server has certificate, client uses AD username/password — easier to deploy but weaker.',
        detail: 'EAP-TLS eliminates credential phishing — there\'s no password to steal. Even if an attacker has your AD password, they can\'t authenticate without the device certificate.',
        tip: 'Always use EAP-TLS for managed devices. PEAP-MSCHAPv2 is acceptable for guest/BYOD with captive portal.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'RADIUS dynamic VLAN assignment',
        description: 'After successful authentication, RADIUS can tell the switch: "Put this device in VLAN 30." The switch dynamically assigns the VLAN based on user identity, device type, or compliance status — not just which physical port they plugged into.',
        detail: 'RADIUS attributes: Tunnel-Type=VLAN (13), Tunnel-Medium-Type=802 (6), Tunnel-Private-Group-ID=VLAN-ID. Cisco ISE, FreeRADIUS, and NPS all support this.',
        tip: 'Use dynamic VLAN assignment to automatically quarantine non-compliant devices into a remediation VLAN with limited internet access.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Medical Device Segmentation',
        scenario: 'A hospital needs to isolate MRI machines and infusion pumps from the general IT network',
        howItApplies: 'IoT/medical devices often can\'t run 802.1X supplicants. Solution: MAC Authentication Bypass (MAB) — the switch sends the device\'s MAC address to RADIUS, which matches it against an approved device database and assigns it to the Medical-Devices VLAN. Microsegmentation prevents the MRI VLAN from communicating with any other VLAN except the specific medical records system it needs.',
        emoji: '🏥',
      },
    ],

    flowDiagram: {
      title: '802.1X Authentication Flow',
      description: 'Three-party handshake: device proves identity to RADIUS, RADIUS tells switch to open the port.',
      layout: 'vertical',
      nodes: [
        { id: 'sup',  label: 'Supplicant',         sublabel: 'Laptop / Device',          type: 'actor',   color: '#06b6d4' },
        { id: 'auth', label: 'Authenticator',       sublabel: 'Switch / WiFi AP',         type: 'process', color: '#10b981' },
        { id: 'eap',  label: 'EAP Exchange',        sublabel: 'Identity + credentials',   type: 'data',    color: '#f59e0b' },
        { id: 'rad',  label: 'RADIUS Server',       sublabel: 'Cisco ISE / NPS',          type: 'actor',   color: '#8b5cf6' },
        { id: 'pol',  label: 'Policy Decision',     sublabel: 'Accept + VLAN assignment', type: 'decision',color: '#f59e0b' },
        { id: 'open', label: 'Port Opened',         sublabel: 'VLAN 30 assigned',         type: 'end',     color: '#10b981' },
      ],
      edges: [
        { from: 'sup',  to: 'auth', label: 'EAPOL-Start' },
        { from: 'auth', to: 'eap',  label: 'EAP-Request' },
        { from: 'eap',  to: 'rad',  label: 'RADIUS Access-Request' },
        { from: 'rad',  to: 'pol',  label: 'Validate creds' },
        { from: 'pol',  to: 'open', label: 'RADIUS Access-Accept' },
      ],
    },

    quiz: [
      {
        question: 'Why is EAP-TLS considered more secure than PEAP-MSCHAPv2 for 802.1X?',
        options: [
          'EAP-TLS is faster to configure and deploy',
          'EAP-TLS uses mutual certificate authentication, eliminating password-based credential phishing',
          'PEAP-MSCHAPv2 does not use encryption',
          'EAP-TLS works without a RADIUS server',
        ],
        correctIndex: 1,
        explanation: 'EAP-TLS uses X.509 certificates for both client and server authentication. There is no password to steal or phish. PEAP-MSCHAPv2 only requires a password (which can be phished or cracked offline using ASLEAP if the inner exchange is captured from a rogue AP). EAP-TLS is the gold standard but requires machine certificate deployment via PKI.',
      },
    ],

    overview: `802.1X provides port-based network access control by requiring authentication before any network access is granted. Combined with RADIUS dynamic VLAN assignment and microsegmentation policies, it enforces device identity and compliance status at the network layer.`,
    keyConcepts: [
      {
        title: '802.1X Three-Party Model',
        explanation: 'Supplicant (client) ↔ Authenticator (switch/AP) ↔ Authentication Server (RADIUS). Switch acts as policy enforcement point — blocks all traffic except EAPOL until RADIUS approves. RADIUS returns Access-Accept with VLAN assignment attributes.',
      },
      {
        title: 'RADIUS vs TACACS+ Protocol Differences',
        explanation: 'RADIUS: UDP, encrypts only password, combines Authentication + Authorization. TACACS+: TCP, encrypts entire payload, separates Authentication/Authorization/Accounting (AAA). TACACS+ preferred for device administration (Cisco IOS, network equipment). RADIUS preferred for 802.1X network access control.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Cisco',
        context: '802.1X with dynamic VLAN assignment on Catalyst switch',
        configSnippet: 'aaa new-model\naaa authentication dot1x default group radius\naaa authorization network default group radius\n\nradius server ISE\n address ipv4 10.0.1.100 auth-port 1812 acct-port 1813\n key Secr3t#RADIUS\n\ndot1x system-auth-control\n\ninterface GigabitEthernet 0/1\n description "User Access Port"\n switchport mode access\n authentication port-control auto\n dot1x pae authenticator\n spanning-tree portfast',
        notes: 'RADIUS returns Tunnel-Private-Group-ID attribute to dynamically assign VLAN. Ensure portfast is enabled for faster 802.1X completion.',
      },
    ],
    commonPitfalls: [
      'Not configuring MAB (MAC Authentication Bypass) for non-802.1X-capable devices — printers and IP phones will fail to connect.',
      'Using a single RADIUS server without redundancy — RADIUS failure means NO devices can authenticate, causing widespread outage.',
    ],
  },

  {
    id: 'nspm-policy-lifecycle',
    slug: 'nspm-algosec-firewall-policy-lifecycle',
    tierId: 'tier-2',
    tierName: 'Tier 2: Enterprise NGFW & Zero Trust Architecture',
    title: 'Network Security Policy Management (NSPM)',
    category: 'Policy Governance',
    summary: 'Firewall rule lifecycle governance, AlgoSec/Tufin orchestration, policy optimization (shadow rules, redundant ACEs), and change management workflows.',
    estimatedMinutes: 45,
    difficulty: 'Advanced',
    prerequisites: ['ngfw-app-layer'],
    certAlignments: ['CCNP Security (350-701 SCOR)', 'CISSP', 'PCNSE'],
    rfcs: [],

    beginner: {
      whatIsIt: `Enterprise firewalls accumulate thousands of rules over years — rules added for temporary projects, never cleaned up. NSPM (Network Security Policy Management) is the discipline of keeping those rules organized, auditable, and optimized. It's the difference between a firewall that's a security tool and one that's just a compliance checkbox with 10,000 rules nobody understands.`,
      whyItMatters: `Firewall rule bloat is a serious security risk. "Shadow rules" — rules that are never matched because a previous rule already catches the traffic — create false confidence. Overly permissive rules ("allow any any") grant access beyond what's needed. NSPM tools analyze thousands of rules across dozens of firewalls simultaneously to find and fix these problems.`,
      realWorldAnalogy: `Imagine a security policy document that's been edited by 50 people over 10 years with no version control. Some rules contradict each other, some are never read, some are from people who left the company. NSPM is the process of auditing and cleaning up this document — with automated tools that can analyze 10,000 rules in seconds and find every conflict, duplicate, and unnecessary exception.`,
      commonMisconception: `"More firewall rules = more security." Actually, more rules = more complexity = more risk of misconfiguration = potential security gaps. The goal is minimum required rules that are as specific as possible.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Common firewall rule quality problems',
        description: 'Shadow rules: Rule A covers all traffic that Rule B would also match — Rule B is never evaluated. Redundant rules: duplicate rules doing the same thing. Overly broad rules: "allow any any" on any zone. Unused rules: rules with 0 matches in 90 days.',
        tip: 'NSPM tools like AlgoSec FireFlow or Tufin SecureTrack can automatically identify all these issues across your entire firewall estate.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Change management with NSPM',
        description: 'Every firewall rule change goes through a workflow: Request (who needs what access, why) → Risk Analysis (automated: does this create attack paths?) → Approval → Implementation → Verification → Certification.',
        detail: 'NSPM tools integrate with ITSM systems (ServiceNow) to automate tickets, track changes, and maintain audit trails for compliance.',
        tip: 'Automated risk analysis catches: "This rule would allow external access to your database server" before the rule is deployed.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Policy optimization cycle',
        description: 'Regular (quarterly) firewall optimization: identify unused rules (no hits in 90 days), remove shadow rules, tighten broad object definitions, move specific rules above broader ones.',
        detail: 'PCI-DSS, HIPAA, and SOC 2 all require regular firewall rule review as part of access control compliance. NSPM tools generate audit reports automatically.',
        tip: 'Never delete "unused" rules without verifying — some rules handle rare traffic patterns that only appear seasonally.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Finding 3000 Unused Firewall Rules',
        scenario: 'A bank\'s firewall estate has accumulated 15 years of rules',
        howItApplies: 'AlgoSec analysis finds: 30% of rules have zero traffic hits in 90 days, 15% are shadowed by earlier rules, 5% are pure duplicates, 20% have overly broad source/destination definitions. After cleanup: fewer rules, easier auditing, faster firewall processing, reduced attack surface.',
        emoji: '🏦',
      },
    ],

    flowDiagram: {
      title: 'Firewall Change Request Lifecycle',
      description: 'Proper change management ensures every firewall rule is justified, risk-analyzed, approved, and documented.',
      layout: 'vertical',
      nodes: [
        { id: 'req',    label: 'Access Request',    sublabel: 'Who needs what access?',  type: 'start',   color: '#06b6d4' },
        { id: 'risk',   label: 'Automated Risk',    sublabel: 'Attack path analysis',    type: 'process', color: '#f59e0b' },
        { id: 'approve',label: 'Security Review',   sublabel: 'Human approval',          type: 'decision',color: '#10b981' },
        { id: 'impl',   label: 'Implementation',    sublabel: 'Rule deployed to FW',     type: 'process', color: '#8b5cf6' },
        { id: 'verify', label: 'Verification',      sublabel: 'Traffic flows as expected',type: 'process', color: '#06b6d4' },
        { id: 'cert',   label: 'Certification',     sublabel: 'Quarterly recertification',type: 'end',    color: '#10b981' },
      ],
      edges: [
        { from: 'req',     to: 'risk',    },
        { from: 'risk',    to: 'approve', },
        { from: 'approve', to: 'impl',    label: 'Approved' },
        { from: 'impl',    to: 'verify',  },
        { from: 'verify',  to: 'cert',    },
        { from: 'cert',    to: 'req',     label: 'Review cycle', style: 'dashed' },
      ],
    },

    quiz: [
      {
        question: 'What is a "shadow rule" in a firewall policy?',
        options: [
          'A rule that blocks traffic from shadow IT applications',
          'A rule that is never matched because a previous broader rule already catches all its traffic',
          'A hidden rule inserted by an attacker',
          'A rule that only activates during maintenance windows',
        ],
        correctIndex: 1,
        explanation: 'A shadow rule is a firewall rule that can never be matched because a rule earlier in the policy already covers all the traffic the shadow rule would match. Shadow rules create false confidence (you think you have a specific rule) while adding unnecessary complexity. NSPM tools automatically detect and flag shadow rules for review and removal.',
      },
    ],

    overview: `NSPM platforms (AlgoSec, Tufin, FireMon) provide centralized visibility across heterogeneous firewall estates — enabling automated risk analysis, change workflows, compliance reporting, and policy optimization at scale.`,
    keyConcepts: [
      {
        title: 'Rule Quality Anti-Patterns',
        explanation: 'Shadow rules (never evaluated), Redundant rules (duplicates), Any-Any rules (overly permissive), Unused rules (zero hits), Disabled rules (dead configuration), Overly broad objects (10.0.0.0/8 instead of 10.1.5.0/24).',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Palo Alto',
        context: 'Finding unused security rules with PAN-OS Hit Count',
        configSnippet: '> show rule-hit-count vsys vsys1 rule-base security rules all\n# Output shows hit count per rule\n# Rules with 0 hits for 90+ days are candidates for removal\n# Review before deleting - some rules handle rare event traffic',
        notes: 'PAN-OS maintains hit counts from last commit. Reset with "clear rule-hit-count".',
      },
    ],
    commonPitfalls: [
      'Deleting "unused" rules without a business impact analysis — a rule may handle critical backup or DR traffic that runs infrequently.',
      'Treating NSPM as a one-time project — rule entropy returns quickly without continuous governance processes.',
    ],
  },

  // ─── TIER 3 ────────────────────────────────────────────────────────────────
  {
    id: 'soc-siem-hunting',
    slug: 'soc-siem-threat-hunting-detection',
    tierId: 'tier-3',
    tierName: 'Tier 3: SOC Operations, SIEM/SOAR & Cloud Security',
    title: 'SOC Operations, SIEM Correlation & Threat Hunting',
    category: 'SOC & Detection',
    summary: 'SIEM log ingestion pipeline, Splunk SPL and Microsoft Sentinel KQL correlation rules, threat hunting methodologies, MITRE ATT&CK mapping, and alert triage.',
    estimatedMinutes: 70,
    difficulty: 'Advanced',
    prerequisites: ['ids-ips-signatures', 'linux-sys-socket-tooling'],
    certAlignments: ['CompTIA CySA+ (CS0-003)', 'GCIA', 'GCIH', 'GMON', 'Microsoft SC-200'],
    rfcs: [],

    beginner: {
      whatIsIt: `A SOC (Security Operations Center) is a team of security analysts who monitor an organization's systems 24/7 for attacks, breaches, and suspicious activity. A SIEM (Security Information and Event Management) is their central nervous system — it collects logs from every system (firewalls, endpoints, servers, cloud) and correlates them to detect threats that no single system could see alone.`,
      whyItMatters: `Individual security tools generate huge volumes of alerts in isolation. A SIEM connects the dots: "Firewall blocked port scan from 1.2.3.4, then endpoint saw 1.2.3.4 in email link, then user opened attachment from 1.2.3.4's domain." No single tool saw the whole picture — the SIEM correlates all three events into one incident.`,
      realWorldAnalogy: `Think of a SIEM as a city's 911 dispatch center. Police, fire, ambulance, traffic cameras, and burglar alarms all report in. Without the dispatch center, each call is isolated. With it, dispatchers see patterns: "Three calls from the same block in 10 minutes — probably a fire, send all units." Threat hunters are the detectives who look for crimes that haven't been reported yet.`,
      commonMisconception: `"A SIEM automatically catches all attacks." A SIEM is only as good as its detection rules and the logs it receives. If your firewall doesn't send logs, the SIEM is blind. If your detection rules only check for known signatures, you'll miss novel attacks. Threat hunting — proactive investigation — is required alongside automated detection.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Log collection and normalization',
        description: 'SIEM collects logs from: Firewalls (syslog), Endpoints (Windows Event Logs via agent), Cloud (AWS CloudTrail / Azure Monitor), DNS servers, Authentication systems (Active Directory). Logs are normalized into a common schema.',
        detail: 'Splunk uses sourcetype and index to categorize logs. Sentinel uses Data Connectors. Log volume is massive — a mid-size enterprise generates 10-100GB of logs per day. SIEM must efficiently index and search this.',
        tip: 'Critical logs: Windows Event ID 4624 (logon success), 4625 (logon failure), 4688 (process creation), 4698 (scheduled task created), firewall deny logs.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Correlation rules — connecting the dots',
        description: 'Rules define: "If event A and event B happen within X minutes, create an alert." Example: "5 failed logins followed by 1 successful login from the same IP in 10 minutes = potential brute force → create High severity alert."',
        detail: 'Splunk SPL: index=windows EventCode=4625 | stats count by src_ip | where count > 5\nSentinel KQL: SecurityEvent | where EventID == 4625 | summarize count() by IpAddress | where count_ > 5',
        tip: 'Every correlation rule should be mapped to a MITRE ATT&CK technique — this helps prioritize response and tracks coverage.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'MITRE ATT&CK Framework',
        description: 'ATT&CK is a knowledge base of 14 Tactics (the "why": Initial Access, Execution, Persistence...) and 200+ Techniques (the "how": Spearphishing, PowerShell, Registry Run Keys...). Map your detections to ATT&CK to measure coverage and find gaps.',
        detail: 'Example: T1078 "Valid Accounts" — an attacker using stolen credentials. Your detection: alerting on logins from unexpected geolocations or outside business hours for privileged accounts.',
        tip: 'Use ATT&CK Navigator (attack.mitre.org/navigator) to visualize which techniques your detections cover.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Threat hunting — proactive investigation',
        description: 'Threat hunting assumes breach and looks for attacker activity that automated rules missed. Hunters form hypotheses: "If an attacker is living off the land, they\'d use built-in tools like PowerShell or WMI." Then hunt for anomalous usage of those tools.',
        detail: 'Hunt for: Unusual PowerShell execution (encoded commands, network connections from PowerShell), Lateral movement (unusual admin logins between workstations), Data staging (large volumes of data copied to uncommon locations).',
        tip: 'Hunting playbooks: start with a hypothesis, search the data, investigate anomalies, turn findings into new detection rules.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Detecting a Brute Force Attack in Splunk',
        scenario: 'An attacker is trying to guess passwords on your VPN login page',
        howItApplies: 'Splunk SPL query: index=vpn action=failed | stats count by src_ip | where count > 50 | sort -count — This finds IPs with >50 failed VPN logins. Cross-reference with threat intel: if the IP is on a known threat intel list, auto-escalate to Critical. SOAR playbook automatically: blocks IP at perimeter firewall, creates ServiceNow incident, notifies SOC analyst.',
        emoji: '🔐',
      },
    ],

    flowDiagram: {
      title: 'SIEM Alert Triage Process',
      description: 'From raw log to closed incident — the analyst workflow for each SIEM alert.',
      layout: 'vertical',
      nodes: [
        { id: 'log',    label: 'Raw Logs',          sublabel: '10M+ events/day',         type: 'start',   color: '#06b6d4' },
        { id: 'siem',   label: 'SIEM Correlation',  sublabel: 'Rule matches = alert',    type: 'process', color: '#10b981' },
        { id: 'triage', label: 'Alert Triage',      sublabel: 'L1 Analyst reviews',      type: 'decision',color: '#f59e0b' },
        { id: 'fp',     label: 'False Positive',    sublabel: 'Close + tune rule',       type: 'end',     color: '#475569' },
        { id: 'esc',    label: 'Escalate to L2/L3', sublabel: 'Real threat suspected',   type: 'process', color: '#f43f5e' },
        { id: 'ir',     label: 'Incident Response', sublabel: 'Contain, investigate',    type: 'end',     color: '#f43f5e' },
      ],
      edges: [
        { from: 'log',    to: 'siem',   label: 'Indexed' },
        { from: 'siem',   to: 'triage', label: 'Alert fired' },
        { from: 'triage', to: 'fp',     label: 'False positive' },
        { from: 'triage', to: 'esc',    label: 'Confirmed threat' },
        { from: 'esc',    to: 'ir',     label: 'IR engaged' },
      ],
    },

    quiz: [
      {
        question: 'A SOC analyst sees 1,000 failed login alerts per day but finds 0 actual attacks. What is the primary problem?',
        options: [
          'The SIEM is not collecting enough logs',
          'The detection rule has a very high false positive rate and needs tuning',
          'The SOC team is not skilled enough to identify real attacks',
          'The SIEM needs more powerful hardware',
        ],
        correctIndex: 1,
        explanation: 'Alert fatigue from excessive false positives is one of the biggest SOC challenges. When analysts see 1,000 false positive alerts daily, they stop investigating them carefully — meaning real attacks get missed. The fix is tuning detection rules (adding context like business hours, privileged accounts, repeated failures from same IP) and enriching alerts with threat intelligence to separate noise from signal.',
      },
    ],

    overview: `SOC operations center on SIEM platforms that correlate events from across the enterprise. Effective detection requires both automated correlation rules (mapped to MITRE ATT&CK) and proactive threat hunting. SOAR platforms automate repetitive response tasks to reduce analyst burden and response time.`,
    keyConcepts: [
      {
        title: 'Splunk SPL Correlation Queries',
        explanation: 'index=wineventlog EventCode=4625 | bin _time span=10m | stats count by src_ip, _time | where count > 10 | join src_ip [search index=wineventlog EventCode=4624] | table _time, src_ip, user, count',
        command: 'index=wineventlog (EventCode=4624 OR EventCode=4625) | stats count(eval(EventCode=4625)) as failures, count(eval(EventCode=4624)) as successes by src_ip | where failures > 5 AND successes > 0',
      },
      {
        title: 'MITRE ATT&CK Coverage Mapping',
        explanation: 'Each detection rule should map to specific ATT&CK Technique IDs. Priority coverage: Initial Access (T1566 Phishing), Execution (T1059 Command Interpreter), Persistence (T1078 Valid Accounts), Lateral Movement (T1021 Remote Services), Exfiltration (T1041 C2 Channel).',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Splunk SPL — detecting impossible travel (authentication from two geographies simultaneously)',
        configSnippet: 'index=auth action=success\n| iplocation src_ip\n| stats earliest(_time) as first_time, latest(_time) as last_time, values(Country) as countries, dc(Country) as country_count by user\n| where country_count > 1\n| eval time_diff = last_time - first_time\n| where time_diff < 3600\n| table user, countries, time_diff',
        notes: 'Detects users authenticating from multiple countries within 1 hour — physically impossible, indicates credential compromise.',
      },
    ],
    commonPitfalls: [
      'Building detection rules without baselining — you can\'t detect anomalies without knowing what "normal" looks like.',
      'Not tuning rules after deployment — a new rule starts with high false positives and must be refined iteratively.',
      'Missing log sources — a SIEM is blind to any system not sending logs. Maintain a log source inventory and monitor for gaps.',
    ],
  },

  {
    id: 'cloud-vpc-security',
    slug: 'aws-azure-vpc-security-architecture',
    tierId: 'tier-3',
    tierName: 'Tier 3: SOC Operations, SIEM/SOAR & Cloud Security',
    title: 'Cloud Security: AWS VPC & Azure VNet Architecture',
    category: 'Cloud Security',
    summary: 'AWS VPC (Security Groups, NACLs, VPC Flow Logs, AWS WAF, GuardDuty), Azure VNet (NSGs, Azure Firewall, Defender for Cloud), and shared responsibility model.',
    estimatedMinutes: 65,
    difficulty: 'Advanced',
    prerequisites: ['stateful-filtering-nat', 'zero-trust-sase-ztna'],
    certAlignments: ['AWS SAA-C03 / SAP-C02', 'AZ-500', 'CompTIA SecurityX (CAS-005)', 'CCSP'],
    rfcs: [],

    beginner: {
      whatIsIt: `Cloud security applies all the same networking concepts you've learned (firewalls, VLANs, NAT) but in a software-defined environment where everything is managed through APIs and code, not physical hardware. AWS VPC and Azure VNet are your virtual networks in the cloud — you control who can talk to what, just like a physical network, but entirely through configuration.`,
      whyItMatters: `Cloud misconfiguration is the #1 cause of cloud data breaches. An S3 bucket accidentally set to "public" exposed millions of records at Capital One ($80M fine). An AWS Security Group with port 22 open to 0.0.0.0/0 leaves SSH exposed to the entire internet. Understanding cloud security controls prevents these misconfigurations.`,
      realWorldAnalogy: `Your cloud VPC is like a virtual data center you build in code. Security Groups are like virtual firewalls around each server. NACLs are like security checkpoints at each subnet's entrance. VPC Flow Logs are like CCTV recording all traffic. The difference from physical networks: you can provision and reconfigure all of this in seconds via API or Terraform.`,
      commonMisconception: `"The cloud provider secures my data." The Shared Responsibility Model: AWS/Azure secures the underlying infrastructure (physical hardware, hypervisor). YOU are responsible for everything inside your cloud account: data classification, IAM configuration, Security Group rules, encryption settings, and network architecture.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'AWS VPC architecture fundamentals',
        description: 'VPC = Virtual Private Cloud (your isolated network in AWS). Subnets divide the VPC (public subnet has internet route, private subnet doesn\'t). Route Tables control traffic flow. Internet Gateway = exit to internet. NAT Gateway = allows private subnet instances to reach internet (outbound only).',
        detail: 'Best practice: 3-tier architecture: Public subnet (Load Balancer), Private subnet (App servers), Isolated subnet (Database). Traffic flows: Internet → IGW → Public LB → Private App → Isolated DB.',
        tip: 'Never put databases in a public subnet. Database instances should only be reachable from your application tier.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Security Groups vs NACLs',
        description: 'Security Groups (SGs): Stateful firewall attached to individual EC2 instances/ENIs. Allows only — no explicit deny. NACLs: Stateless firewall applied at subnet boundary. Both allow and deny rules. Rules evaluated by number order.',
        detail: 'SG: If you allow inbound port 443, return traffic is automatically allowed (stateful). NACL: You must explicitly allow inbound AND outbound for both request and response (stateless).',
        tip: 'Primary defense = Security Groups (instance-level, stateful). NACLs for additional layer — blocking known bad IPs, VLAN-like subnet isolation.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'AWS Detection Services',
        description: 'VPC Flow Logs: Record all accepted/rejected traffic with 5-tuple (like NetFlow). GuardDuty: Threat detection — analyzes Flow Logs, CloudTrail, DNS logs for malicious behavior (port scanning, cryptomining, C2 communication). CloudTrail: Audit log of all AWS API calls.',
        detail: 'GuardDuty findings include: "CryptoCurrency:EC2/BitcoinTool.B" (mining on EC2), "Backdoor:EC2/C&CActivity.B" (C2 communication), "UnauthorizedAccess:IAMUser/MaliciousIPCaller" (API calls from threat intel IP).',
        tip: 'Enable GuardDuty in every region — it has a 30-day free trial and is cheap relative to its detection value.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Capital One Data Breach (2019)',
        scenario: '100 million credit applications exposed due to cloud misconfiguration',
        howItApplies: 'A WAF (Web Application Firewall) EC2 instance had an overly permissive IAM role. An attacker exploited an SSRF (Server-Side Request Forgery) vulnerability to query the EC2 instance metadata service (169.254.169.254) using the WAF\'s overly permissive IAM role, obtained temporary credentials, and exfiltrated data from S3. Fix: IMDSv2 (requires a session token, prevents SSRF exploitation of metadata), least-privilege IAM roles, and VPC endpoint for S3 access (no internet exposure).',
        emoji: '💳',
      },
    ],

    flowDiagram: {
      title: 'AWS 3-Tier VPC Architecture',
      description: 'Secure 3-tier VPC: public subnet for load balancers, private for applications, isolated for databases.',
      layout: 'vertical',
      nodes: [
        { id: 'inet',  label: 'Internet',          sublabel: 'External traffic',         type: 'start',   color: '#06b6d4' },
        { id: 'igw',   label: 'Internet Gateway',  sublabel: 'VPC ingress/egress',       type: 'process', color: '#475569' },
        { id: 'pub',   label: 'Public Subnet',     sublabel: 'ALB + WAF (10.0.1.0/24)',  type: 'actor',   color: '#10b981' },
        { id: 'priv',  label: 'Private Subnet',    sublabel: 'App Servers (10.0.2.0/24)',type: 'actor',   color: '#8b5cf6' },
        { id: 'db',    label: 'Isolated Subnet',   sublabel: 'RDS Database (10.0.3.0/24)',type: 'actor',  color: '#f59e0b' },
        { id: 'sg1',   label: 'SG: Allow 443 in',  sublabel: 'ALB Security Group',       type: 'process', color: '#10b981' },
        { id: 'sg2',   label: 'SG: ALB source only',sublabel: 'App Server SG',           type: 'process', color: '#8b5cf6' },
      ],
      edges: [
        { from: 'inet', to: 'igw',  },
        { from: 'igw',  to: 'pub',  label: 'HTTPS 443' },
        { from: 'pub',  to: 'sg1',  label: 'SG check' },
        { from: 'sg1',  to: 'priv', label: 'Allowed' },
        { from: 'priv', to: 'sg2',  label: 'SG check' },
        { from: 'sg2',  to: 'db',   label: 'Port 5432' },
      ],
    },

    quiz: [
      {
        question: 'An AWS Security Group allows port 443 inbound. What additional rule is needed for responses to reach the client?',
        options: [
          'A separate outbound rule allowing all traffic on port 443',
          'No additional rule — Security Groups are stateful and automatically allow return traffic',
          'An outbound rule allowing ephemeral ports (1024-65535)',
          'A NACL rule allowing outbound traffic',
        ],
        correctIndex: 1,
        explanation: 'AWS Security Groups are stateful — if you allow inbound traffic, return traffic (responses) is automatically permitted without any explicit outbound rule. This is different from NACLs, which are stateless and require explicit rules for both request and response traffic. This stateful behavior is why Security Groups are the primary tool for instance-level security in AWS.',
      },
    ],

    overview: `Cloud network security applies traditional network defense concepts (segmentation, stateful firewalls, IDS) through software-defined APIs. The Shared Responsibility Model defines that the cloud provider secures infrastructure while customers secure their configurations, data, and applications.`,
    keyConcepts: [
      {
        title: 'AWS Security Group vs NACL Matrix',
        explanation: 'Security Groups: Instance-level, stateful, allow-only, up to 60 rules. NACLs: Subnet-level, stateless, allow and deny, rules evaluated by number (lowest first), implicit deny-all at end.',
      },
      {
        title: 'AWS GuardDuty Data Sources',
        explanation: 'VPC Flow Logs (network connections), AWS CloudTrail (API activity), Route 53 DNS Logs (DNS queries from VPC), EKS Audit Logs (Kubernetes). GuardDuty uses ML and threat intelligence to identify findings.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'AWS CLI — auditing Security Groups for dangerous open rules',
        configSnippet: '# Find SGs with port 22 or 3389 open to 0.0.0.0/0 (internet)\naws ec2 describe-security-groups \\\n  --filters "Name=ip-permission.from-port,Values=22" \\\n            "Name=ip-permission.cidr,Values=0.0.0.0/0" \\\n  --query "SecurityGroups[*].{ID:GroupId,Name:GroupName}" \\\n  --output table',
        notes: 'Port 22 (SSH) and 3389 (RDP) open to 0.0.0.0/0 are critical misconfigurations — restrict to specific management IPs or use Systems Manager Session Manager instead.',
      },
    ],
    commonPitfalls: [
      'Confusing Security Group "outbound allow all" with a security risk — outbound allow-all is standard for instances that need internet access (updates, APIs). Restrict based on your threat model.',
      'Not enabling VPC Flow Logs — blind to network-level attacks and post-incident forensics without them.',
      'Using root account for daily operations — create IAM users/roles with least-privilege. Enable MFA on root and all IAM users.',
    ],
  },

  {
    id: 'soar-automation',
    slug: 'soar-playbooks-incident-automation',
    tierId: 'tier-3',
    tierName: 'Tier 3: SOC Operations, SIEM/SOAR & Cloud Security',
    title: 'SOAR Playbooks & Automated Incident Response',
    category: 'Automation & Response',
    summary: 'SOAR platform architecture (Splunk SOAR / Palo Alto XSOAR), playbook design patterns, API integrations, enrichment pipelines, and mean-time-to-respond (MTTR) metrics.',
    estimatedMinutes: 55,
    difficulty: 'Advanced',
    prerequisites: ['soc-siem-hunting'],
    certAlignments: ['CompTIA CySA+ (CS0-003)', 'GCIA', 'Splunk Enterprise Security Certified Admin'],
    rfcs: [],

    beginner: {
      whatIsIt: `SOAR (Security Orchestration, Automation, and Response) automates the repetitive tasks that SOC analysts do dozens of times per day — things like "look up this IP in threat intel feeds, block it on the firewall, create a ticket, notify the user." Without SOAR, analysts do this manually for every alert. With SOAR, a playbook does it in seconds.`,
      whyItMatters: `The cybersecurity industry has a massive analyst shortage. Automating routine tasks (enrichment, containment, documentation) lets human analysts focus on complex investigations that require judgment. SOAR reduces Mean Time to Respond (MTTR) from hours to minutes and eliminates human error in repetitive response actions.`,
      realWorldAnalogy: `Think of SOAR as a security analyst's robot assistant. When a phishing email alert fires: the robot automatically checks the URL against VirusTotal, queries WHOIS for the domain age, checks if any users clicked the link, quarantines the email for all users, blocks the URL on the proxy, creates an incident ticket, and notifies affected users. All in 30 seconds. The analyst reviews and approves, not clicks through 10 different tools.`,
      commonMisconception: `"SOAR will replace human analysts." SOAR automates the well-defined, repetitive parts of security response. Complex investigations — determining if an anomaly is an actual attack, understanding attacker intent, deciding on containment scope — still require human judgment. SOAR amplifies analysts; it doesn't replace them.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Playbook design: trigger → enrich → decide → respond',
        description: 'A playbook has four phases: Trigger (SIEM alert fires, email arrives), Enrichment (query threat intel, get user details, check asset criticality), Decision (High severity? Isolated host? Critical system?), Response (block IP, quarantine endpoint, notify, ticket).',
        detail: 'Good playbooks handle errors: "If VirusTotal API is down, fall back to AlienVault OTX. If block action fails, notify analyst for manual action."',
        tip: 'Start simple — a phishing response playbook is a great first SOAR project. It\'s well-understood, high-volume, and has clear decision logic.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'API integrations — connecting your security tools',
        description: 'SOAR gets its power from integrations: Firewall APIs (block IP), EDR APIs (quarantine host, run scan), Threat Intel APIs (VirusTotal, Shodan, MISP), Ticketing APIs (ServiceNow, Jira), Email APIs (quarantine message, notify user).',
        detail: 'XSOAR/Splunk SOAR have 700+ pre-built integrations. Building custom integrations requires API knowledge (REST/JSON) and Python scripting.',
        tip: 'Test integrations in a lab environment first — a SOAR playbook that accidentally blocks your CEO\'s IP is a bad day.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Measuring SOAR effectiveness',
        description: 'Key metrics: MTTR (Mean Time to Respond) — how long from alert to containment. Alert volume handled by automation (% automated vs manual). False positive rate. Playbook execution success rate.',
        detail: 'Mature SOAR programs handle 80-90% of Tier 1 alerts automatically. Analysts only touch complex, escalated incidents.',
        tip: 'Track MTTR before and after SOAR deployment — typical improvement: hours → minutes for common alert types.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Automated Phishing Response Playbook',
        scenario: 'User reports suspicious email, SOAR handles the entire response',
        howItApplies: '1. Email received in SOC mailbox → SOAR triggered. 2. Extract URLs and attachments. 3. Query VirusTotal (URL/file hash). 4. Query WHOIS (domain age < 30 days = suspicious). 5. Check if other users received same email (O365 API). 6. If malicious: quarantine all copies (O365 API), block URL on proxy (Zscaler API), create P1 incident (ServiceNow), notify affected users. 7. Analyst reviews final decision. Total time: 45 seconds vs 45 minutes manually.',
        emoji: '🎣',
      },
    ],

    flowDiagram: {
      title: 'SOAR Phishing Response Playbook',
      description: 'Automated enrichment and response for phishing email alerts — showing the decision tree and API calls.',
      layout: 'vertical',
      nodes: [
        { id: 'alert',  label: 'Phishing Alert',    sublabel: 'SIEM or user report',     type: 'start',   color: '#f43f5e' },
        { id: 'enrich', label: 'Enrichment',        sublabel: 'VirusTotal + WHOIS',      type: 'process', color: '#06b6d4' },
        { id: 'score',  label: 'Threat Score',      sublabel: 'Malicious?',              type: 'decision',color: '#f59e0b' },
        { id: 'auto',   label: 'Auto Contain',      sublabel: 'Quarantine + Block URL',  type: 'process', color: '#10b981' },
        { id: 'ticket', label: 'Create Ticket',     sublabel: 'ServiceNow P1',           type: 'data',    color: '#8b5cf6' },
        { id: 'notify', label: 'Notify Analyst',    sublabel: 'Slack + Email',           type: 'end',     color: '#10b981' },
      ],
      edges: [
        { from: 'alert',  to: 'enrich', },
        { from: 'enrich', to: 'score',  },
        { from: 'score',  to: 'auto',   label: 'Malicious' },
        { from: 'auto',   to: 'ticket', },
        { from: 'ticket', to: 'notify', },
      ],
    },

    quiz: [
      {
        question: 'What is the primary metric used to measure the effectiveness of SOAR automation?',
        options: [
          'Number of playbooks created',
          'Mean Time to Respond (MTTR) — the time from alert to containment',
          'Total cost of the SOAR platform',
          'Number of integrations configured',
        ],
        correctIndex: 1,
        explanation: 'MTTR (Mean Time to Respond) measures how quickly a security team contains a threat after detection. SOAR reduces MTTR by automating manual steps (enrichment, containment actions, ticketing) that previously required analyst time. A mature SOAR program typically reduces MTTR for common alert types from hours to minutes — limiting attacker dwell time and blast radius.',
      },
    ],

    overview: `SOAR platforms orchestrate security tool ecosystems through APIs, enabling automated enrichment and response playbooks that dramatically reduce analyst workload and MTTR. Effective playbooks follow the enrich → decide → respond pattern with robust error handling.`,
    keyConcepts: [
      {
        title: 'Playbook Design Patterns',
        explanation: 'Sequential (steps execute in order), Parallel (multiple enrichments simultaneously), Conditional (branch based on threat score), Loop (retry failed actions), Human Review (pause for analyst approval before critical actions like host isolation).',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Splunk SOAR Python action to block IP on Palo Alto firewall',
        configSnippet: '# SOAR custom action script\ndef block_ip_on_firewall(param):\n    ip_to_block = param["ip"]\n    \n    # Connect to Palo Alto API\n    fw = Firewall(hostname=FIREWALL_IP, api_key=API_KEY)\n    \n    # Add IP to blocklist address group\n    fw.add_address_to_group(\n        address=ip_to_block,\n        group="SOAR-Blocklist"\n    )\n    \n    return action_result.set_status(phantom.APP_SUCCESS)',
        notes: 'Palo Alto\'s pan-python library simplifies API interactions. Always test in staging before production deployment.',
      },
    ],
    commonPitfalls: [
      'Building playbooks that automatically perform destructive actions (host isolation) without human approval for critical systems.',
      'Not handling API failures gracefully — if VirusTotal is down, the playbook should fallback to another source, not fail entirely.',
    ],
  },

  {
    id: 'netflow-zeek-telemetry',
    slug: 'netflow-zeek-network-telemetry',
    tierId: 'tier-3',
    tierName: 'Tier 3: SOC Operations, SIEM/SOAR & Cloud Security',
    title: 'NetFlow, Zeek & Network Traffic Analysis',
    category: 'Network Telemetry',
    summary: 'NetFlow v9/IPFIX flow records (5-tuple aggregation), Zeek scripting for protocol analysis, traffic baselining, and lateral movement detection via flow data.',
    estimatedMinutes: 60,
    difficulty: 'Advanced',
    prerequisites: ['soc-siem-hunting', 'linux-sys-socket-tooling'],
    certAlignments: ['GCIA', 'GCIH', 'CompTIA CySA+ (CS0-003)', 'Cisco CyberOps Associate'],
    rfcs: [
      { number: 'RFC 7011', title: 'Specification of the IPFIX Protocol for the Export of Flow Information', url: 'https://datatracker.ietf.org/doc/html/rfc7011' },
    ],

    beginner: {
      whatIsIt: `Full packet capture (tcpdump) records every byte of every packet — 10Gbps traffic generates over 1TB per day. That's impossible to store and analyze at scale. NetFlow solves this by summarizing traffic into "flow records" — just the 5-tuple, bytes, packets, and timestamps — like a call detail record vs recording every word. Zeek goes deeper, parsing application protocols to log structured metadata.`,
      whyItMatters: `90% of security investigations can be answered with flow data: "Did this IP talk to that server? How much data moved? When? What ports?" Full packet capture answers the other 10% — "What exactly was in those packets?" Together, they provide comprehensive visibility into all network communication.`,
      realWorldAnalogy: `NetFlow is like your phone bill itemization — every call, duration, and data usage, but not the conversation content. Zeek is like a court transcription — structured records of what was said in each conversation. Full packet capture is the actual audio recording. For most investigations, the bill (NetFlow) is enough. For detailed forensics, you need the recording.`,
      commonMisconception: `"NetFlow shows me what data was exfiltrated." NetFlow shows connection metadata — who talked to whom, how much data, when. It does NOT show the content. To know what was exfiltrated, you need full packet capture or application-level logging (Zeek HTTP logs, DLP system logs).`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'NetFlow: Flow Records',
        description: 'A flow = all packets sharing the same 5-tuple (SrcIP, SrcPort, DstIP, DstPort, Protocol) within a time period. Routers/switches export flow records to a NetFlow collector (SolarWinds, ntopng, ELK stack).',
        detail: 'IPFIX (RFC 7011) is the IETF standard. Cisco NetFlow v9 is the de facto industry standard. Each record: start/end time, bytes, packets, TCP flags (for connection state analysis).',
        tip: 'Sample NetFlow (1:1000 packets) instead of full NetFlow on high-traffic links — reduces collector load while maintaining statistical visibility.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Zeek: Application-Layer Protocol Logging',
        description: 'Zeek (formerly Bro) passively analyzes traffic and generates structured log files: conn.log (connections), http.log (URLs, user agents, response codes), dns.log (all DNS queries), ssl.log (TLS certificates, cipher suites), files.log (file transfers with MD5/SHA hashes).',
        detail: 'Zeek is infinitely scriptable. Custom Zeek scripts can detect: DGA (Domain Generation Algorithm) domains, long TLS connections indicating C2, unusual user-agents, or specific protocol anomalies.',
        tip: 'Zeek HTTP logs capture User-Agent strings — look for unusual/suspicious user agents (known malware, scripting frameworks).',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Lateral movement detection with flow data',
        description: 'Lateral movement creates distinct flow patterns: a single host suddenly connecting to many other internal hosts on admin ports (22/SSH, 445/SMB, 3389/RDP) — something normal workstations never do.',
        detail: 'Detection logic: "Workstation that has connected to >5 unique internal IPs on port 445 in the last 10 minutes" = potential SMB lateral movement or worm activity.',
        tip: 'Establish normal baselines per asset type: workstations should never initiate SMB to other workstations. Servers may have legitimate inter-server communication.',
        color: '#8b5cf6',
      },
    ],

    realWorldExamples: [
      {
        title: 'Detecting Ransomware Propagation with NetFlow',
        scenario: 'Ransomware on one workstation starts spreading across the LAN',
        howItApplies: 'NetFlow shows: workstation 10.0.1.50 opened connections to 200 unique internal IPs on port 445 (SMB) within 5 minutes — anomalous pattern (normal workstations connect to 2-3 servers max). SOC alert fires. Analyst confirms: ransomware is performing SMB scanning and file encryption. Network ACL blocks 10.0.1.50 from all other subnets, isolating the infection while preserving evidence.',
        emoji: '🦠',
      },
    ],

    flowDiagram: {
      title: 'Network Telemetry Pipeline',
      description: 'From raw traffic to actionable security analytics — the full telemetry collection and analysis stack.',
      layout: 'vertical',
      nodes: [
        { id: 'traffic', label: 'Network Traffic',   sublabel: 'All flows',                type: 'start',   color: '#06b6d4' },
        { id: 'router',  label: 'Router / Switch',   sublabel: 'Exports NetFlow records',  type: 'process', color: '#475569' },
        { id: 'zeek',    label: 'Zeek Sensor',       sublabel: 'SPAN/TAP port',            type: 'actor',   color: '#10b981' },
        { id: 'collect', label: 'Flow Collector',    sublabel: 'ntopng / ELK',             type: 'process', color: '#8b5cf6' },
        { id: 'zeeklogs',label: 'Zeek Logs',         sublabel: 'conn / http / dns / ssl',  type: 'data',    color: '#10b981' },
        { id: 'siem',    label: 'SIEM Correlation',  sublabel: 'Splunk / Sentinel',        type: 'process', color: '#f59e0b' },
        { id: 'alert',   label: 'Detection Alerts',  sublabel: 'Analyst notified',         type: 'end',     color: '#f43f5e' },
      ],
      edges: [
        { from: 'traffic', to: 'router',   label: 'All packets' },
        { from: 'traffic', to: 'zeek',     label: 'Mirror copy' },
        { from: 'router',  to: 'collect',  label: 'Flow records' },
        { from: 'zeek',    to: 'zeeklogs', label: 'Protocol logs' },
        { from: 'collect', to: 'siem',     label: 'Index' },
        { from: 'zeeklogs',to: 'siem',     label: 'Index' },
        { from: 'siem',    to: 'alert',    label: 'Rule match' },
      ],
    },

    quiz: [
      {
        question: 'What is the key advantage of NetFlow over full packet capture for security monitoring?',
        options: [
          'NetFlow captures the full content of every packet',
          'NetFlow generates significantly less data while providing connection metadata, enabling long-term retention for threat hunting',
          'NetFlow is easier to analyze than PCAP files',
          'NetFlow automatically decrypts TLS traffic',
        ],
        correctIndex: 1,
        explanation: 'NetFlow generates approximately 1/1000th the data of full packet capture by summarizing all packets in a flow into a single record (5-tuple + bytes + packets + timestamps). This allows organizations to retain network connection metadata for 90-180 days (for threat hunting and forensics) while full PCAP retention would require petabytes of storage. The tradeoff is that NetFlow doesn\'t capture payload content.',
      },
    ],

    overview: `Network telemetry through NetFlow/IPFIX and Zeek provides scalable, long-term visibility into all network communications without the storage overhead of full packet capture. Combined with SIEM correlation, flow data enables lateral movement detection, data exfiltration identification, and threat hunting.`,
    keyConcepts: [
      {
        title: 'NetFlow v9 vs IPFIX Record Structure',
        explanation: 'Both use template-based records. Key fields: IN_BYTES, IN_PKTS, FIRST_SWITCHED, LAST_SWITCHED, IPV4_SRC_ADDR, IPV4_DST_ADDR, L4_SRC_PORT, L4_DST_PORT, PROTOCOL, TCP_FLAGS. IPFIX adds variable-length fields and enterprise extensions.',
      },
      {
        title: 'Zeek Log Files for Security Analysis',
        explanation: 'conn.log: all connections with bytes, duration, state. http.log: URLs, methods, status codes, user-agents, MIME types. dns.log: all queries, answers, rejected queries. ssl.log: TLS version, cipher, certificate Subject, server_name (SNI). files.log: MD5/SHA1/SHA256 hashes of transferred files.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Zeek log analysis — finding suspicious long-duration TLS connections (potential C2)',
        configSnippet: '# Long-running TLS connections to external IPs (>1 hour)\n# Could indicate persistent C2 beacon\ncat ssl.log | zeek-cut duration resp_h server_name | \\\n  awk \'$1 > 3600 {print $0}\' | \\\n  sort -rn | \\\n  head -20\n\n# High byte count uploads to external IPs (potential exfiltration)\ncat conn.log | zeek-cut id.orig_h id.resp_h resp_bytes service | \\\n  awk \'$3 > 10000000 && $4 != \"--\" {print $0}\' | sort -rn -k3',
        notes: 'Zeek timestamps are Unix epoch. 3600 seconds = 1 hour. 10000000 bytes = ~10MB outbound.',
      },
    ],
    commonPitfalls: [
      'Not collecting flow data from East-West (internal) traffic — most breaches involve lateral movement between internal systems that external NetFlow sensors miss.',
      'Relying solely on NetFlow for investigation when content is needed — combine with Zeek metadata and targeted full PCAP for high-value hosts.',
    ],
  },

  // ─── TIER 4 ────────────────────────────────────────────────────────────────
  {
    id: 'offensive-network-auditing',
    slug: 'offensive-network-security-auditing',
    tierId: 'tier-4',
    tierName: 'Tier 4: Offensive Auditing, Deep Forensics & DevSecOps',
    title: 'Offensive Network Security Auditing & Penetration Testing',
    category: 'Offensive Security',
    summary: 'Structured pentest methodology (PTES/OSSTMM), network enumeration (nmap NSE), pivoting with SSH/SOCKS, credential attack surfaces, and C2 framework architecture.',
    estimatedMinutes: 80,
    difficulty: 'Expert',
    prerequisites: ['soc-siem-hunting', 'ids-ips-signatures', 'linux-sys-socket-tooling'],
    certAlignments: ['OffSec OSCP (PEN-200)', 'GPEN', 'CompTIA PenTest+ (PT0-003)', 'CEH'],
    rfcs: [],

    beginner: {
      whatIsIt: `Offensive security (penetration testing / ethical hacking) means attacking systems with permission to find vulnerabilities before real attackers do. It's legal, authorized, and valuable — the only way to truly test if your defenses work is to attack them. Penetration testers think like attackers to identify gaps that defensive tools and audits miss.`,
      whyItMatters: `Compliance audits check if controls exist. Penetration testing checks if controls actually work. A firewall rule might exist on paper but be misconfigured. A patch might be missing on one specific server. A pentest finds these gaps in ways automated scanners and checklists cannot — by actually attempting to exploit them.`,
      realWorldAnalogy: `Penetration testing is like hiring a professional locksmith to try to break into your house before burglars do. They test every lock, every window, every potential entry point using the same techniques real burglars use — but with your permission and a goal of giving you a report so you can fix the vulnerabilities.`,
      commonMisconception: `"Running a vulnerability scanner is the same as a penetration test." A vulnerability scanner identifies potential vulnerabilities. A penetration test exploits them to demonstrate real impact. A scanner might flag "OpenSSL version X has a CVE." A penetration test says "We exploited CVE-XXXX to gain root access to the database server and extracted 50,000 records."`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Phase 1: Reconnaissance',
        description: 'Passive recon: gather information without touching the target — WHOIS, Shodan, LinkedIn, DNS records, Google dorking. Active recon: nmap port scanning, service version detection, OS fingerprinting.',
        detail: '"nmap -sV -sC -p- --open 192.168.1.0/24" performs full port scan with service version detection and default scripts. -p- scans all 65,535 ports. --open shows only open ports.',
        tip: 'Always start with passive recon. Active scanning leaves logs. In a real engagement, understand the rules of engagement before scanning.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Phase 2: Exploitation',
        description: 'Identify vulnerabilities from recon (unpatched CVEs, weak credentials, misconfigurations). Use exploit frameworks (Metasploit) or manual exploitation to gain initial access.',
        detail: 'Common initial access vectors: unpatched services (EternalBlue MS17-010), weak/default credentials, phishing, web application vulnerabilities (SQLi, RCE).',
        tip: 'Always exploit the lowest-risk path first. Don\'t use exploits that could crash production systems unless explicitly authorized.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'Phase 3: Post-Exploitation & Pivoting',
        description: 'After initial access, establish persistence, escalate privileges, and pivot to other network segments. SSH tunneling and SOCKS proxies enable routing attack traffic through compromised hosts.',
        detail: 'SSH dynamic port forwarding: "ssh -D 1080 user@pivot-host" creates a SOCKS5 proxy on port 1080 routing through the pivot. Proxychains routes tools through the SOCKS proxy to reach internal networks.',
        tip: 'Document every step — penetration test reports must be reproducible. Take screenshots of every exploitation step.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Phase 4: Reporting',
        description: 'The deliverable is a detailed report: Executive Summary (business impact), Technical Findings (each vulnerability with CVE, CVSS score, evidence, remediation), Attack Path Diagram, Risk Matrix.',
        detail: 'CVSS (Common Vulnerability Scoring System) scores severity 0-10: Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9).',
        tip: 'The best pentest reports include specific remediation guidance, not just findings. Give defenders actionable steps, not just problems.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Internal Network Compromise via Lateral Movement',
        scenario: 'Penetration tester gains initial access via phishing, then pivots to reach the domain controller',
        howItApplies: 'Step 1: Phishing email delivers macro-enabled document → Metasploit Meterpreter shell on user workstation. Step 2: Check running processes, harvest credentials from memory (Mimikatz). Step 3: Use stolen admin credential to authenticate to file server (lateral movement). Step 4: From file server, connect to domain controller. Step 5: DCSync — dump all domain account hashes. This entire attack chain demonstrates a catastrophic failure of segmentation, PAM (Privileged Access Management), and credential protection.',
        emoji: '🔴',
      },
    ],

    flowDiagram: {
      title: 'Penetration Test Kill Chain',
      description: 'Structured attack methodology: each phase builds on the previous, escalating from initial recon to full domain compromise.',
      layout: 'vertical',
      nodes: [
        { id: 'recon',  label: 'Reconnaissance',    sublabel: 'nmap, Shodan, OSINT',     type: 'start',   color: '#06b6d4' },
        { id: 'scan',   label: 'Scanning',           sublabel: 'Vulnerability assessment', type: 'process', color: '#10b981' },
        { id: 'init',   label: 'Initial Access',     sublabel: 'Exploit / Phish',          type: 'actor',   color: '#f43f5e' },
        { id: 'priv',   label: 'Privilege Escalation',sublabel: 'Local → Admin / Root',   type: 'process', color: '#f43f5e' },
        { id: 'pivot',  label: 'Lateral Movement',   sublabel: 'Pivot to new segment',    type: 'process', color: '#f43f5e' },
        { id: 'obj',    label: 'Objective',          sublabel: 'DC / Data / Crown jewels', type: 'end',     color: '#f43f5e' },
      ],
      edges: [
        { from: 'recon', to: 'scan',  },
        { from: 'scan',  to: 'init',  label: 'Vulnerability found' },
        { from: 'init',  to: 'priv',  label: 'Foothold' },
        { from: 'priv',  to: 'pivot', label: 'Admin access' },
        { from: 'pivot', to: 'obj',   label: 'Reach target' },
      ],
    },

    quiz: [
      {
        question: 'What does "pivoting" mean in penetration testing?',
        options: [
          'Changing the target scope mid-engagement',
          'Using a compromised host as a relay to attack systems in a network segment you couldn\'t directly reach',
          'Rotating encryption keys during a test',
          'Switching from one exploit to another after failure',
        ],
        correctIndex: 1,
        explanation: 'Pivoting (also called "island hopping") uses a compromised host as a proxy to reach network segments that are not directly accessible from the tester\'s machine. Example: tester compromises a DMZ web server, then uses that server as a SOCKS proxy (via SSH tunneling or Metasploit route) to attack the internal application servers that the DMZ server can reach but the tester cannot access directly.',
      },
    ],

    overview: `Penetration testing systematically identifies and exploits vulnerabilities to measure real-world security posture. Structured methodology (PTES: Pre-engagement → Recon → Scanning → Exploitation → Post-Exploitation → Reporting) ensures comprehensive coverage and reproducible results.`,
    keyConcepts: [
      {
        title: 'nmap NSE Scripting Engine',
        explanation: 'nmap scripts (NSE) extend scanning capabilities: vulnerability detection (vuln category), service enumeration (default scripts), brute force (brute category). Key scripts: smb-vuln-ms17-010 (EternalBlue), ssl-cert (TLS certificate info), http-enum (web directory enumeration).',
        command: 'nmap -sV --script=vuln,auth,default -p 445 192.168.1.0/24',
      },
      {
        title: 'SSH Pivoting Techniques',
        explanation: 'Dynamic Port Forwarding: ssh -D 1080 user@pivot creates SOCKS5 proxy. Local Port Forwarding: ssh -L 3389:internal-host:3389 user@pivot maps internal RDP port locally. Remote Port Forwarding: ssh -R 8080:localhost:80 user@external exposes local service externally.',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'SSH dynamic port forwarding (SOCKS5 pivot) and ProxyChains routing',
        configSnippet: '# Create SOCKS5 proxy through compromised pivot host\nssh -D 1080 -N -f user@10.10.10.5\n\n# Configure proxychains to use the SOCKS5 proxy\necho "socks5 127.0.0.1 1080" >> /etc/proxychains4.conf\n\n# Route nmap through the pivot to scan internal network\nproxychains nmap -sT -Pn -p 22,80,443,3389 10.20.0.0/24',
        notes: '-D 1080 creates SOCKS5 proxy. -N no remote command. -f background. proxychains routes any TCP tool through the tunnel.',
      },
    ],
    commonPitfalls: [
      'Scanning production systems with aggressive nmap timing (-T5) — can cause CPU spikes and service crashes on busy servers.',
      'Not getting written authorization before testing — penetration testing without authorization is illegal in most jurisdictions.',
      'Leaving persistence mechanisms active after engagement — always clean up backdoors and test accounts when the engagement ends.',
    ],
  },

  {
    id: 'devsecops-iac-policy',
    slug: 'devsecops-terraform-opa-policy-as-code',
    tierId: 'tier-4',
    tierName: 'Tier 4: Offensive Auditing, Deep Forensics & DevSecOps',
    title: 'DevSecOps, Terraform IaC & Policy-as-Code (OPA)',
    category: 'DevSecOps',
    summary: 'Shift-left security: SAST/DAST in CI/CD, Terraform security scanning (Checkov/tfsec), OPA Rego policy enforcement, container security (Trivy/Falco), and SBOM generation.',
    estimatedMinutes: 70,
    difficulty: 'Expert',
    prerequisites: ['cloud-vpc-security', 'zero-trust-sase-ztna'],
    certAlignments: ['AWS SAP-C02', 'CCSP', 'CompTIA SecurityX (CAS-005)', 'CISSP ISSAP'],
    rfcs: [],

    beginner: {
      whatIsIt: `DevSecOps integrates security into the software development and deployment pipeline — not as a gate at the end, but as an automated check at every stage. "Shift left" means moving security earlier in the development process (to the left of the timeline), where fixing issues is 100x cheaper than finding them in production. Infrastructure as Code (IaC) means defining cloud infrastructure in code (Terraform), which can then be security-scanned automatically.`,
      whyItMatters: `Manual security reviews can't keep pace with modern CI/CD pipelines deploying dozens of times per day. Automated security tools (SAST, DAST, IaC scanning, container scanning) catch vulnerabilities at the speed of code changes. Policy-as-Code enforces security requirements automatically — "All S3 buckets must have encryption enabled" becomes a code rule that fails the deployment if violated.`,
      realWorldAnalogy: `Traditional security is like a building inspector who checks the house after it's fully built. DevSecOps is like building safety requirements into the architect's CAD software — the software immediately flags: "This wall doesn't meet fire code" before a single brick is laid. Policy-as-Code is like having automated robots at every stage of construction that immediately stop work if something doesn't meet the code.`,
      commonMisconception: `"Security slows down development." Properly implemented DevSecOps speeds up overall delivery by catching issues early (when they're cheap to fix) rather than late (when they require emergency patches, rollbacks, and incident response). Shifting left reduces the cost and time impact of security issues.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'SAST: Finding vulnerabilities in source code',
        description: 'Static Application Security Testing analyzes source code without running it, finding: SQL injection, hardcoded credentials, insecure cryptography, path traversal, and other vulnerabilities.',
        detail: 'Tools: Semgrep (multi-language, custom rules), SonarQube (enterprise, 25+ languages), Bandit (Python), SpotBugs (Java). Integrated into Git pre-commit hooks or CI/CD pipelines.',
        tip: 'SAST generates false positives — tune rules to reduce noise. Start with critical/high severity findings only.',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Terraform IaC scanning with Checkov',
        description: 'Checkov scans Terraform code before deployment to find misconfigurations: "S3 bucket missing server-side encryption," "Security Group allows all inbound traffic," "RDS database not in VPC."',
        detail: 'Checkov has 1000+ built-in checks for AWS, Azure, GCP, Kubernetes, and Dockerfile. Fails CI/CD pipeline if critical findings are detected.',
        tip: '"checkov -d . --compact --framework terraform" scans all Terraform in current directory. Use --check and --skip-check to control which rules run.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'OPA Rego: Policy-as-Code',
        description: 'OPA (Open Policy Agent) evaluates any JSON/YAML against Rego policies. "All Kubernetes pods must have CPU/memory limits set." "No container may run as root." "All images must come from approved registry."',
        detail: 'Kubernetes admission webhooks call OPA to validate every pod deployment request. If it violates policy, the deployment is rejected. Gatekeeper is the Kubernetes-native OPA integration.',
        tip: 'Test Rego policies locally with "opa eval" before deploying. OPA Playground (play.openpolicyagent.org) is great for learning.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Container security: Trivy + Falco',
        description: 'Trivy scans container images for known CVEs (vulnerabilities in OS packages and application dependencies). Falco monitors running containers at runtime for suspicious behavior: "container spawned unexpected process," "file read in /etc/shadow."',
        detail: 'Trivy CI/CD integration: fail pipeline if container image has Critical CVEs. Falco runtime: alert SOC when container behavior deviates from expected pattern.',
        tip: 'SBOM (Software Bill of Materials) — a list of all dependencies and their versions in your application. Required by NIST for software supply chain security.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Preventing a S3 Data Exposure via IaC Scanning',
        scenario: 'A developer writes Terraform code that accidentally creates a public S3 bucket',
        howItApplies: 'Without IaC scanning: Terraform applies, S3 bucket is public, sensitive data exposed. With Checkov in CI/CD: Pipeline runs "checkov -d ." → Check CKV_AWS_20 "Ensure the S3 bucket has access control list (ACL) applied" fails → Pipeline blocked → Developer gets immediate feedback → Fix applied before deployment. No data exposure ever occurred.',
        emoji: '🪣',
      },
    ],

    flowDiagram: {
      title: 'DevSecOps CI/CD Security Pipeline',
      description: 'Security checks integrated at every stage of the development pipeline — from code commit to production deployment.',
      layout: 'vertical',
      nodes: [
        { id: 'code',    label: 'Code Commit',       sublabel: 'Developer pushes code',    type: 'start',   color: '#06b6d4' },
        { id: 'sast',    label: 'SAST Scan',         sublabel: 'Semgrep / SonarQube',      type: 'process', color: '#10b981' },
        { id: 'iac',     label: 'IaC Scan',          sublabel: 'Checkov / tfsec',           type: 'process', color: '#10b981' },
        { id: 'build',   label: 'Container Build',   sublabel: 'Docker image created',     type: 'process', color: '#475569' },
        { id: 'trivy',   label: 'Image Scan',        sublabel: 'Trivy CVE scan',           type: 'process', color: '#10b981' },
        { id: 'deploy',  label: 'Deploy (OPA Check)',sublabel: 'Policy validated',          type: 'decision',color: '#f59e0b' },
        { id: 'prod',    label: 'Production',        sublabel: 'Falco runtime monitoring', type: 'end',     color: '#10b981' },
      ],
      edges: [
        { from: 'code',  to: 'sast',   },
        { from: 'sast',  to: 'iac',    label: 'SAST passed' },
        { from: 'iac',   to: 'build',  label: 'IaC passed' },
        { from: 'build', to: 'trivy',  },
        { from: 'trivy', to: 'deploy', label: 'No Critical CVEs' },
        { from: 'deploy',to: 'prod',   label: 'Policy OK' },
      ],
    },

    quiz: [
      {
        question: 'What is the primary advantage of "shifting left" security in DevSecOps?',
        options: [
          'Security teams gain control over development timelines',
          'Vulnerabilities found earlier in development are significantly cheaper and faster to fix',
          'Code quality improves because developers have less freedom',
          'Security tools run faster on development machines than production',
        ],
        correctIndex: 1,
        explanation: 'The "1-10-100 rule" of software defects: a bug caught during development costs 1 unit to fix. The same bug caught in QA/testing costs 10 units. Caught in production costs 100+ units (emergency patch, incident response, potential breach notification, regulatory fines). Shifting security left — automating checks in the IDE and CI/CD pipeline — catches issues at the cheapest possible stage.',
      },
    ],

    overview: `DevSecOps embeds security controls throughout the SDLC via automated pipelines. IaC scanning prevents cloud misconfigurations before deployment. Policy-as-Code enforces organizational security requirements as versioned, auditable code. Container security combines build-time scanning (CVEs) with runtime behavioral monitoring.`,
    keyConcepts: [
      {
        title: 'SAST vs DAST vs IAST',
        explanation: 'SAST (Static): analyzes source code without running — fast, catches code issues, many false positives. DAST (Dynamic): attacks running application — finds runtime issues, auth bypasses, fewer false positives. IAST (Interactive): instruments running application to trace code paths — combines benefits of both, requires agent installation.',
      },
      {
        title: 'OPA Rego Policy Structure',
        explanation: 'Rego is a declarative query language. Package (namespace) → import (data sources) → rules (boolean conditions). "deny[msg]" accumulates all policy violations. Kubernetes Admission Controller calls OPA webhook synchronously for every deployment.',
        command: 'package kubernetes.admission\ndeny[msg] {\n  input.request.kind.kind == "Pod"\n  container := input.request.object.spec.containers[_]\n  not container.securityContext.runAsNonRoot\n  msg := sprintf("Container %v must not run as root", [container.name])\n}',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Checkov scan + Trivy container scan in GitHub Actions CI/CD',
        configSnippet: '# .github/workflows/security.yml\nname: Security Scan\non: [push, pull_request]\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      \n      - name: Checkov IaC Scan\n        uses: bridgecrewio/checkov-action@main\n        with:\n          directory: terraform/\n          framework: terraform\n          soft_fail: false  # Fail pipeline on findings\n          \n      - name: Trivy Container Scan\n        uses: aquasecurity/trivy-action@main\n        with:\n          image-ref: myapp:latest\n          severity: CRITICAL,HIGH\n          exit-code: 1  # Fail on Critical/High CVEs',
        notes: 'exit-code: 1 causes the GitHub Actions job to fail if vulnerabilities are found, blocking the PR merge.',
      },
    ],
    commonPitfalls: [
      'Setting all SAST/IaC scan failures to "soft_fail" to avoid pipeline disruption — this defeats the entire purpose. Run in warn mode first, then enforce after tuning.',
      'Not including transitive dependencies in container scans — a clean app image can have 200 vulnerable OS packages from the base image.',
      'Writing OPA policies without test coverage — policy bugs can block all deployments. Use "opa test" for policy unit tests.',
    ],
  },

  {
    id: 'forensics-malware-analysis',
    slug: 'network-forensics-malware-analysis',
    tierId: 'tier-4',
    tierName: 'Tier 4: Offensive Auditing, Deep Forensics & DevSecOps',
    title: 'Network Forensics & Malware Traffic Analysis',
    category: 'Digital Forensics',
    summary: 'PCAP forensics with Wireshark (display filters, stream reassembly), malware C2 communication patterns, YARA rule writing, memory forensics (Volatility), and incident timeline reconstruction.',
    estimatedMinutes: 75,
    difficulty: 'Expert',
    prerequisites: ['soc-siem-hunting', 'netflow-zeek-telemetry', 'linux-sys-socket-tooling'],
    certAlignments: ['GCFE', 'GCFA', 'GCIH', 'OffSec OSCP (PEN-200)', 'GCFR'],
    rfcs: [],

    beginner: {
      whatIsIt: `Network forensics is the process of analyzing network traffic and logs after a security incident to understand exactly what happened: How did the attacker get in? What did they access? What data did they exfiltrate? When did it happen? Malware analysis looks at the malicious software itself — what does it do, how does it communicate, how do we detect and remove it?`,
      whyItMatters: `After a breach, forensics provides the evidence needed for: incident response (stop the attack, contain the damage), legal proceedings (prove what happened), regulatory reporting (GDPR, HIPAA breach notifications), and prevention (find the root cause so it never happens again). Without forensics capability, you know you were hacked but not how, when, or what was taken.`,
      realWorldAnalogy: `Network forensics is like CSI for digital crimes. PCAP files are the crime scene recordings. Wireshark is the magnifying glass. Zeek logs are the witness statements. Memory forensics (Volatility) is analyzing the crime scene for fingerprints and DNA. The forensic analyst reconstructs the entire attack timeline from these evidence sources.`,
      commonMisconception: `"If we have antivirus, we'll detect all malware." Advanced malware uses: fileless techniques (runs only in memory), LOLBins (Living Off the Land — abuses legitimate Windows tools like PowerShell and WMI), encrypted C2 (hides command-and-control in HTTPS), and polymorphic code (changes its signature constantly). All of these evade signature-based AV.`,
    },

    stepByStep: [
      {
        step: 1,
        title: 'Wireshark: Reading PCAP evidence',
        description: 'Display filters (not capture filters) narrow what you see. "tcp.stream eq 0" follows a TCP stream. "http.request.method == POST" shows form submissions. "ssl.handshake.type == 1" shows TLS ClientHellos.',
        detail: 'Key forensics workflow: Filter for C2 indicators → Follow TCP/HTTP streams → Export transferred files → Hash-check against threat intel → Reconstruct attack timeline.',
        tip: '"Statistics → Conversations" in Wireshark shows all unique host pairs and total bytes — immediately identify large data transfers (exfiltration).',
        color: '#06b6d4',
      },
      {
        step: 2,
        title: 'Identifying malware C2 communication',
        description: 'Malware needs to phone home to receive commands and exfiltrate data. C2 patterns: beaconing (regular periodic connections — every 60 seconds), DGA (random domains generated algorithmically), DNS tunneling (commands hidden in DNS queries), HTTP/S mimicry (C2 in fake HTTP headers).',
        detail: 'Beacon detection: look for connections to the same external IP/domain at regular intervals. "Jitter" makes intervals slightly random to evade detection. Zeek conn.log + periodic connection analysis reveals beacons.',
        tip: 'Long TLS sessions to unusual destinations + low data transfer = suspicious. C2 beacons often send only a few hundred bytes per check-in.',
        color: '#10b981',
      },
      {
        step: 3,
        title: 'YARA rules: Detecting malware signatures',
        description: 'YARA rules describe patterns to identify malware in files, processes, or memory. Rules match: strings (hex patterns, ASCII, regex), file sizes, PE section names, import functions.',
        detail: 'YARA is used by: AV vendors, EDR platforms, VirusTotal, threat intel teams. Writing custom YARA rules for your environment\'s specific threats is a high-value skill.',
        tip: 'Test YARA rules with known malware samples from VirusTotal. The false positive rate is critical — a YARA rule that matches Windows DLLs is useless.',
        color: '#8b5cf6',
      },
      {
        step: 4,
        title: 'Volatility: Memory forensics',
        description: 'Volatility analyzes memory dumps (RAM images) to find: running processes (pslist, pstree), network connections (netscan), injected code (malfind), loaded DLLs (dlllist), cached credentials (hashdump).',
        detail: '"vol.py -f memory.dmp windows.pslist" lists all processes. "vol.py -f memory.dmp windows.malfind" finds memory regions with executable code that don\'t have corresponding disk files — classic fileless malware indicator.',
        tip: 'Fileless malware lives only in memory — if you don\'t capture memory during the incident, the evidence is gone after reboot.',
        color: '#f59e0b',
      },
    ],

    realWorldExamples: [
      {
        title: 'Analyzing a Ransomware Infection via Network Forensics',
        scenario: 'Post-incident investigation of a ransomware attack that encrypted 10,000 files',
        howItApplies: 'Step 1 - NetFlow: Find suspicious outbound connections 48 hours before encryption began (C2 communication). Step 2 - PCAP: Capture DNS queries showing DGA domains (algorithmically generated random names like "axkd7fmq.com"). Step 3 - Zeek: ssl.log shows long TLS session to 185.234.x.x (known bulletproof hosting) — C2 channel. Step 4 - Volatility: Memory dump shows PowerShell loading Base64-encoded shellcode (fileless dropper). Step 5 - YARA: Create rule matching the shellcode pattern to scan all other endpoints for infection.',
        emoji: '🔒',
      },
    ],

    flowDiagram: {
      title: 'Network Forensics Investigation Workflow',
      description: 'From incident discovery to root cause analysis — the structured forensics investigation process.',
      layout: 'vertical',
      nodes: [
        { id: 'disc',   label: 'Incident Discovery',  sublabel: 'Alert / User report',    type: 'start',   color: '#f43f5e' },
        { id: 'collect',label: 'Evidence Collection', sublabel: 'PCAP, logs, memory',     type: 'process', color: '#06b6d4' },
        { id: 'netflow',label: 'NetFlow Analysis',    sublabel: 'Find C2, exfil patterns', type: 'process', color: '#10b981' },
        { id: 'pcap',   label: 'PCAP Forensics',      sublabel: 'Wireshark deep-dive',    type: 'process', color: '#10b981' },
        { id: 'mem',    label: 'Memory Analysis',     sublabel: 'Volatility framework',   type: 'process', color: '#8b5cf6' },
        { id: 'yara',   label: 'YARA Hunting',        sublabel: 'Find IOCs on all hosts',  type: 'process', color: '#8b5cf6' },
        { id: 'report', label: 'Incident Report',     sublabel: 'Timeline + Root Cause',  type: 'end',     color: '#06b6d4' },
      ],
      edges: [
        { from: 'disc',    to: 'collect', },
        { from: 'collect', to: 'netflow', },
        { from: 'collect', to: 'pcap',    },
        { from: 'collect', to: 'mem',     },
        { from: 'netflow', to: 'yara',    label: 'IOCs found' },
        { from: 'pcap',    to: 'yara',    label: 'Patterns found' },
        { from: 'mem',     to: 'report',  },
        { from: 'yara',    to: 'report',  },
      ],
    },

    quiz: [
      {
        question: 'What does the Volatility "malfind" plugin detect that makes it particularly useful for fileless malware analysis?',
        options: [
          'Malware files saved to disk that are hidden by rootkit',
          'Memory regions with executable code that have no corresponding file on disk — indicating code injection or fileless malware',
          'Malformed network packets from an infected host',
          'Deleted registry keys associated with malware persistence',
        ],
        correctIndex: 1,
        explanation: 'Fileless malware loads malicious code directly into legitimate process memory (DLL injection, process hollowing, reflective loading) without writing to disk — evading file-based AV detection. Volatility\'s malfind plugin scans process memory for regions marked as executable that don\'t map back to a legitimate file on disk. This reveals injected shellcode, packed payloads, and other in-memory-only attack techniques.',
      },
    ],

    overview: `Network and memory forensics reconstruct attack timelines from available evidence: PCAP captures, flow records, memory dumps, and system logs. Malware analysis identifies C2 patterns, IOCs, and behavioral signatures to contain threats and create detections that prevent future incidents.`,
    keyConcepts: [
      {
        title: 'Wireshark Forensic Display Filters',
        explanation: 'Key filters: dns.qry.name contains "suspicious" (DNS queries), http.request.method=="POST" (data exfil via HTTP POST), tcp.len > 0 (packets with payload), ssl.handshake.ciphersuite (weak cipher detection), ip.addr == 1.2.3.4 (specific IP conversation).',
      },
      {
        title: 'YARA Rule Anatomy',
        explanation: 'rule MalwareName { meta: description = "..."; strings: $str1 = "evil string" nocase; $hex1 = { 4D 5A 90 00 }; $re1 = /cmd.exe.*\/c/ nocase; condition: $str1 and (#hex1 > 2) or ($re1 in (0..100)) }',
        command: 'yara -r my_rule.yar /suspicious/directory/ --print-meta',
      },
    ],
    vendorSyntax: [
      {
        vendor: 'Linux',
        context: 'Volatility 3 memory forensics — process list, network connections, and malfind',
        configSnippet: '# List all running processes\npython3 vol.py -f memory.dmp windows.pslist\n\n# Find suspicious network connections\npython3 vol.py -f memory.dmp windows.netscan | grep ESTABLISHED\n\n# Find injected code (fileless malware indicator)\npython3 vol.py -f memory.dmp windows.malfind --dump\n\n# Extract password hashes from LSASS\npython3 vol.py -f memory.dmp windows.hashdump',
        notes: 'Volatility 3 requires knowing the OS profile. Use windows.info plugin to determine Windows version first.',
      },
    ],
    commonPitfalls: [
      'Not capturing memory (RAM) before rebooting/isolating a compromised system — fileless malware evidence is permanently lost on reboot.',
      'Analyzing PCAP on the compromised host — malware may have kernel hooks that hide connections from local tools. Always analyze on a separate forensics workstation.',
      'Not maintaining chain of custody for forensic evidence — if the incident leads to legal proceedings, improperly handled evidence may be inadmissible.',
    ],
  },
];
