/* An original fairground-style loop, generated locally without audio downloads. */
(() => {
  const button = document.getElementById('circusMusic');
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!button || !AudioContextClass) { if (button) button.hidden = true; return; }
  let context, timer, playing = false, pending = false;
  const voices = new Set();
  const beat = 0.25;
  const melody = [72,76,79,76,77,81,79,77,76,79,84,79,77,76,74,71,
    72,76,79,84,83,81,79,77,76,74,72,71,72,67,72,0];
  function note(pitch, start, duration, volume, type) {
    if (!pitch) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * Math.pow(2, (pitch - 69) / 12);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    voices.add(oscillator);
    oscillator.onended = () => { voices.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(start); oscillator.stop(start + duration + 0.02);
  }
  function schedule() {
    if (!playing) return;
    const start = context.currentTime + 0.05;
    melody.forEach((pitch, index) => {
      note(pitch, start + index * beat, beat * 0.8, 0.035, 'triangle');
      if (index % 2 === 0) note(index < 16 ? 48 : 55, start + index * beat, beat * 0.7, 0.025, 'triangle');
      else [60,64,67].forEach(p => note(p, start + index * beat, beat * 0.55, 0.009, 'sine'));
    });
    timer = window.setTimeout(schedule, melody.length * beat * 1000);
  }
  function stop() {
    playing = false;
    window.clearTimeout(timer);
    voices.forEach(voice => { try { voice.stop(); } catch (_) { /* Already finished. */ } });
    voices.clear();
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('[aria-hidden]').textContent = '🎵';
  }
  button.addEventListener('click', async () => {
    if (pending) return;
    if (playing) { stop(); return; }
    pending = true;
    try {
      context ||= new AudioContextClass();
      await context.resume();
      if (document.hidden) return;
      playing = true;
      button.setAttribute('aria-pressed', 'true');
      button.querySelector('[aria-hidden]').textContent = '🔊';
      schedule();
    } catch (_) { stop(); }
    finally { pending = false; }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
})();
