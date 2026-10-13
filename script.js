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
    
    // Wait for animation, then hide overlay and trigger animations
    setTimeout(() => {
        overlay.classList.add('hidden');
        fireConfetti();
        startFallingFlowers();
    }, 1500);
});

// --- Falling Flowers Animation ---
function startFallingFlowers() {
    const container = document.getElementById('flower-container');
    const colors = ['#e84393', '#fdcb6e', '#ff7675', '#d63031']; // Pink, Gold, Light Red, Deep Red
    
    setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('flower-petal');
        
        // Randomize starting position, size, duration, and color
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4-7s fall
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        // Randomize petal color using inline SVG
        const color = colors[Math.floor(Math.random() * colors.length)].replace('#', '%23');
        petal.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12,2C12,2 8,6 8,12C8,18 12,22 12,22C12,22 16,18 16,12C16,6 12,2 12,2Z"/></svg>')`;

        container.appendChild(petal);
        
        // Remove after animation completes
        setTimeout(() => {
            petal.remove();
        }, 7000);
    }, 400); // New petal every 400ms
}


function fireConfetti() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

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
    e.preventDefault(); 
    
    // Disable button and show loading text
    const submitBtn = rsvpForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="en">Submitting...</span><span class="hi">जमा हो रहा है...</span>';
    submitBtn.disabled = true;

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

    // Replace this URL with your Google Apps Script Web App URL
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
                        <p>Your accommodation in Ajmer is at <strong>Hotel Moresta Restaurant Bar With RoofTop Restaurant</strong>.</p>
                        <a href="https://maps.app.goo.gl/efPpnfZ1eQESjVrf7?g_st=aw" target="_blank" class="glass-button" style="display:inline-block; padding:10px 15px; margin-top:10px; text-decoration:none; border-radius:5px;">View Hotel on Map</a>
                    `;
                    if(dest === 'both') {
                        hotelInfoHtml += `<p style="margin-top:15px;"><em>Udaipur hotel information is coming soon!</em></p>`;
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
            alert('There was an error submitting your RSVP. Please try again.');
        });
});
