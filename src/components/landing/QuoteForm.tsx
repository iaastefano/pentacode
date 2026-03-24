"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Trash2, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/gtm";

export function QuoteForm() {
  const t = useTranslations("quote.form");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", description: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      drawWaveform();
    } catch {
      console.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(42, 42, 41, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        ctx.fillStyle = `rgba(177, 237, 81, ${0.3 + (dataArray[i] / 255) * 0.7})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("description", formData.description);
      if (audioBlob) fd.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/quote", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      trackEvent("quote_submit", { method: "form" });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", description: "" });
      setAudioBlob(null);
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-bold mb-2">{t("title")}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t("name")}
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30 transition-all"
        />
        <input
          type="email"
          placeholder={t("email")}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30 transition-all"
        />
      </div>

      <input
        type="tel"
        placeholder={t("phone")}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30 transition-all"
      />

      <textarea
        placeholder={t("description")}
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30 transition-all resize-none"
      />

      {/* Audio recorder */}
      <div className="space-y-3">
        <p className="text-sm text-white/40">{t("audio")}</p>

        <AnimatePresence mode="wait">
          {recording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <canvas
                ref={canvasRef}
                width={600}
                height={60}
                className="w-full h-[60px] rounded-lg bg-brand-darker"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm text-red-400">{t("recording")}</span>
                  <span className="text-sm text-white/40 font-mono">{formatTime(recordingTime)}</span>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                >
                  <Square size={14} />
                  {t("stop")}
                </button>
              </div>
            </motion.div>
          ) : audioBlob ? (
            <motion.div
              key="recorded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between p-3 rounded-lg bg-brand-green/10 border border-brand-green/20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-brand-green" />
                <span className="text-sm text-brand-green">{t("recorded")}</span>
                <span className="text-sm text-white/40 font-mono">{formatTime(recordingTime)}</span>
              </div>
              <button
                type="button"
                onClick={deleteAudio}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="record"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-white/20 text-white/50 hover:border-brand-green/40 hover:text-brand-green hover:bg-brand-green/5 transition-all w-full justify-center"
            >
              <Mic size={18} />
              {t("record")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending" || status === "success"}
        className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t("sending")}
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 size={18} />
            {t("success")}
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle size={18} />
            {t("error")}
          </>
        ) : (
          <>
            <Send size={18} />
            {t("submit")}
          </>
        )}
      </button>
    </form>
  );
}
