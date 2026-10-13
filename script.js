// --- Advanced Layout Interactions ---

// Language Toggle Logic
const langToggleBtn = document.getElementById('lang-toggle');
let currentLang = 'en';

langToggleBtn.addEventListener('click', () => {
    if (currentLang === 'en') {
        document.body.classList.remove('lang-en');
        document.body.classList.add('lang-hi');
        currentLang = 'hi';
    } else {
        document.body.classList.remove('lang-hi');
        document.body.classList.add('lang-en');
        currentLang = 'en';
    }
});

// Envelope & Entrance Animation
const envelope = document.getElementById('envelope');
const overlay = document.getElementById('envelope-overlay');
const bgMusic = document.getElementById('bg-music');
const audioToggleBtn = document.getElementById('audio-toggle');
let isAudioPlaying = false;

// Attempt to play audio
function playAudio() {
    bgMusic.play().then(() => {
        isAudioPlaying = true;
        audioToggleBtn.innerText = '🔊';
    }).catch(e => {
        console.log("Audio play blocked by browser: ", e);
        isAudioPlaying = false;
        audioToggleBtn.innerText = '🔇';
    });
}

audioToggleBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
        bgMusic.pause();
        isAudioPlaying = false;
        audioToggleBtn.innerText = '🔇';
    } else {
        playAudio();
    }
});

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    playAudio();
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        fireConfetti();
        createMusicalNotes();
    }, 1500);
});

// Create Floating Musical Notes
function createMusicalNotes() {
    const container = document.getElementById('musical-notes-container');
    const notes = ['♪', '♫', '♬', '♩'];
    
    setInterval(() => {
        const note = document.createElement('div');
        note.innerText = notes[Math.floor(Math.random() * notes.length)];
        note.classList.add('musical-note');
        // Random horizontal position near center
        note.style.left = (35 + Math.random() * 30) + '%'; 
        note.style.bottom = '30%';
        note.style.animationDuration = (4 + Math.random() * 3) + 's';
        
        container.appendChild(note);
        
        setTimeout(() => {
            note.remove();
        }, 7000);
    }, 900);
}

// Confetti (Fired once on entry and on RSVP)
function fireConfetti() {
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100, colors: ['#c5a059', '#e6c887', '#0a192f'] };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.5, 1), y: Math.random() - 0.2 } // bias to right panel
        }));
    }, 250);
}

// Intersection Observer for Smooth Scroll Reveals
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observer.observe(el);
});

// Countdown Logic
const targetDate = new Date("Nov 21, 2026 21:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = "<h3 style='color:var(--primary-dark); font-family:Cinzel,serif;'>The Wedding has Started!</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('mins').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('secs').innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);


// RSVP Form Logic & Google Sheets Integration
const attendanceSelect = document.getElementById('attendance');
const destWrapper = document.getElementById('destination-wrapper');
const destinationSelect = document.getElementById('rsvp-destination');
const travelDetails = document.getElementById('travel-details');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpResponse = document.getElementById('rsvp-response');

attendanceSelect.addEventListener('change', (e) => {
    if (e.target.value === 'yes') {
        destWrapper.classList.add('show');
    } else {
        destWrapper.classList.remove('show');
        travelDetails.classList.remove('show');
        destinationSelect.value = '';
    }
});

destinationSelect.addEventListener('change', (e) => {
    if (e.target.value === 'ajmer' || e.target.value === 'both') {
        travelDetails.classList.add('show');
    } else {
        travelDetails.classList.remove('show');
    }
});

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    // UI Loading State
    const submitBtn = rsvpForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="en">Submitting...</span><span class="hi">जमा हो रहा है...</span>';
    submitBtn.disabled = true;

    // Collect Data
    const guestName = document.getElementById('guest-name').value;
    const attStatus = attendanceSelect.value;
    const dest = destinationSelect.value;
    const travelFrom = document.getElementById('travel-from').value;
    const travelTo = document.getElementById('travel-to').value;
    const travelTime = document.getElementById('travel-time').value;

    const formData = new FormData();
    formData.append('Name', guestName);
    formData.append('Attendance', attStatus);
    formData.append('Destination', dest || '');
    formData.append('TravelFrom', travelFrom);
    formData.append('TravelTo', travelTo);
    formData.append('TravelTime', travelTime);

    // Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzFgHW7R1Fee4Ka065QqRzTx4DWpFIZ-6OOnzAuOZMWyiXnc5gWjsGdX9_p1tRXlBvA/exec';

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (attStatus === 'no') {
                rsvpResponse.innerHTML = `
                    <h4>Thank you for letting us know! / बताने के लिए धन्यवाद!</h4>
                    <p>We will miss you at the wedding.</p>
                `;
            } else {
                let hotelInfoHtml = '';
                if (dest === 'ajmer' || dest === 'both') {
                    hotelInfoHtml = `
                        <h4>Thank you for RSVPing! / RSVP करने के लिए धन्यवाद!</h4>
                        <p style="margin-bottom:10px;">Your accommodation in Ajmer is at <strong>Hotel Moresta Restaurant Bar With RoofTop Restaurant</strong>.</p>
                        <a href="https://maps.app.goo.gl/efPpnfZ1eQESjVrf7?g_st=aw" target="_blank" class="modern-link" style="display:inline-block;">View Hotel on Map ↗</a>
                    `;
                    if(dest === 'both') {
                        hotelInfoHtml += `<p style="margin-top:20px; color:var(--text-muted); font-size:0.9rem;"><em>Udaipur hotel information is coming soon!</em></p>`;
                    }
                } else if (dest === 'udaipur') {
                    hotelInfoHtml = `
                        <h4>Thank you for RSVPing! / RSVP करने के लिए धन्यवाद!</h4>
                        <p>Hotel information for Udaipur is coming soon. We will reach out to you once it is booked!</p>
                    `;
                }
                rsvpResponse.innerHTML = hotelInfoHtml;
                fireConfetti();
            }
            
            rsvpResponse.style.display = 'block';
            rsvpForm.style.display = 'none';
        })
        .catch(error => {
            console.error('Error!', error.message);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert('There was an error submitting your RSVP. Please check your connection and try again.');
        });
});
