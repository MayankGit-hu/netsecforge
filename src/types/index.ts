export type TierId = 'tier-0' | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';

// ─── Flow Diagram Types ──────────────────────────────────────────────────────
export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'actor' | 'data';
  color?: string; // e.g. '#06b6d4'
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

export interface FlowDiagramData {
  title: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  layout?: 'horizontal' | 'vertical'; // default vertical
}

// ─── Beginner Content Types ──────────────────────────────────────────────────
export interface RealWorldExample {
  title: string;
  scenario: string;       // "Imagine you are sending a letter..."
  howItApplies: string;   // how the network concept maps to this
  emoji?: string;
}

export interface StepByStep {
  step: number;
  title: string;
  description: string;
  detail?: string;        // deeper technical context
  tip?: string;           // remember this tip
  color?: string;
}

export interface BeginnerSection {
  whatIsIt: string;                   // ELI5 explanation
  whyItMatters: string;               // why a security engineer cares
  realWorldAnalogy: string;           // relatable real-world analogy
  commonMisconception?: string;       // address the "I thought..." mistake
}

// ─── Quiz / Check Your Understanding ────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── Core CurriculumTopic ────────────────────────────────────────────────────
export interface CurriculumTopic {
  id: string;
  slug: string;
  tierId: TierId;
  tierName: string;
  title: string;
  category: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prerequisites: string[];
  certAlignments: string[];
  rfcs: { number: string; title: string; url: string }[];

  // ── BEGINNER LAYER ──────────────────────────────────────────────────────
  beginner?: BeginnerSection;
  stepByStep?: StepByStep[];
  realWorldExamples?: RealWorldExample[];
  flowDiagram?: FlowDiagramData;
  quiz?: QuizQuestion[];

  // ── EXPERT LAYER ───────────────────────────────────────────────────────
  overview: string;
  keyConcepts: { title: string; explanation: string; command?: string }[];
  packetStructure?: {
    protocol: string;
    description: string;
    fields: { name: string; sizeBits: number; description: string; color: string }[];
  };
  vendorSyntax?: {
    vendor: 'Cisco' | 'Palo Alto' | 'Fortinet' | 'Check Point' | 'Linux' | 'Snort';
    context: string;
    configSnippet: string;
    notes: string;
  }[];
  commonPitfalls: string[];
  labId?: string;
}

// ─── Certifications ──────────────────────────────────────────────────────────
export interface CertDomain {
  name: string;
  weightPercent: number;
  keyTopics: string[];
  mappedTopicIds: string[];
}

export interface PracticeQuestion {
  id: string;
  domain: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceUrl?: string;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  vendor: string;
  level: 'Foundational' | 'Associate' | 'Professional' | 'Specialist' | 'Expert';
  badgeColor: string;
  summary: string;
  domains: CertDomain[];
  examDetails: {
    format: string;
    duration: string;
    passingScore: string;
    cost: string;
  };
  mappedTopicIds: string[];
  practiceQuestions: PracticeQuestion[];
}

// ─── Enterprise Products ─────────────────────────────────────────────────────
export interface EnterpriseProduct {
  id: string;
  name: string;
  vendor: string;
  category: 'NGFW & Edge' | 'NSPM & Microsegmentation' | 'Monitoring & Telemetry' | 'SIEM & SOC' | 'EDR & XDR';
  badge: string;
  description: string;
  keyArchitecture: string[];
  cliCheatSheet: { command: string; purpose: string; mode?: string }[];
  commonMisconfigurations: string[];
  deploymentPatterns: string[];
  relatedCertifications: string[];
}

// ─── Packets & Labs ──────────────────────────────────────────────────────────
export interface PacketFieldDissected {
  name: string;
  value: string;
  hexBytes: string;
  byteRange: [number, number];
  description: string;
}

export interface PacketLayer {
  layer: 'Layer 2 - Data Link' | 'Layer 3 - Network' | 'Layer 4 - Transport' | 'Layer 7 - Application';
  protocol: string;
  summary: string;
  color: string;
  fields: PacketFieldDissected[];
}

export interface PacketSample {
  id: string;
  title: string;
  scenario: string;
  captureType: string;
  rawHex: string;
  layers: PacketLayer[];
  securityInsight: string;
}

export interface TerminalLabStep {
  stepNumber: number;
  instruction: string;
  hint: string;
  expectedPattern: RegExp | string;
  simulatedOutput: string;
  explanation: string;
}

export interface TerminalLabScenario {
  id: string;
  title: string;
  category: 'Cisco IOS' | 'Palo Alto PAN-OS' | 'Linux iptables/nftables' | 'Linux tcpdump' | 'Snort / Suricata';
  vendorBadge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  initialPrompt: string;
  scenarioDescription: string;
  topologyContext: string;
  steps: TerminalLabStep[];
}

export interface SearchItem {
  id: string;
  title: string;
  type: 'topic' | 'cert' | 'product' | 'cve' | 'command';
  category: string;
  description: string;
  href: string;
  tags: string[];
}
