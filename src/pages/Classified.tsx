import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff, AlertTriangle, Fingerprint, ArrowLeft, Zap, Wifi, Radio, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { playTypingSound, playSuccessSound, playErrorSound, playHoverSound, playClickSound, playScanSound } from '@/lib/sounds';

const CORRECT_PASSWORD = 'Edward@2026';

const personalData = {
  name: 'Edward',
  codename: 'PHANTOM_DEV',
  age: '20',
  birthday: 'Head Of CyberSecurity',
  location: 'Uk, Manchester',
  clearanceLevel: 'OMEGA-7',
  status: 'ACTIVE',
  bio: `Full-stack developer and digital architect. I breathe code and dream in algorithms. When I'm not building the future of the web, you'll find me exploring new technologies and pushing the boundaries of what's possible.`,
  hobbies: [
    'Coding & Development',
    'Gaming',
    'Music Production',
    'Cybersecurity Research',
    'UI/UX Design',
  ],
  job: 'Full-Stack Developer & Digital Architect',
  skills: [
    { name: 'React/TypeScript', level: 95 },
    { name: 'Three.js/WebGL', level: 90 },
    { name: 'Node.js', level: 100 },
    { name: 'Python', level: 98 },
    { name: 'Cybersecurity', level: 100 },
  ],
  photos: [] as string[],
};

// Blinking text component
function BlinkingText({ children, className = '', speed = 1.5 }: { children: React.ReactNode; className?: string; speed?: number }) {
  return (
    <motion.span
      className={className}
      animate={{ opacity: [1, 0.3, 1, 0.8, 1] }}
      transition={{ duration: speed, repeat: Infinity, repeatType: 'loop' }}
    >
      {children}
    </motion.span>
  );
}

// Glowing border card
function GlowCard({ children, className = '', delay = 0, color = 'cyan' }: { children: React.ReactNode; className?: string; delay?: number; color?: string }) {
  const colorVar = color === 'magenta' ? '--neon-magenta' : color === 'purple' ? '--neon-purple' : '--neon-cyan';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className={`relative ${className}`}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-sm pointer-events-none"
        animate={{
          boxShadow: [
            `0 0 10px hsl(var(${colorVar}) / 0.3), inset 0 0 10px hsl(var(${colorVar}) / 0.05)`,
            `0 0 25px hsl(var(${colorVar}) / 0.6), inset 0 0 20px hsl(var(${colorVar}) / 0.1)`,
            `0 0 10px hsl(var(${colorVar}) / 0.3), inset 0 0 10px hsl(var(${colorVar}) / 0.05)`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {children}
    </motion.div>
  );
}

// Typing effect
function TypeWriter({ text, delay = 0, speed = 0.03 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed * 1000);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);
  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-neon-cyan"
        >
          █
        </motion.span>
      )}
    </span>
  );
}

// Data stream background text
function DataStream() {
  const chars = '01アイウエオカキクケコ▓▒░█';
  const [streams] = useState(() =>
    Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      speed: 5 + Math.random() * 15,
      chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('\n'),
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
      {streams.map((stream, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-neon-green whitespace-pre leading-4"
          style={{ left: `${stream.x}%` }}
          animate={{ y: ['-100%', '100vh'] }}
          transition={{ duration: stream.speed, repeat: Infinity, ease: 'linear' }}
        >
          {stream.chars}
        </motion.div>
      ))}
    </div>
  );
}

export default function Classified() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      playSuccessSound();
      setIsAuthenticated(true);
      setError('');
    } else {
      playErrorSound();
      setAttempts(prev => prev + 1);
      setError(`ACCESS DENIED — Invalid credentials [Attempt ${attempts + 1}]`);
      setPassword('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playTypingSound();
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Data streams */}
      <DataStream />

      {/* Scanlines */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.1) 2px, hsl(0 0% 0% / 0.1) 4px)',
        }}
      />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid bg-[size:40px_40px] opacity-5" />
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* PASSWORD SCREEN */
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
          >
            {/* Back button */}
            <motion.button
              onClick={() => { playClickSound(); navigate('/'); }}
              className="absolute top-6 left-6 flex items-center gap-2 font-orbitron text-xs text-muted-foreground hover:text-neon-cyan transition-colors"
              whileHover={{ x: -5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowLeft className="w-4 h-4" />
              RETURN TO BASE
            </motion.button>

            {/* Warning header */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </motion.div>
              <BlinkingText className="font-orbitron text-sm text-destructive tracking-[0.3em]" speed={1}>
                RESTRICTED ACCESS
              </BlinkingText>
              <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </motion.div>
            </motion.div>

            {/* Lock icon with rotating ring */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="relative w-24 h-24 flex items-center justify-center mb-8"
            >
              {/* Rotating outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid hsl(var(--neon-cyan) / 0.5)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-1 rounded-full"
                style={{ border: '1px dashed hsl(var(--neon-magenta) / 0.3)' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '0 0 30px hsl(var(--neon-cyan) / 0.2), inset 0 0 30px hsl(var(--neon-cyan) / 0.1)',
                  background: 'hsl(var(--card) / 0.5)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 30px hsl(var(--neon-cyan) / 0.2), inset 0 0 30px hsl(var(--neon-cyan) / 0.1)',
                    '0 0 50px hsl(var(--neon-cyan) / 0.4), inset 0 0 40px hsl(var(--neon-cyan) / 0.2)',
                    '0 0 30px hsl(var(--neon-cyan) / 0.2), inset 0 0 30px hsl(var(--neon-cyan) / 0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Shield className="w-10 h-10 text-neon-cyan" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-orbitron text-2xl md:text-3xl font-bold text-neon-cyan mb-3 text-center tracking-wider"
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 20px hsl(180, 100%, 50%), 0 0 40px hsl(180, 100%, 50% / 0.3)',
                    '0 0 40px hsl(180, 100%, 50%), 0 0 80px hsl(180, 100%, 50% / 0.5)',
                    '0 0 20px hsl(180, 100%, 50%), 0 0 40px hsl(180, 100%, 50% / 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CLASSIFIED INTEL
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-mono text-sm text-muted-foreground mb-10 text-center max-w-md"
            >
              <TypeWriter text="Enter the correct password to access classified personal information. Unauthorized access will be logged and reported." delay={0.5} speed={0.02} />
            </motion.p>

            {/* Password form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-sm"
            >
              <motion.div
                className="relative mb-4"
                animate={{
                  boxShadow: [
                    '0 0 15px hsl(var(--neon-cyan) / 0.1)',
                    '0 0 25px hsl(var(--neon-cyan) / 0.3)',
                    '0 0 15px hsl(var(--neon-cyan) / 0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Hacker code background */}
                <div className="absolute inset-0 overflow-hidden rounded-sm pointer-events-none" style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}>
                  <div className="absolute inset-0" style={{
                    background: 'hsl(var(--card) / 0.7)',
                    backdropFilter: 'blur(2px)',
                  }} />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute font-mono text-[8px] text-neon-green/20 whitespace-nowrap"
                      style={{
                        top: `${i * 9}%`,
                        left: `${(i * 17) % 100}%`,
                        filter: 'blur(0.8px)',
                      }}
                      animate={{ x: [0, -60, 0], opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {['const decrypt = (k) =&gt; {', 'if (auth.verify(token))', 'return Buffer.from(hex)', 'socket.emit("breach")', 'await db.query(SELECT *)', 'cipher.update(payload)', 'fs.readFileSync("/root")', 'process.env.SECRET_KEY', 'exec("rm -rf /logs/*")', 'ssh root@10.0.0.1', 'nmap -sV --script vuln', 'hashcat -m 1000 -a 3'][i]}
                    </motion.div>
                  ))}
                </div>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="ENTER PASSWORD..."
                  className="w-full bg-transparent border border-border focus:border-neon-cyan/80 rounded-none px-12 py-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors relative z-10"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-cyan transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: [1, 0.5, 1], y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 0.5, repeat: Infinity } }}
                    className="font-mono text-xs text-destructive mb-4 text-center"
                    style={{ textShadow: '0 0 10px hsl(0, 84%, 60%)' }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="cyber-btn w-full text-center"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px hsl(var(--neon-cyan) / 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Fingerprint className="w-5 h-5 inline mr-2" />
                AUTHENTICATE
              </motion.button>
            </motion.form>

            {/* Bottom decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 font-mono text-xs text-muted-foreground/50 text-center space-y-1"
            >
              <BlinkingText speed={3}><p>SECURITY PROTOCOL: AES-256-GCM</p></BlinkingText>
              <p>NODE: ALPHA-{Math.floor(Math.random() * 9000 + 1000)}</p>
              <motion.p
                className="text-neon-cyan/30"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* CLASSIFIED DOSSIER */
          <motion.div
            key="dossier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onAnimationStart={() => playScanSound()}
            className="relative z-10 min-h-screen pb-20"
          >
            {/* Top bar */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-b border-neon-cyan/20"
              animate={{
                borderColor: [
                  'hsl(var(--neon-cyan) / 0.2)',
                  'hsl(var(--neon-cyan) / 0.5)',
                  'hsl(var(--neon-cyan) / 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                <motion.button
                  onClick={() => { playClickSound(); navigate('/'); }}
                  className="flex items-center gap-2 font-orbitron text-xs text-muted-foreground hover:text-neon-cyan transition-colors"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  EXIT
                </motion.button>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-neon-green"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <BlinkingText className="font-mono text-xs text-neon-green" speed={2}>ACCESS GRANTED</BlinkingText>
                  <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Wifi className="w-3 h-3 text-neon-green" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                    <Radio className="w-3 h-3 text-neon-cyan/50" />
                  </motion.div>
                  <span className="font-mono text-xs text-muted-foreground">
                    CLEARANCE: {personalData.clearanceLevel}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="container mx-auto px-6 pt-24">
              {/* Header */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1 border border-destructive/50 rounded-sm mb-4"
                  animate={{
                    borderColor: ['hsl(var(--destructive) / 0.5)', 'hsl(var(--destructive))', 'hsl(var(--destructive) / 0.5)'],
                    boxShadow: ['0 0 0px hsl(var(--destructive) / 0)', '0 0 15px hsl(var(--destructive) / 0.3)', '0 0 0px hsl(var(--destructive) / 0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                  </motion.div>
                  <BlinkingText className="font-mono text-xs text-destructive tracking-wider">
                    TOP SECRET // CLASSIFIED
                  </BlinkingText>
                </motion.div>
                <motion.h1
                  className="font-orbitron text-4xl md:text-5xl font-black text-neon-cyan tracking-wider mb-2"
                  animate={{
                    textShadow: [
                      '0 0 30px hsl(180, 100%, 50%), 0 0 60px hsl(180, 100%, 50% / 0.3)',
                      '0 0 50px hsl(180, 100%, 50%), 0 0 100px hsl(180, 100%, 50% / 0.5)',
                      '0 0 30px hsl(180, 100%, 50%), 0 0 60px hsl(180, 100%, 50% / 0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  SUBJECT DOSSIER
                </motion.h1>
                <motion.p
                  className="font-mono text-sm text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  FILE #{Math.floor(Math.random() * 900000 + 100000)} — EYES ONLY
                </motion.p>

                {/* Animated HUD elements */}
                <div className="flex justify-center gap-6 mt-4">
                  {[
                    { icon: Zap, label: 'ACTIVE' },
                    { icon: Activity, label: 'MONITORING' },
                    { icon: Radio, label: 'CONNECTED' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center gap-1 font-mono text-[10px] text-neon-cyan/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: [0.3, 0.8, 0.3], y: 0 }}
                      transition={{ delay: 0.5 + i * 0.2, opacity: { duration: 2, repeat: Infinity, delay: i * 0.5 } }}
                    >
                      <item.icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Main dossier grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Subject Profile Card */}
                <GlowCard delay={0.4} className="lg:col-span-1 holo-card p-6 relative">
                  <motion.div
                    className="absolute top-2 right-2 font-mono text-[10px] text-neon-cyan/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ID: {personalData.codename}
                  </motion.div>

                  {/* Subject photo placeholder */}
                  <motion.div
                    className="w-32 h-32 mx-auto mb-4 rounded-sm overflow-hidden"
                    style={{ border: '2px solid hsl(var(--neon-cyan) / 0.5)' }}
                    animate={{
                      boxShadow: [
                        '0 0 20px hsl(var(--neon-cyan) / 0.2)',
                        '0 0 40px hsl(var(--neon-cyan) / 0.4)',
                        '0 0 20px hsl(var(--neon-cyan) / 0.2)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
                      {/* Scanning line */}
                      <motion.div
                        className="absolute w-full h-0.5 bg-neon-cyan/50"
                        animate={{ y: ['-64px', '64px'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Fingerprint className="w-16 h-16 text-neon-cyan/30" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="space-y-3 font-mono text-sm">
                    <AnimatedInfoRow label="NAME" value={personalData.name} delay={0.5} />
                    <AnimatedInfoRow label="CODENAME" value={personalData.codename} highlight delay={0.6} />
                    <AnimatedInfoRow label="AGE" value={personalData.age} delay={0.7} />
                    <AnimatedInfoRow label="Job" value={personalData.birthday} delay={0.8} />
                    <AnimatedInfoRow label="LOCATION" value={personalData.location} delay={0.9} />
                    <AnimatedInfoRow label="STATUS" value={personalData.status} status delay={1.0} />
                  </div>
                </GlowCard>

                {/* Bio & Job */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Occupation */}
                  <GlowCard delay={0.5} color="magenta" className="holo-card p-6">
                    <AnimatedSectionHeader title="OCCUPATION" />
                    <motion.p
                      className="font-mono text-sm text-neon-magenta mt-3"
                      animate={{
                        textShadow: [
                          '0 0 10px hsl(300, 100%, 50% / 0.3)',
                          '0 0 25px hsl(300, 100%, 50% / 0.6)',
                          '0 0 10px hsl(300, 100%, 50% / 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TypeWriter text={personalData.job} delay={0.8} speed={0.04} />
                    </motion.p>
                  </GlowCard>

                  {/* Bio */}
                  <GlowCard delay={0.6} color="purple" className="holo-card p-6">
                    <AnimatedSectionHeader title="SUBJECT BRIEFING" />
                    <motion.p
                      className="font-rajdhani text-base text-foreground/80 mt-3 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <TypeWriter text={personalData.bio} delay={1} speed={0.015} />
                    </motion.p>
                  </GlowCard>

                  {/* Skills */}
                  <GlowCard delay={0.7} className="holo-card p-6">
                    <AnimatedSectionHeader title="SKILL ASSESSMENT" />
                    <div className="space-y-4 mt-4">
                      {personalData.skills.map((skill, i) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.15 }}
                        >
                          <div className="flex justify-between font-mono text-xs mb-1">
                            <motion.span
                              className="text-foreground/70"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            >
                              {skill.name}
                            </motion.span>
                            <motion.span
                              className="text-neon-cyan"
                              animate={{
                                textShadow: [
                                  '0 0 5px hsl(180, 100%, 50% / 0.5)',
                                  '0 0 15px hsl(180, 100%, 50% / 0.8)',
                                  '0 0 5px hsl(180, 100%, 50% / 0.5)',
                                ],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            >
                              {skill.level}%
                            </motion.span>
                          </div>
                          <div className="h-2 bg-card rounded-sm overflow-hidden border border-border relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: 1 + i * 0.15, duration: 1.2, ease: 'easeOut' }}
                              className="h-full rounded-sm relative overflow-hidden"
                              style={{
                                background: `linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-magenta)))`,
                                boxShadow: '0 0 10px hsl(var(--neon-cyan) / 0.5)',
                              }}
                            >
                              {/* Shimmer effect */}
                              <motion.div
                                className="absolute inset-0"
                                style={{
                                  background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.3), transparent)',
                                }}
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1.5 + i * 0.2 }}
                              />
                            </motion.div>
                            {/* Pulse glow on the bar */}
                            {skill.level === 100 && (
                              <motion.div
                                className="absolute inset-0"
                                animate={{
                                  boxShadow: [
                                    'inset 0 0 5px hsl(var(--neon-green) / 0.3)',
                                    'inset 0 0 15px hsl(var(--neon-green) / 0.6)',
                                    'inset 0 0 5px hsl(var(--neon-green) / 0.3)',
                                  ],
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>
                </div>

                {/* Hobbies / Interests */}
                <GlowCard delay={0.8} color="magenta" className="lg:col-span-3 holo-card p-6">
                  <AnimatedSectionHeader title="KNOWN INTERESTS & ACTIVITIES" />
                  <div className="flex flex-wrap gap-3 mt-4">
                    {personalData.hobbies.map((hobby, i) => (
                      <motion.span
                        key={hobby}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1 + i * 0.12, type: 'spring', stiffness: 200 }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.4)',
                          borderColor: 'hsl(var(--neon-cyan))',
                        }}
                        onMouseEnter={() => playHoverSound()}
                        className="px-4 py-2 font-mono text-xs border border-neon-cyan/30 text-neon-cyan bg-card/50 cursor-default"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        >
                          {hobby}
                        </motion.span>
                      </motion.span>
                    ))}
                  </div>
                </GlowCard>
              </div>

              {/* Bottom classified stamp */}
              <motion.div
                initial={{ opacity: 0, rotate: -5 }}
                animate={{ opacity: [0.1, 0.2, 0.1], rotate: -5 }}
                transition={{ opacity: { duration: 3, repeat: Infinity } }}
                className="fixed bottom-10 right-10 font-orbitron text-6xl font-black text-destructive pointer-events-none select-none"
                style={{ textShadow: '0 0 20px hsl(0, 84%, 60%)' }}
              >
                CLASSIFIED
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimatedInfoRow({ label, value, highlight, status, delay = 0 }: { label: string; value: string; highlight?: boolean; status?: boolean; delay?: number }) {
  return (
    <motion.div
      className="flex justify-between items-center border-b border-border/30 pb-2"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <motion.span
        className="text-muted-foreground text-xs"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {label}
      </motion.span>
      <motion.span
        className={`text-xs ${highlight ? 'text-neon-magenta' : status ? 'text-neon-green' : 'text-foreground'}`}
        style={
          highlight ? { textShadow: '0 0 8px hsl(300, 100%, 50% / 0.5)' }
          : status ? { textShadow: '0 0 8px hsl(110, 100%, 54% / 0.5)' }
          : {}
        }
        animate={
          status ? { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }
          : highlight ? {
            textShadow: [
              '0 0 8px hsl(300, 100%, 50% / 0.5)',
              '0 0 20px hsl(300, 100%, 50% / 0.8)',
              '0 0 8px hsl(300, 100%, 50% / 0.5)',
            ],
          }
          : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      >
        {value}
      </motion.span>
    </motion.div>
  );
}

function AnimatedSectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="w-1.5 h-6 bg-neon-cyan"
        animate={{
          boxShadow: [
            '0 0 10px hsl(var(--neon-cyan))',
            '0 0 25px hsl(var(--neon-cyan))',
            '0 0 10px hsl(var(--neon-cyan))',
          ],
          opacity: [1, 0.7, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.h2
        className="font-orbitron text-sm tracking-[0.2em] text-neon-cyan"
        animate={{
          textShadow: [
            '0 0 5px hsl(180, 100%, 50% / 0.3)',
            '0 0 15px hsl(180, 100%, 50% / 0.6)',
            '0 0 5px hsl(180, 100%, 50% / 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(90deg, hsl(var(--neon-cyan) / 0.3), transparent)' }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
