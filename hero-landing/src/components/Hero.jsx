import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const ENTER_EMAIL_TEXT = "Enter Your Email Here For Early Access";
const SUBMITTED_TEXT = "You Will Receive Notifications By Email";
const TYPE_INTERVAL_MS = 60;
const RESET_DELAY_MS = 4000;

export default function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [email, setEmail] = useState("");
  const typeTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  const typeText = (text) => {
    clearInterval(typeTimerRef.current);
    setPlaceholder("");
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i += 1;
      setPlaceholder(text.slice(0, i));
      if (i >= text.length) clearInterval(typeTimerRef.current);
    }, TYPE_INTERVAL_MS);
  };

  useEffect(() => {
    if (showForm && !submitted) typeText(ENTER_EMAIL_TEXT);
  }, [showForm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      clearInterval(typeTimerRef.current);
      clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleGetAccess = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    typeText(SUBMITTED_TEXT);
    resetTimerRef.current = setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setEmail("");
      setPlaceholder("");
    }, RESET_DELAY_MS);
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
          >
            BUILD A NO-CODE AI APP IN MINUTES
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          >
            A new way to think and create
            <br className="hidden md:block" />{" "}
            with computers
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="min-h-[50px] mt-2 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.button
                  key="cta-button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleGetAccess}
                  className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
                >
                  Get early access
                </motion.button>
              ) : (
                <motion.form
                  key="cta-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    disabled={submitted}
                    className="bg-transparent text-white placeholder-white/45 flex-1 outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={submitted}
                    className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-white cursor-pointer"
                  >
                    {submitted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#"
            className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide"
          >
            Play Video Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
