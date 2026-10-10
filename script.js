// --- Language Toggle Logic ---
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

// --- Envelope & Welcome Logic ---
const envelope = document.getElementById('envelope');
const overlay = document.getElementById('envelope-overlay');
const bgMusic = document.getElementById('bg-music');

envelope.addEventListener('click', () => {
    // Open Envelope
    envelope.classList.add('open');
    
    // Play Audio (browsers require user interaction to play audio)
    bgMusic.play().catch(e => console.log("Audio play blocked: ", e));
    
    // Wait for animation, then hide overlay and trigger confetti
    setTimeout(() => {
        overlay.classList.add('hidden');
        fireConfetti();
    }, 1500); // 1.5 seconds delay
});

function fireConfetti() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// --- Countdown Logic ---
// Pheras: Nov 21, 2026 at 9:00 PM
const targetDate = new Date("Nov 21, 2026 21:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = "<h3 style='color:var(--primary-color)'>The Wedding has Started!</h3>";
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

// --- RSVP Logic ---
const attendanceSelect = document.getElementById('attendance');
const destWrapper = document.getElementById('destination-wrapper');
const destinationSelect = document.getElementById('rsvp-destination');
const travelDetails = document.getElementById('travel-details');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpResponse = document.getElementById('rsvp-response');

attendanceSelect.addEventListener('change', (e) => {
    if (e.target.value === 'yes') {
        destWrapper.style.display = 'block';
    } else {
        destWrapper.style.display = 'none';
        travelDetails.style.display = 'none';
    }
});

destinationSelect.addEventListener('change', (e) => {
    if (e.target.value !== '') {
        travelDetails.style.display = 'block';
    } else {
        travelDetails.style.display = 'none';
    }
});

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    // In the future, we will send this data to Google Sheets via fetch()
    // For now, we simulate success and show conditional hotel logic.
    
    const attStatus = attendanceSelect.value;
    const dest = destinationSelect.value;
    
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
                <p>Your accommodation in Ajmer is at <strong>Hotel Moresta Restaurant Bar With RoofTop Restaurant</strong>.</p>
                <a href="https://maps.app.goo.gl/efPpnfZ1eQESjVrf7?g_st=aw" target="_blank" class="btn">View Hotel on Map</a>
            `;
            if(dest === 'both') {
                hotelInfoHtml += `<p style="margin-top:10px;"><em>Udaipur hotel information is coming soon!</em></p>`;
            }
        } else if (dest === 'udaipur') {
            hotelInfoHtml = `
                <h4>Thank you for RSVPing! / RSVP करने के लिए धन्यवाद!</h4>
                <p>Hotel information for Udaipur is coming soon. We will reach out to you once it is booked!</p>
            `;
        }
        
        rsvpResponse.innerHTML = hotelInfoHtml;
        fireConfetti(); // Celebrate their RSVP!
    }
    
    rsvpResponse.style.display = 'block';
    rsvpForm.style.display = 'none';
});
