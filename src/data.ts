export type SystemTheme = 'lime' | 'cyan' | 'orange' | 'violet' | 'amber'

export type SystemProject = {
  id: string
  index: string
  title: string
  eyebrow: string
  theme: SystemTheme
  summary: string
  role: string
  timeframe: string
  stack: string[]
  proof: { value: string; label: string }[]
  contributions: string[]
  significance: string
  boundary?: string
}

export const pipelineStages = [
  {
    name: 'RF',
    detail: 'Real radios, emulator targets, gain, sample rate, retuning, and the physical limits behind every downstream result.',
    systems: 'PlutoSDR · USRP B210 · AD9361 · libiio · UHD',
  },
  {
    name: 'IQ',
    detail: 'Complex samples treated as evidence: format, scaling, clipping, continuity, provenance, and repeatable capture.',
    systems: 'SigMF · PSD · dual-channel L1 · wireless datasets',
  },
  {
    name: 'TRANSPORT',
    detail: 'Native, bounded, observable delivery from device to consumers without letting slow stages destabilize acquisition.',
    systems: 'iq-bridge · ZMQ · UDP · SPSC queues · drop telemetry',
  },
  {
    name: 'INFERENCE',
    detail: 'Low-latency model execution across CPU, NPU, and TPU targets with backend agreement and reference-output checks.',
    systems: 'RIACPP · NCNN · QNN/HTP · TFLite · Coral · ONNX',
  },
  {
    name: 'ORCHESTRATION',
    detail: 'Multiple models, independent consumers, lifecycle control, fusion, event routing, captures, sweeps, and telemetry.',
    systems: 'PRISM · C++20 · lock-free fan-out · REST · WebSockets',
  },
  {
    name: 'OPERATOR',
    detail: 'Browser and terminal surfaces that make live spectrum, confidence, alerts, capture, and radio control understandable.',
    systems: 'RIASM · WebGL2 · Canvas · FastAPI · Textual',
  },
]

export const systemProjects: SystemProject[] = [
  {
    id: 'prism',
    index: '01',
    title: 'PRISM Engine',
    eyebrow: 'Flagship / orchestration',
    theme: 'lime',
    summary: 'A C++ multi-model RF inference orchestrator that turns one incoming IQ stream into independently managed intelligence, telemetry, captures, and operator control.',
    role: 'Creator & technical owner',
    timeframe: '2026 to present',
    stack: ['C++20', 'CMake', 'RIACPP', 'Crow', 'ZMQ / UDP', 'WebSockets', 'SigMF', 'Sigil'],
    proof: [
      { value: '127', label: 'verified tests passing' },
      { value: 'Multi-slot', label: 'independent model consumers' },
      { value: 'Headless', label: 'configuration-driven sweeps' },
    ],
    contributions: [
      'Designed independent model slots with lock-free SPSC buffering and non-blocking IQ fan-out.',
      'Built real-time latency, dropped-frame, inference, event, and spectrum telemetry across REST and WebSockets.',
      'Added confidence-gated SigMF capture, model registry foundations, promotion, hot-swap, and rollback controls.',
      'Integrated manual radio control plus one-shot, looping, and startup sweep orchestration with lifecycle protection.',
      'Introduced manifest-controlled normalization and rationale-oriented Sigil architecture and contract artifacts.',
    ],
    significance: 'PRISM is the clearest proof of architecture ownership: concurrency, radio control, ML runtime behavior, operator services, lifecycle management, and deployment constraints meet in one coherent system.',
  },
  {
    id: 'pretty',
    index: '02',
    title: 'OPS-SAT PRETTY',
    eyebrow: 'ESA / space experimentation',
    theme: 'cyan',
    summary: 'A technical programme adapting the intelligent-radio stack to a constrained ARMv7/musl flight environment with an AD9361/libiio radio interface.',
    role: 'Project lead & primary team interface',
    timeframe: '2026 to present',
    stack: ['ARMv7', 'musl / Alpine', 'libiio', 'QEMU', 'NCNN', 'C++', 'POSIX', 'SigMF'],
    proof: [
      { value: 'ARM32', label: 'full stack cross-built' },
      { value: '5 MS/s', label: 'sample data analyzed' },
      { value: '4 × 1 s', label: 'dual-channel L1 captures' },
    ],
    contributions: [
      'Characterized the agency-supplied target root filesystem, radio emulator, IQ format, replay, EOF, and recovery behavior.',
      'Cross-built RIACPP and PRISM for the pristine 32-bit ARM/musl deployment truth.',
      'Selected and validated NCNN as the practical target inference path after identifying incompatible runtime libraries.',
      'Compared converted-model outputs against ONNX references and caught a silent model-reduction defect.',
      'Defined a provenance-tracked POSIX flight-package pattern with atomic outputs, signal-safe shutdown, and downlink handling.',
    ],
    significance: 'PRETTY demonstrates technical programme leadership under incomplete information: environment discovery, partner communication, portability, model correctness, packaging, and honest boundary-setting.',
    boundary: 'The environment, emulator, portability path, model validation, and packaging workflow are proven. This portfolio does not claim that the package has executed in orbit.',
  },
  {
    id: 'riasm',
    index: '03',
    title: 'RIA Spectrum Monitor',
    eyebrow: 'Operator experience',
    theme: 'cyan',
    summary: 'A browser and terminal operating surface over PRISM for monitoring, investigating, capturing, scanning, and acting on live RF intelligence.',
    role: 'Product & technical lead',
    timeframe: '2026 to present',
    stack: ['Python', 'FastAPI', 'asyncio', 'WebSockets', 'WebGL2', 'Canvas 2D', 'Textual'],
    proof: [
      { value: '18', label: 'tests at first major checkpoint' },
      { value: 'Multi-engine', label: 'PRISM fleet monitoring' },
      { value: 'Web + TUI', label: 'local and headless operation' },
    ],
    contributions: [
      'Built live WebGL spectrum and waterfall visualization with scaling, smoothing, persistence, holds, zoom, and markers.',
      'Designed an honest ML overlay for window-level classifiers with uncertainty, smoothing, history, and sweep awareness.',
      'Added event filtering, exports, timelines, alerts, scan rules, capture actions, and SigMF browsing.',
      'Implemented multi-PRISM monitoring, wideband stitched panoramas, and a Textual interface for SSH workflows.',
      'Connected center frequency, sample rate, gain, and sweep controls back through PRISM instead of bypassing the architecture.',
    ],
    significance: 'RIASM proves that deep systems work can become an operator product: high-rate technical data is translated into useful control, investigation, and decision surfaces.',
  },
  {
    id: 'runtime',
    index: '04',
    title: 'Runtime & IQ Infrastructure',
    eyebrow: 'RIACPP + iq-bridge',
    theme: 'orange',
    summary: 'Low-level inference and acquisition work spanning heterogeneous accelerators, live IQ benchmarks, native radio control, bounded transport, and constrained Linux deployment.',
    role: 'Runtime contributor / iq-bridge initiator',
    timeframe: '2026 to present',
    stack: ['C++17/20', 'libiio', 'FFTW', 'QNN/HTP', 'TFLite', 'Coral', 'NCNN', 'ZMQ / UDP'],
    proof: [
      { value: '5', label: 'runtime target families' },
      { value: 'Native', label: 'Python-free acquisition path' },
      { value: 'SigMF', label: 'recording provenance' },
    ],
    contributions: [
      'Extended the founder-created RIACPP engine with Coral, Qualcomm QNN, TFLite CPU, and NCNN execution paths.',
      'Built live-IQ and fixed-recording benchmarks with top-1 agreement, probability deltas, and honest disagreement reporting.',
      'Initiated iq-bridge as a native libiio producer for ZMQ complex-float and UDP int16 transport.',
      'Separated device refill, bounded queuing, publishing, recording, and control so throughput and loss remain observable.',
      'Validated radio behavior with PlutoSDR and ARM testbeds while investigating scale, datatype, batching, and USB limits.',
    ],
    significance: 'This work shows Muq can move below applications into the execution, transport, and device layers where performance and correctness assumptions become physical.',
    boundary: "RIACPP was created by Qoherent's founder. Muq's contribution is backend, benchmarking, deployment, and integration work around that existing engine.",
  },
  {
    id: 'agents',
    index: '05',
    title: 'Agent-Native Radio Engineering',
    eyebrow: 'GRC-Agent + Sigil',
    theme: 'violet',
    summary: 'Developer systems that make GNU Radio and complex technical codebases more searchable, explainable, and safely changeable by humans and AI agents.',
    role: 'Integrator, evaluator & contributor',
    timeframe: '2026',
    stack: ['GNU Radio', 'Python', 'RAG', 'EmbeddingGemma', 'Codex auth', 'Sigil', 'CI'],
    proof: [
      { value: '188 + 1', label: 'tests passed + skipped' },
      { value: 'Local RAG', label: 'no cloud embedding dependency' },
      { value: 'Upstream', label: 'Sigil contributions landed' },
    ],
    contributions: [
      'Integrated GRC-Agent with the system GNU Radio installation, local semantic retrieval, and ChatGPT/Codex authentication.',
      'Produced a source-backed architecture comparison with GNU Radio World and a concrete upgrade path around tools, RAG, transactions, and runnable catalogs.',
      'Adopted Sigil in PRISM to capture architecture, contracts, ownership, decisions, and implementation review gates.',
      'Contributed Sigil onboarding and merge-repair work upstream.',
    ],
    significance: 'The differentiator is not simply using AI to write code. It is designing the context, contracts, evidence, and review boundaries that let agents work responsibly on technical systems.',
  },
]

export const timeline = [
  { year: '2019–22', title: 'Physics meets management', text: 'McMaster Engineering Physics and Management; MEMS leadership; embedded electronics, control, and analytical foundations.' },
  { year: '2022', title: 'Measurement becomes professional', text: 'Industrial 3D metrology at Applied Precision using Leica, Zeiss, and Faro systems for inspection and reverse engineering.' },
  { year: '2023–24', title: 'Deep technical range', text: 'Reactor laboratories, MCNP, CANDU simulation, photonics, optical modelling, semiconductor devices, and cleanroom fabrication.' },
  { year: '2024–25', title: 'Systems integration', text: 'Autonomous blackjack capstone joined mechanics, embedded control, Linux, computer vision, gesture recognition, and interface design.' },
  { year: '2025–26', title: 'Independent builder', text: 'Full-stack products, 3D web experiences, backend systems, brand work, and an intensive agent-assisted development practice.' },
  { year: '2026–now', title: 'Intelligent radio', text: 'PRISM, PRETTY, RIASM, RIACPP backends, iq-bridge, edge hardware, GNU Radio agents, and space-oriented experimentation.' },
]

export const foundationProjects = [
  {
    discipline: 'Embedded systems',
    title: 'Autonomous Blackjack Dealer',
    text: 'A team capstone combining a motorized 3D-printed dispenser, Arduino and Raspberry Pi control, Python game logic, MediaPipe gestures, YOLOv8 card recognition, and a desktop interface.',
    accent: 'lime',
    link: 'https://github.com/muqtadir66/Portfolio/blob/main/media/BlackJack%20Orama%20-%20Autonomous%20BlackJack%20Dealer.pdf',
  },
  {
    discipline: 'Nuclear engineering',
    title: 'CANDU Fuel Optimization',
    text: 'MCNP studies comparing fuel configurations through neutron flux, energy deposition, radial power distribution, material trade-offs, and core behavior.',
    accent: 'amber',
    link: 'https://github.com/muqtadir66/Portfolio/blob/main/media/MCNP%20Study%20-%20Fuel%20Bundle%20Optimization%20Report.pdf',
  },
  {
    discipline: 'Semiconductors',
    title: 'PERL Solar Cell',
    text: 'Cleanroom silicon-cell fabrication paired with Sentaurus TCAD, electrical characterization, and analysis of the measured-to-simulated performance gap.',
    accent: 'orange',
    link: 'https://github.com/muqtadir66/Portfolio/blob/main/media/PERL%20Solar%20Cell%20Fabrication%20(MJEP%20Paper).pdf',
  },
  {
    discipline: 'Optics & photonics',
    title: 'Light as a measurement system',
    text: 'Waveguides, couplers, lasers, optical links, Zemax imaging, RSoft simulation, OCT, biophotonics, and lab characterization.',
    accent: 'violet',
  },
  {
    discipline: 'Control systems',
    title: 'PID Thermoelectric Controller',
    text: 'MSP430 firmware, NTC/ADC sensing, PWM-driven Peltier control, UART telemetry, and a MATLAB monitoring interface.',
    accent: 'cyan',
  },
  {
    discipline: 'Metrology',
    title: '3D Scanning & Reverse Engineering',
    text: 'Professional point-cloud alignment, watertight meshing, inspection, and as-built CAD across industrial components and environments.',
    accent: 'lime',
  },
]

export const skillGroups = [
  { label: 'Radio', items: ['SDR & IQ', 'libiio / UHD', 'PlutoSDR / B210', 'SigMF', 'GNU Radio'] },
  { label: 'Systems', items: ['C++17/20', 'Concurrency', 'CMake', 'Embedded Linux', 'Cross-compilation'] },
  { label: 'Inference', items: ['ONNX Runtime', 'NCNN', 'QNN / HTP', 'TFLite', 'Coral Edge TPU'] },
  { label: 'Product', items: ['Python', 'FastAPI', 'WebSockets', 'WebGL2 / Canvas', 'Textual'] },
  { label: 'Practice', items: ['Testing', 'Model validation', 'Sigil', 'RAG / agents', 'Technical leadership'] },
]
