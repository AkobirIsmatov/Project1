const skillIcons = {
  Python: 'fa-brands fa-python',
  Bash: 'fa-solid fa-terminal',
  Automation: 'fa-solid fa-robot',
  Scripting: 'fa-solid fa-code',
  SIEM: 'fa-solid fa-eye',
  RMM: 'fa-solid fa-screwdriver-wrench',
  'IDS/IPS': 'fa-solid fa-shield-halved',
  'EDR/XDR': 'fa-solid fa-shield-halved',
  'Computer Vision': 'fa-solid fa-eye',
  'R&D': 'fa-solid fa-flask',
  'Artificial Intelligence': 'fa-solid fa-brain',
  LLMs: 'fa-solid fa-brain',
  'Deep Learning': 'fa-solid fa-layer-group',
  'Machine Learning': 'fa-solid fa-gears',
  'Network Security': 'fa-solid fa-network-wired',
  Cybersecurity: 'fa-solid fa-user-shield',
  'Data Analytics': 'fa-solid fa-chart-line',
  Blockchain: 'fa-brands fa-bitcoin',
  Crypto: 'fa-solid fa-coins'
};

const roleIcons = {
  'Cybersecurity Specialist': 'fa-solid fa-user-shield',
  'Senior Software Engineer': 'fa-solid fa-code',
  'Network and Security Researcher': 'fa-solid fa-flask',
  'Forensics Analyst': 'fa-solid fa-magnifying-glass',
  'Lab Assistant': 'fa-solid fa-vials'
};

const trackPrevious = (el) => {
  const radios = el.querySelectorAll('input[type="radio"]');
  let previousValue = null;

  const initiallyChecked = el.querySelector('input[type="radio"]:checked');
  if (initiallyChecked) {
    previousValue = initiallyChecked.getAttribute('c-option');
    el.setAttribute('c-previous', previousValue);
  }

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        el.setAttribute('c-previous', previousValue ?? '');
        previousValue = radio.getAttribute('c-option');
      }
    });
  });
};

const profileIcons = {
  GitHub: 'fa-brands fa-github',
  LinkedIn: 'fa-brands fa-linkedin',
  TryHackMe: 'fa-solid fa-user-secret'
};

function getSkillIcon(skill) {
  return skillIcons[skill] || 'fa-solid fa-circle';
}

function getRoleIcon(title) {
  for (const [key, icon] of Object.entries(roleIcons)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return 'fa-solid fa-briefcase';
}

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.querySelector('.switcher');
  if (switcher) {
    const radios = switcher.querySelectorAll('input[type="radio"]');
    const stored = localStorage.getItem('theme') || 'dark';
    const active = switcher.querySelector(`input[value="${stored}"]`);
    if (active) active.checked = true;
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
    trackPrevious(switcher);
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          localStorage.setItem('theme', radio.value);
        }
      });
    });
  }

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

    fetch('CV_info.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch CV_info.json: ${res.status}`);
        }
        return res.json();
      })
      .then(data => populate(data))
      .catch(err => {
        console.error('Error loading CV_info.json:', err);
        const container = document.getElementById('main-content');
        if (container) {
          const msg = document.createElement('p');
          msg.textContent = 'Unable to load CV information.';
          container.appendChild(msg);
        }
      });

    const contactToggle = document.getElementById('contact-toggle');
    const contactContent = document.getElementById('contact-content');
    if (contactToggle && contactContent) {
      contactToggle.addEventListener('click', () => {
        const isOpen = contactContent.classList.toggle('open');
        contactToggle.classList.toggle('open', isOpen);
        contactToggle.setAttribute('aria-expanded', isOpen);
        contactContent.style.maxHeight = isOpen ? contactContent.scrollHeight + 'px' : 0;
      });
    }

    const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  const navLinks = document.querySelectorAll('.nav-links a');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.forEach(link =>
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(section => sectionObserver.observe(section));

  const backToTop = document.getElementById('back-to-top');
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  window.dispatchEvent(new Event('scroll'));
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const copyrightIcon = document.querySelector('.copyright-icon');
  if (copyrightIcon) {
    copyrightIcon.addEventListener('click', () => {
      copyrightIcon.classList.toggle('active');
    });
  }

  sections.forEach(sec => {
    sec.addEventListener('mousemove', e => {
      const rect = sec.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
      sec.style.setProperty('--tiltX', `${x}deg`);
      sec.style.setProperty('--tiltY', `${y}deg`);
    });

    sec.addEventListener('mouseleave', () => {
      sec.style.setProperty('--tiltX', '0deg');
      sec.style.setProperty('--tiltY', '0deg');
    });
  });

  initCodeBackground();
});

function populate(data) {
  document.getElementById('name').textContent = data.name;
  const headlineEl = document.getElementById('headline');
  const summaryEl = document.getElementById('summary');
  typeWriter(data.headline, headlineEl, 0, () => {
    headlineEl.classList.remove('tagline');
    summaryEl.classList.add('tagline');
    typeWriter(
      data.summary,
      summaryEl,
      0,
      () => summaryEl.classList.remove('tagline'),
      50
    );
  }, 50);

  const contact = document.getElementById('contact-content');
  contact.textContent = '';

  const phoneP = document.createElement('p');
  const phoneLink = document.createElement('a');
  phoneLink.href = `tel:${data.contact.phone}`;
  phoneLink.className = 'contact-link';
  phoneLink.setAttribute('aria-label', 'Phone');
  const phoneIcon = document.createElement('i');
  phoneIcon.className = 'fa-solid fa-phone';
  phoneLink.appendChild(phoneIcon);
  phoneLink.appendChild(document.createTextNode(data.contact.phone));
  phoneP.appendChild(phoneLink);
  const phoneBtn = document.createElement('button');
  phoneBtn.className = 'copy-btn';
  phoneBtn.setAttribute('data-copy', data.contact.phone);
  phoneBtn.setAttribute('aria-label', 'Copy phone');
  const phoneBtnIcon = document.createElement('i');
  phoneBtnIcon.className = 'fa-solid fa-copy';
  phoneBtn.appendChild(phoneBtnIcon);
  phoneP.appendChild(phoneBtn);
  contact.appendChild(phoneP);

  const emailP = document.createElement('p');
  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${data.contact.email}`;
  emailLink.className = 'contact-link';
  emailLink.setAttribute('aria-label', 'Email');
  const emailIcon = document.createElement('i');
  emailIcon.className = 'fa-solid fa-envelope';
  emailLink.appendChild(emailIcon);
  emailLink.appendChild(document.createTextNode(data.contact.email));
  emailP.appendChild(emailLink);
  const emailBtn = document.createElement('button');
  emailBtn.className = 'copy-btn';
  emailBtn.setAttribute('data-copy', data.contact.email);
  emailBtn.setAttribute('aria-label', 'Copy email');
  const emailBtnIcon = document.createElement('i');
  emailBtnIcon.className = 'fa-solid fa-copy';
  emailBtn.appendChild(emailBtnIcon);
  emailP.appendChild(emailBtn);
  contact.appendChild(emailP);

  const locP = document.createElement('p');
  const locLink = document.createElement('a');
  locLink.href = `https://maps.google.com/?q=${encodeURIComponent(data.contact.location)}`;
  locLink.className = 'contact-link';
  locLink.target = '_blank';
  locLink.rel = 'noopener';
  locLink.setAttribute('aria-label', 'Location');
  const locIcon = document.createElement('i');
  locIcon.className = 'fa-solid fa-location-dot';
  locLink.appendChild(locIcon);
  locLink.appendChild(document.createTextNode(data.contact.location));
  locP.appendChild(locLink);
  contact.appendChild(locP);

  data.contact.profiles.forEach(p => {
    const pEl = document.createElement('p');
    const a = document.createElement('a');
    a.href = p.url;
    a.className = 'contact-link';
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', p.site);
    const icon = document.createElement('i');
    const iconClass = profileIcons[p.site] || 'fa-solid fa-link';
    icon.className = iconClass;
    a.appendChild(icon);
    a.appendChild(document.createTextNode(p.site));
    pEl.appendChild(a);
    contact.appendChild(pEl);
  });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-copy');
        const icon = btn.querySelector('i');
        const original = icon.className;
        navigator.clipboard.writeText(value).then(() => {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = original;
          }, 2000);
        });
      });
    });

    if (contact.classList.contains('open')) {
      contact.style.maxHeight = contact.scrollHeight + 'px';
    }

  const skills = document.getElementById('skills-list');
  data.skills.forEach(s => {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    icon.className = getSkillIcon(s);
    li.appendChild(icon);
    li.appendChild(document.createTextNode(` ${s}`));
    skills.appendChild(li);
  });

  const languages = document.getElementById('languages-list');
  data.languages.forEach(lang => {
    const li = document.createElement('li');
    li.textContent = `${lang.language} (${lang.proficiency})`;
    languages.appendChild(li);
  });

  const edu = document.getElementById('education-content');
  data.education.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('entry');

    const h3 = document.createElement('h3');
    const gradIcon = document.createElement('i');
    gradIcon.className = 'fa-solid fa-graduation-cap';
    h3.appendChild(gradIcon);
    h3.appendChild(document.createTextNode(` ${item.degree}`));
    div.appendChild(h3);

    const periodP = document.createElement('p');
    periodP.textContent = `${item.institution} (${item.start_date} – ${item.end_date})`;
    div.appendChild(periodP);

    if (item.gpa) {
      const gpaP = document.createElement('p');
      gpaP.textContent = `GPA: ${item.gpa}`;
      div.appendChild(gpaP);
    }

    if (item.notes && item.notes.length) {
      const ul = document.createElement('ul');
      item.notes.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    edu.appendChild(div);
  });

  const exp = document.getElementById('experience-content');
  data.work_experience.forEach(job => {
    if (job.roles) {
      job.roles.forEach(role => exp.appendChild(buildJob(role, job.company)));
    } else {
      exp.appendChild(buildJob(job, job.company));
    }
  });

  const projects = document.getElementById('projects-content');
  Object.entries(data.projects).forEach(([cat, items]) => {
    const h3 = document.createElement('h3');
    h3.textContent = titleCase(cat.replace(/_/g, ' '));
    projects.appendChild(h3);
    const ul = document.createElement('ul');
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    });
    projects.appendChild(ul);
  });

  const publications = document.getElementById('publications-list');
  data.publications.forEach(pub => {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = pub.title;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(', '));
    const em = document.createElement('em');
    em.textContent = pub.venue;
    li.appendChild(em);
    li.appendChild(document.createTextNode(` (${pub.date})`));
    publications.appendChild(li);
  });

  const certs = document.getElementById('certifications-list');
  data.certifications_training.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    certs.appendChild(li);
  });

  const achievements = document.getElementById('achievements-list');
  data.achievements.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    achievements.appendChild(li);
  });
}

function buildJob(role, company) {
  const div = document.createElement('div');
  div.classList.add('entry');

  const h3 = document.createElement('h3');
  const icon = document.createElement('i');
  icon.className = getRoleIcon(role.title);
  h3.appendChild(icon);
  h3.appendChild(document.createTextNode(` ${role.title} — ${company}`));
  div.appendChild(h3);

  const periodP = document.createElement('p');
  periodP.classList.add('period');
  periodP.textContent = formatPeriod(role.start_date, role.end_date);
  div.appendChild(periodP);

  const ul = document.createElement('ul');
  role.highlights.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    ul.appendChild(li);
  });
  div.appendChild(ul);
  return div;
}

function formatPeriod(start, end) {
  const formattedEnd = end && end.toLowerCase() !== 'present' ? end : 'Present';
  return `${start} – ${formattedEnd}`;
}

function titleCase(str) {
  return str.replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1));
}

function typeWriter(text, el, i = 0, done, speed = 100) {
  if (i < text.length) {
    el.textContent += text.charAt(i);
    setTimeout(() => typeWriter(text, el, i + 1, done, speed), speed);
  } else if (typeof done === 'function') {
    done();
  }
}

function initMatrix(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const fontSize = 10;
  let columns = 0;
  let drops = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6).split('');

  function resize() {
    canvas.height = window.innerHeight;
    canvas.width = canvas.offsetWidth;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
    ctx.font = fontSize + 'px monospace';
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#0f0';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 33);
}

function initCodeBackground() {
  const snippets = [
    'const x = 42;',
    'console.log("Hello, world!");',
    'for (let i = 0; i < 10; i++) { }',
    'if (value) {\n  doSomething();\n}',
    'let sum = (a, b) => a + b;'
  ];
  document.querySelectorAll('.section').forEach(section => {
    const bg = document.createElement('div');
    bg.className = 'code-bg';
    section.appendChild(bg);

    function cycle() {
      const snippet = snippets[Math.floor(Math.random() * snippets.length)];
      bg.textContent = '';
      bg.style.opacity = 0.2;
      bg.style.top = `${Math.random() * 80 + 10}%`;
      bg.style.left = `${Math.random() * 80 + 10}%`;
      typeWriter(snippet, bg, 0, () => {
        setTimeout(() => {
          bg.style.opacity = 0;
          setTimeout(cycle, 1000);
        }, 2000);
      });
    }

    cycle();
  });
}
