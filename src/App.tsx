import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  foundationProjects,
  pipelineStages,
  skillGroups,
  systemProjects,
  timeline,
  type SystemProject,
} from './data'

const signalBars = [18, 27, 12, 31, 44, 28, 20, 55, 36, 24, 68, 92, 61, 38, 26, 46, 34, 72, 42, 30, 22, 48, 32, 16, 28, 57, 39, 21, 13, 26, 19, 11]

function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let animationId = 0
    let pointerX = 0.62
    let pointerY = 0.46
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = box.width * ratio
      canvas.height = box.height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      pointerX = (event.clientX - box.left) / box.width
      pointerY = (event.clientY - box.top) / box.height
    }

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(width * pointerX, height * pointerY, 0, width * pointerX, height * pointerY, width * 0.52)
      glow.addColorStop(0, 'rgba(184, 255, 92, 0.13)')
      glow.addColorStop(0.46, 'rgba(58, 203, 255, 0.07)')
      glow.addColorStop(1, 'rgba(7, 16, 15, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      for (let band = 0; band < 8; band += 1) {
        const yBase = height * (0.2 + band * 0.085)
        context.beginPath()
        for (let x = -12; x <= width + 12; x += 7) {
          const proximity = Math.max(0, 1 - Math.abs(x / width - pointerX) * 2.5)
          const amplitude = 4 + band * 1.15 + proximity * 14
          const frequency = 0.018 + band * 0.0017
          const y = yBase + Math.sin(x * frequency + frame * 0.022 + band * 0.68) * amplitude
          if (x === -12) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.strokeStyle = band % 3 === 0 ? 'rgba(184,255,92,.58)' : 'rgba(110,219,255,.24)'
        context.lineWidth = band % 3 === 0 ? 1.25 : 0.7
        context.stroke()
      }

      frame += reducedMotion ? 0 : 1
      animationId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', move)
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', move)
    }
  }, [])

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />
}

function SpectrumPanel() {
  return (
    <div className="spectrum-panel" aria-label="Animated spectrum visualization">
      <div className="spectrum-toolbar">
        <span><i className="live-dot" /> LIVE IQ</span>
        <span>2.450 GHz</span>
        <span>-42.8 dBFS</span>
      </div>
      <div className="spectrum-chart" aria-hidden="true">
        <div className="spectrum-grid" />
        <div className="spectrum-bars">
          {signalBars.map((height, index) => (
            <i
              key={`${height}-${index}`}
              style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * -43}ms` } as CSSProperties}
            />
          ))}
        </div>
        <div className="frequency-marker"><span>classifier event / 0.94</span></div>
      </div>
      <div className="spectrum-footer">
        <span>2.445</span><span>2.448</span><span>2.450</span><span>2.452</span><span>2.455 GHz</span>
      </div>
    </div>
  )
}

function SystemCard({ project, onOpen }: { project: SystemProject; onOpen: (project: SystemProject) => void }) {
  return (
    <button className={`system-card theme-${project.theme}`} type="button" onClick={() => onOpen(project)}>
      <span className="system-card-index">{project.index}</span>
      <span className="system-card-eyebrow">{project.eyebrow}</span>
      <span className="system-card-title">{project.title}</span>
      <span className="system-card-summary">{project.summary}</span>
      <span className="system-card-meta">
        <span>{project.role}</span>
        <span className="system-card-arrow" aria-hidden="true">↗</span>
      </span>
    </button>
  )
}

function ProjectDrawer({ project, onClose }: { project: SystemProject | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.classList.add('drawer-open')
    window.addEventListener('keydown', close)
    window.setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      document.body.classList.remove('drawer-open')
      window.removeEventListener('keydown', close)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="drawer-shell" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button className="drawer-backdrop" type="button" onClick={onClose} aria-label="Close case study" />
      <article className={`project-drawer theme-${project.theme}`}>
        <header className="drawer-header">
          <span>{project.index} / CASE FILE</span>
          <button ref={closeRef} className="drawer-close" type="button" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
        </header>
        <div className="drawer-body">
          <p className="drawer-eyebrow">{project.eyebrow}</p>
          <h2 id="drawer-title">{project.title}</h2>
          <p className="drawer-lead">{project.summary}</p>

          <div className="drawer-facts">
            <div><span>Role</span><strong>{project.role}</strong></div>
            <div><span>Window</span><strong>{project.timeframe}</strong></div>
          </div>

          <div className="drawer-proof">
            {project.proof.map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <section className="drawer-section">
            <h3>What I built</h3>
            <ol>
              {project.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
            </ol>
          </section>

          <section className="drawer-section drawer-significance">
            <h3>Why it matters</h3>
            <p>{project.significance}</p>
          </section>

          {project.boundary && (
            <aside className="evidence-boundary">
              <span>Evidence boundary</span>
              <p>{project.boundary}</p>
            </aside>
          )}

          <div className="drawer-stack">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </article>
    </div>
  )
}

function App() {
  const [activeStage, setActiveStage] = useState(3)
  const [selectedProject, setSelectedProject] = useState<SystemProject | null>(null)
  const [selectedEra, setSelectedEra] = useState(timeline.length - 1)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const activePipeline = pipelineStages[activeStage]

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Muq Hussain, home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">MH</span>
          <span className="brand-copy">RF / EDGE SYSTEMS</span>
        </a>
        <nav className={menuOpen ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          <a href="#systems" onClick={() => setMenuOpen(false)}>Systems</a>
          <a href="#flight" onClick={() => setMenuOpen(false)}>Flight</a>
          <a href="#trajectory" onClick={() => setMenuOpen(false)}>Trajectory</a>
          <a href="#foundation" onClick={() => setMenuOpen(false)}>Foundation</a>
        </nav>
        <a className="contact-link" href="mailto:muqti123@gmail.com">Connect <span aria-hidden="true">↗</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <SignalField />
          <div className="hero-grid" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Toronto / Building at Qoherent</p>
            <h1>I build the systems between <em>raw spectrum</em> and useful intelligence.</h1>
            <p className="intro">RF and edge-AI systems work spanning SDR acquisition, real-time inference, embedded Linux, operator tooling, and space experimentation.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#systems">Explore the system <span aria-hidden="true">↓</span></a>
              <a className="text-action" href="/media/Muq_Hussain_Resume.pdf" target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="coordinates" aria-hidden="true"><span>43.6532° N</span><span>79.3832° W</span></div>
          <div className="hero-index" aria-hidden="true"><span>01</span><span>FIELD NOTES / 2026</span></div>
          <a className="scroll-cue" href="#systems"><span>Scroll to decode</span><i /></a>
        </section>

        <section className="system-section" id="systems">
          <div className="section-heading" data-reveal>
            <p className="kicker">The operating stack</p>
            <h2>One signal.<br />Six engineering layers.</h2>
            <p>Move through the chain to see where hardware, software, and intelligence meet.</p>
          </div>

          <div className="pipeline" role="list" aria-label="Signal processing pipeline" data-reveal>
            {pipelineStages.map((stage, index) => (
              <button
                type="button"
                role="listitem"
                className={index === activeStage ? 'pipeline-stage active' : 'pipeline-stage'}
                key={stage.name}
                onMouseEnter={() => setActiveStage(index)}
                onFocus={() => setActiveStage(index)}
                onClick={() => setActiveStage(index)}
              >
                <span className="stage-number">0{index + 1}</span>
                <span className="stage-node" />
                <span className="stage-label">{stage.name}</span>
              </button>
            ))}
          </div>

          <div className="pipeline-detail" data-reveal aria-live="polite">
            <span className="pipeline-detail-index">0{activeStage + 1}</span>
            <div>
              <p>{activePipeline.detail}</p>
              <span>{activePipeline.systems}</span>
            </div>
          </div>

          <div className="proof-grid" data-reveal>
            <article><span className="proof-value">127</span><p>tests in the verified PRISM suite</p></article>
            <article><span className="proof-value">ARMv7</span><p>full stack built for constrained musl targets</p></article>
            <article><span className="proof-value">RF → AI</span><p>end-to-end systems, not isolated demos</p></article>
          </div>
        </section>

        <section className="chapter-intro" id="flight">
          <div className="chapter-rule"><span>Chapter 02</span><span>Space / constraint / evidence</span></div>
          <div className="chapter-copy" data-reveal>
            <p className="kicker">Flight systems</p>
            <h2>Engineering for the machine that actually exists.</h2>
            <p>Space software turns assumptions into constraints: architecture, word size, C library, dependency closure, data volume, provenance, shutdown, and downlink all become part of the product.</p>
          </div>

          <div className="flight-grid">
            <div className="orbit-field" data-reveal aria-hidden="true">
              <div className="orbit orbit-a"><i /></div>
              <div className="orbit orbit-b"><i /></div>
              <div className="planet"><span>ARMv7</span><small>musl</small></div>
              <div className="telemetry-label label-a">AD9361 / libiio</div>
              <div className="telemetry-label label-b">atomic output</div>
              <div className="telemetry-label label-c">reference checked</div>
            </div>

            <div className="flight-manifest" data-reveal>
              <div className="manifest-header"><span>PRETTY / TARGET MANIFEST</span><span>ACTIVE STUDY</span></div>
              <dl>
                <div><dt>Architecture</dt><dd>32-bit ARM / EABI5</dd></div>
                <div><dt>Userland</dt><dd>Alpine / musl</dd></div>
                <div><dt>Radio path</dt><dd>AD9361 / libiio</dd></div>
                <div><dt>Inference</dt><dd>NCNN validated against ONNX</dd></div>
                <div><dt>Package</dt><dd>POSIX entrypoint / provenance / toGround</dd></div>
              </dl>
              <button type="button" onClick={() => setSelectedProject(systemProjects[1])}>Open mission case file <span>↗</span></button>
            </div>
          </div>
        </section>

        <section className="work-section">
          <div className="chapter-rule"><span>Chapter 03</span><span>Selected systems / current work</span></div>
          <div className="work-heading" data-reveal>
            <p className="kicker">The current body of work</p>
            <h2>Not a project gallery.<br /><em>A connected system.</em></h2>
          </div>
          <div className="systems-grid" data-reveal>
            {systemProjects.map((project) => <SystemCard key={project.id} project={project} onOpen={setSelectedProject} />)}
          </div>
          <p className="disclosure-note">Selected detail is intentionally bounded to evidence that is safe to describe. Internal and partner-sensitive implementation detail stays out.</p>
        </section>

        <section className="operator-section">
          <div className="operator-copy" data-reveal>
            <div className="chapter-rule"><span>Interface study</span><span>Signal → decision</span></div>
            <p className="kicker">Operator thinking</p>
            <h2>Make high-rate systems legible.</h2>
            <p>RIASM translates spectrum, confidence, telemetry, events, captures, and radio state into one operating surface, in the browser or over SSH.</p>
            <button type="button" className="inline-button" onClick={() => setSelectedProject(systemProjects[2])}>Read the RIASM case file <span>↗</span></button>
          </div>
          <div className="operator-visual" data-reveal><SpectrumPanel /></div>
        </section>

        <section className="trajectory-section" id="trajectory">
          <div className="chapter-rule"><span>Chapter 04</span><span>Trajectory / 2019 to now</span></div>
          <div className="trajectory-heading" data-reveal>
            <p className="kicker">How the range converged</p>
            <h2>Breadth was the training.<br />Systems are the through-line.</h2>
          </div>
          <div className="timeline-shell" data-reveal>
            <div className="timeline-rail" role="tablist" aria-label="Career timeline">
              {timeline.map((era, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedEra === index}
                  className={selectedEra === index ? 'timeline-tab active' : 'timeline-tab'}
                  onClick={() => setSelectedEra(index)}
                  key={era.year}
                >
                  <i /><span>{era.year}</span>
                </button>
              ))}
            </div>
            <article className="timeline-detail" role="tabpanel">
              <span className="timeline-count">0{selectedEra + 1}</span>
              <div>
                <p>{timeline[selectedEra].year}</p>
                <h3>{timeline[selectedEra].title}</h3>
                <span>{timeline[selectedEra].text}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="foundation-section" id="foundation">
          <div className="chapter-rule"><span>Chapter 05</span><span>Engineering Physics foundation</span></div>
          <div className="foundation-heading" data-reveal>
            <div>
              <p className="kicker">Before the specialization</p>
              <h2>A physics-trained way of seeing systems.</h2>
            </div>
            <p>McMaster Engineering Physics and Management built the ability to move between equations, instruments, devices, software, experiments, and stakeholders.</p>
          </div>
          <div className="foundation-grid" data-reveal>
            {foundationProjects.map((project, index) => {
              const content = (
                <>
                  <span className="foundation-index">0{index + 1}</span>
                  <span className="foundation-discipline">{project.discipline}</span>
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                  {project.link && <span className="foundation-link">Open artifact ↗</span>}
                </>
              )
              return project.link ? (
                <a className={`foundation-card theme-${project.accent}`} href={project.link} target="_blank" rel="noreferrer" key={project.title}>{content}</a>
              ) : (
                <article className={`foundation-card theme-${project.accent}`} key={project.title}>{content}</article>
              )
            })}
          </div>
        </section>

        <section className="skills-section">
          <div className="chapter-rule"><span>Capability map</span><span>Evidence over keywords</span></div>
          <div className="skills-layout" data-reveal>
            <div className="skills-copy">
              <p className="kicker">Working range</p>
              <h2>Deep enough for the runtime. Wide enough for the mission.</h2>
              <p>Skills appear here because they connect to shipped code, physical devices, validated experiments, or operator-facing systems.</p>
            </div>
            <div className="skill-groups">
              {skillGroups.map((group, index) => (
                <section key={group.label}>
                  <header><span>0{index + 1}</span><h3>{group.label}</h3></header>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="resume-section" id="resume">
          <div className="resume-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="resume-copy" data-reveal>
            <p className="kicker">The short version</p>
            <h2>One page.<br />Current signal.</h2>
            <p>A rebuilt resume focused on intelligent radio, edge inference, embedded Linux, technical leadership, and the Engineering Physics foundation underneath it.</p>
            <div className="resume-actions">
              <a className="primary-action" href="/media/Muq_Hussain_Resume.pdf" target="_blank" rel="noreferrer">Download PDF <span>↓</span></a>
              <a className="text-action" href="/media/Muq_Hussain_Resume.docx">Editable DOCX <span>↓</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p>Have a hard RF, edge, embedded, or space systems problem?</p>
          <a href="mailto:muqti123@gmail.com">Let's talk.<span>↗</span></a>
        </div>
        <div className="footer-meta">
          <span>Muq Hussain / Toronto</span>
          <nav aria-label="Social links">
            <a href="https://github.com/muqtadir66" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/muqtadir66" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:muqti123@gmail.com">Email</a>
          </nav>
          <span>© 2026</span>
        </div>
      </footer>

      <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}

export default App
