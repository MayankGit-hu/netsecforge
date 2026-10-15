# NetSecForge 🛡️

**Next-Generation Network Security & Cyber Systems Learning Platform**

NetSecForge is a high-density, interactive cyber engineering and network security study platform. It bridges foundational networking concepts with enterprise defense, Next-Gen Firewalls (NGFW), Zero Trust Architecture (ZTNA), SIEM/SOC operations, and offensive security analysis.

---

## 🌟 Key Features

### 1. Interactive Protocol Simulation Laboratory
- **Bidirectional Packet Flow Simulator**: Real-time visualization of data traversal from Client Workstation down the OSI stack (Encapsulation), through intermediate routers across the wire, up the Target Server stack (Decapsulation), and the return response (HTTP 200 OK).
- **Bit-by-Bit Header Dissector**: Detailed bit-level and flag inspection across Layer 2 (Ethernet II), Layer 3 (IPv4), and Layer 4 (TCP), explaining the function and security vulnerabilities of every bitfield.
- **TCP Sliding Window & Flow Control Simulator**: Visual byte-buffer simulator demonstrating Stop-and-Wait vs. Pipelining, Receiver Window (`rwnd`), Congestion Window (`cwnd`), Window Scale Option (RFC 7323), Selective ACKs (SACK), and Zero Window probes.

### 2. Comprehensive 5-Tier Curriculum (20 Deep Modules)
- **Tier 0: Networking & Systems Foundations**
  - OSI vs. TCP/IP Models & Frame Encapsulation
  - Core Protocols: DNS, DHCP, and ARP Security
  - Switching, VLANs (802.1Q), STP & LACP
  - Dynamic Routing: OSPF & BGP Fundamentals
- **Tier 1: Core Network Security & Cryptography**
  - Linux Socket Troubleshooting & NetSec Tooling
  - Stateful Packet Inspection (SPI) & NAT/PAT Mechanics
  - Applied Cryptography: PKI & TLS 1.3 Handshake
  - IPsec VPNs: IKEv2 / IPsec Site-to-Site Tunneling
- **Tier 2: Enterprise NGFW & Zero Trust Architecture**
  - IDS/IPS Signature Engineering & Snort/Suricata
  - Next-Gen Firewalls: App-ID & User-ID Deep Packet Inspection
  - Zero Trust Architecture, SASE & ZTNA
  - Network Microsegmentation & 802.1X NAC Policy
- **Tier 3: SOC Operations, SIEM/SOAR & Cloud Security**
  - Network Security Policy Management (NSPM)
  - SOC Threat Hunting & SIEM Detection Engineering
  - AWS & Azure Cloud VPC Security Architecture
  - SOAR Playbooks & Security Incident Automation
- **Tier 4: Offensive Auditing, Deep Forensics & DevSecOps**
  - Network Telemetry with Zeek & NetFlow/IPFIX
  - Offensive Network Auditing, Port Scanning & Exploitation
  - DevSecOps: Infrastructure as Code & Policy as Code (OPA)
  - Deep Network Forensics & Malware PCAP Analysis

### 3. Industry Certification Alignments
- CompTIA Network+ (N10-008)
- CompTIA Security+ (SY0-701)
- Cisco CCNA (200-301) & CCNP Security (350-701 SCOR)
- Palo Alto Networks PCNSA / PCNSE
- AWS Certified Security - Specialty

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Diagramming & Topologies**: [@xyflow/react](https://reactflow.dev/)
- **Language**: TypeScript (Strict typing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone git@github.com:MayankGit-hu/netsecforge.git
cd netsecforge

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

---

## 📜 License

MIT License. Crafted for security researchers, network engineers, and cyber defenders.
