/* ---------------------------------------------------------------
   Contact enquiry wizard — multi-step "conversational" form.
   Self-contained, no framework. Progressive enhancement: a <noscript>
   fallback (email + WhatsApp link) lives in Contact.astro, so no-JS
   users can still reach out. Respects prefers-reduced-motion.

   Flow (research-backed: 5 steps, one question each, easy first step,
   contact details later, labelled progress; data survives Back-nav):
     1. type    — what to create (single choice, + free-text "Something else")
     2. channel — WhatsApp or Google Meet
     3. details — conditional phone/email + optional message
     4. time    — pick a day + slot (or "I'm flexible")
     5. review  — summary + send

   Delivery (no backend needed):
     • WhatsApp   -> wa.me deep link, everything pre-filled into a chat.
     • Google Meet-> Web3Forms POST if a key is configured, else mailto.
       NOTE: a static site can't mint a real Google Meet link, so the
       chosen slot is a REQUEST Jeremy confirms with the actual invite.
--------------------------------------------------------------- */
function initWizard() {
  const root = document.querySelector('[data-wizard]');
  if (!root) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- config (injected from Contact.astro) -------------------
  let cfg = {};
  try {
    cfg = JSON.parse(root.querySelector('[data-wiz-config]').textContent);
  } catch (_) {
    cfg = {};
  }
  const availability = cfg.availability || { weekdays: [1, 2, 3, 4, 5], slots: ['10:00', '13:00', '15:30'], daysToShow: 5 };

  // --- elements ------------------------------------------------
  const steps = [...root.querySelectorAll('[data-step]')].filter((s) => s.dataset.step !== 'done');
  const donePanel = root.querySelector('[data-step="done"]');
  const progressText = root.querySelector('[data-progress-text]');
  const barFill = root.querySelector('[data-bar-fill]');
  const backBtn = root.querySelector('[data-back]');
  const nextBtn = root.querySelector('[data-next]');
  const nextLabel = root.querySelector('[data-next-label]');
  const nav = root.querySelector('[data-nav]');
  const progress = root.querySelector('[data-progress]');
  const total = steps.length;
  let idx = 0;
  let daysBuilt = false;

  const state = {
    type: '', typeLabel: '', typeOther: '',
    channel: '', channelLabel: '',
    email: '', message: '',
    dayLabel: '', slot: '', flexible: false,
  };

  const stepByName = (name) => steps.find((s) => s.dataset.step === name);
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function submitLabel() {
    if (state.channel === 'whatsapp') return 'Open WhatsApp';
    if (state.channel === 'meet') return 'Send request';
    return 'Send';
  }

  // --- render current step ------------------------------------
  function render() {
    steps.forEach((s, i) => {
      const on = i === idx;
      s.hidden = !on;
      s.classList.toggle('is-active', on);
    });
    progressText.textContent = `Step ${idx + 1} of ${total}`;
    barFill.style.width = `${((idx + 1) / total) * 100}%`;
    backBtn.hidden = idx === 0;
    nextLabel.textContent = idx === total - 1 ? submitLabel() : 'Continue';

    const name = steps[idx].dataset.step;
    if (name === 'details') syncChannelFields();
    if (name === 'time') ensureDays();
    if (name === 'review') fillSummary();

    // Auto-advance steps (a single click moves you on) don't need a Continue
    // button. Only steps with typing or a final send keep the button:
    //   • details — email / message fields
    //   • review  — the send action
    //   • type when "Something else" is picked (free-text needs a confirm)
    const needsButton =
      name === 'details' ||
      name === 'review' ||
      (name === 'type' && state.type === 'other');
    nextBtn.hidden = !needsButton;

    const q = steps[idx].querySelector('[data-q]');
    // preventScroll is essential: render() runs once on load, and a plain
    // .focus() on this heading makes the browser scroll the wizard into view —
    // yanking the whole page down to the contact section instead of opening on
    // the hero. Focus still moves for screen readers on step changes.
    if (q) q.focus({ preventScroll: true });
  }

  // --- per-step validation ------------------------------------
  function showError(step, msg) {
    const el = step.querySelector('[data-error]');
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function validate() {
    const step = steps[idx];
    const name = step.dataset.step;
    if (name === 'type') {
      if (!state.type) return showError(step, 'Please pick one to continue.'), false;
      if (state.type === 'other' && !state.typeOther.trim()) return showError(step, 'Tell me what you have in mind.'), false;
    }
    if (name === 'channel') {
      if (!state.channel) return showError(step, 'Choose how you’d like to connect.'), false;
    }
    if (name === 'details') {
      // WhatsApp path needs no field here — sending the chat delivers the
      // enquiry and reveals the sender's number automatically.
      if (state.channel === 'meet' && !validEmail(state.email)) return showError(step, 'Please enter a valid email address.'), false;
    }
    if (name === 'time') {
      if (!state.flexible && !state.slot) return showError(step, 'Pick a time, or choose “I’m flexible”.'), false;
    }
    showError(step, '');
    return true;
  }

  // --- conditional contact field (details step) ---------------
  function syncChannelFields() {
    const step = stepByName('details');
    if (!step) return;
    step.querySelectorAll('[data-when]').forEach((f) => {
      f.hidden = f.dataset.when !== state.channel;
    });
  }

  // --- time step: build day chips once ------------------------
  function ensureDays() {
    if (daysBuilt) return;
    daysBuilt = true;
    const step = stepByName('time');
    const daysWrap = step.querySelector('[data-days]');
    const wd = availability.weekdays;
    const count = availability.daysToShow || 5;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    let n = 0;
    while (n < count && n < 40) {
      d.setDate(d.getDate() + 1); // start tomorrow — avoids "today already passed" + TZ edge cases
      if (wd.includes(d.getDay())) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.setAttribute('data-day', '');
        btn.setAttribute('aria-pressed', 'false');
        btn.dataset.weekday = String(d.getDay()); // so slot list can honour per-day cut-offs
        btn.textContent = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        daysWrap.appendChild(btn);
        n++;
      }
    }
  }

  function selectDay(btn) {
    const step = stepByName('time');
    step.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    state.dayLabel = btn.textContent;
    state.slot = '';
    state.flexible = false;
    step.querySelector('[data-flexible]').setAttribute('aria-pressed', 'false');
    const slotsWrap = step.querySelector('[data-slots]');
    slotsWrap.innerHTML = '';
    // Honour per-weekday cut-offs (e.g. nothing Wed 18:30 onwards): drop any
    // slot at/after the day's cut-off. HH:MM strings sort correctly as text.
    const cutoff = (availability.cutoffs || {})[btn.dataset.weekday];
    (availability.slots || []).filter((t) => !cutoff || t < cutoff).forEach((t) => {
      const s = document.createElement('button');
      s.type = 'button';
      s.className = 'chip';
      s.setAttribute('data-slot', '');
      s.setAttribute('aria-pressed', 'false');
      s.textContent = t;
      slotsWrap.appendChild(s);
    });
    step.querySelector('[data-slots-wrap]').hidden = false;
  }

  function selectSlot(btn) {
    const step = stepByName('time');
    step.querySelectorAll('[data-slot]').forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    state.slot = btn.textContent;
    state.flexible = false;
    step.querySelector('[data-flexible]').setAttribute('aria-pressed', 'false');
    autoAdvance();
  }

  function selectFlexible(btn) {
    const step = stepByName('time');
    state.flexible = true;
    state.slot = '';
    state.dayLabel = '';
    btn.setAttribute('aria-pressed', 'true');
    step.querySelectorAll('[data-day],[data-slot]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    step.querySelector('[data-slots-wrap]').hidden = true;
    autoAdvance();
  }

  // --- review summary -----------------------------------------
  function summaryParts() {
    const type = state.type === 'other' ? (state.typeOther.trim() || 'Something else') : state.typeLabel;
    const time = state.flexible
      ? 'I’m flexible — please suggest a time'
      : (state.dayLabel ? `${state.dayLabel} at ${state.slot} (CET, The Hague)` : 'Not specified');
    return { type, time, contact: state.email };
  }

  function fillSummary() {
    const { type, time, contact } = summaryParts();
    const set = (key, val) => {
      const el = root.querySelector(`[data-sum="${key}"]`);
      if (el) el.textContent = val;
    };
    set('type', type);
    set('channel', state.channelLabel);
    set('time', time);
    // WhatsApp needs no contact detail (the chat carries it), so hide that row.
    const contactRow = root.querySelector('[data-sum-contact-row]');
    if (contactRow) contactRow.hidden = state.channel === 'whatsapp';
    set('contact', contact);
    const msgRow = root.querySelector('[data-sum-message-row]');
    if (msgRow) {
      msgRow.hidden = !state.message.trim();
      const m = root.querySelector('[data-sum="message"]');
      if (m) m.textContent = state.message.trim();
    }
  }

  // --- delivery ------------------------------------------------
  function sendWhatsApp() {
    const { type, time } = summaryParts();
    const lines = [
      'Hi Jeremy! I’d love to work with you.',
      '',
      `• Project: ${type}`,
      state.message.trim() ? `• Details: ${state.message.trim()}` : null,
      `• Preferred time: ${time}`,
      '',
      '(via snapsbyrosa.com)',
    ].filter((l) => l !== null);
    const num = (cfg.whatsapp || '').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${num}?text=${encodeURIComponent(lines.join('\n'))}`;
    const fallback = donePanel.querySelector('[data-wa-fallback]');
    if (fallback) fallback.href = url;
    window.open(url, '_blank', 'noopener');
    showDone('whatsapp');
  }

  async function sendMeet() {
    const { type, time } = summaryParts();
    const payload = {
      project: type,
      details: state.message.trim() || '—',
      channel: 'Google Meet',
      email: state.email,
      preferred_time: time,
    };
    const key = cfg.web3formsKey;
    setSending(true);
    if (key) {
      try {
        const r = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: key, subject: 'New enquiry — snapsbyrosa.com', from_name: 'snapsbyrosa.com', ...payload }),
        });
        if (r.ok) { setSending(false); showDone('meet'); return; }
      } catch (_) { /* fall through to mailto */ }
    }
    // mailto fallback (no key configured, or request failed)
    const subject = 'Enquiry via snapsbyrosa.com';
    const body = [
      `Project: ${type}`,
      `Details: ${state.message.trim() || '—'}`,
      `Preferred Google Meet time: ${time}`,
      `Email: ${state.email}`,
    ].join('\n');
    setSending(false);
    window.location.href = `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showDone('meet');
  }

  function setSending(on) {
    nextBtn.disabled = on;
    nextLabel.textContent = on ? 'Sending…' : submitLabel();
  }

  function showDone(channel) {
    steps.forEach((s) => { s.hidden = true; });
    if (nav) nav.hidden = true;
    if (progress) progress.hidden = true;
    donePanel.hidden = false;
    donePanel.querySelectorAll('[data-done-when]').forEach((el) => {
      el.hidden = el.dataset.doneWhen !== channel;
    });
    if (channel === 'meet') {
      const to = donePanel.querySelector('[data-done-email]');
      if (to) to.textContent = state.email;
    }
    const h = donePanel.querySelector('[data-q]');
    if (h) h.focus({ preventScroll: true });
  }

  // --- events --------------------------------------------------
  // type radios
  stepByName('type').querySelectorAll('input[name="wiz-type"]').forEach((r) => {
    r.addEventListener('change', () => {
      state.type = r.value;
      state.typeLabel = r.dataset.label || r.value;
      const otherWrap = stepByName('type').querySelector('[data-other]');
      const isOther = r.value === 'other';
      if (otherWrap) {
        otherWrap.hidden = !isOther;
        if (isOther) { const t = otherWrap.querySelector('input'); if (t) t.focus(); }
      }
      showError(stepByName('type'), '');
      // "Something else" needs a free-text confirm → show the button; any other
      // choice advances on its own.
      nextBtn.hidden = !isOther;
      if (!isOther) autoAdvance();
    });
  });
  const otherInput = stepByName('type').querySelector('[data-other] input');
  if (otherInput) otherInput.addEventListener('input', () => { state.typeOther = otherInput.value; });

  // channel radios
  stepByName('channel').querySelectorAll('input[name="wiz-channel"]').forEach((r) => {
    r.addEventListener('change', () => {
      state.channel = r.value;
      state.channelLabel = r.dataset.label || r.value;
      showError(stepByName('channel'), '');
      autoAdvance();
    });
  });

  // details inputs
  const detailsStep = stepByName('details');
  const emailEl = detailsStep.querySelector('input[name="wiz-email"]');
  const msgEl = detailsStep.querySelector('textarea[name="wiz-message"]');
  if (emailEl) emailEl.addEventListener('input', () => { state.email = emailEl.value; });
  if (msgEl) msgEl.addEventListener('input', () => { state.message = msgEl.value; });

  // time step (event delegation)
  const timeStep = stepByName('time');
  timeStep.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('[data-day]')) { selectDay(target); showError(timeStep, ''); }
    else if (target.matches('[data-slot]')) { selectSlot(target); showError(timeStep, ''); }
    else if (target.matches('[data-flexible]')) { selectFlexible(target); showError(timeStep, ''); }
  });

  // advance one step (validate first); on the last step, send.
  function advance() {
    if (!validate()) {
      const err = steps[idx].querySelector('[data-error]');
      if (err) err.focus?.();
      return;
    }
    if (idx === total - 1) {
      if (state.channel === 'whatsapp') sendWhatsApp();
      else sendMeet();
      return;
    }
    idx++;
    render();
  }

  // Auto-advance after a selection. Small delay so the user sees the option
  // highlight before the step changes (respects reduced-motion → instant).
  const autoAdvance = () => {
    const delay = prefersReduced ? 0 : 240;
    window.setTimeout(() => { if (validate()) advance(); }, delay);
  };

  // nav
  backBtn.addEventListener('click', () => {
    if (idx > 0) { idx--; render(); }
  });
  nextBtn.addEventListener('click', advance);

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWizard);
} else {
  initWizard();
}
