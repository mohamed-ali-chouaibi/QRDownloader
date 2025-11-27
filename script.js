const cards = document.querySelectorAll('.card');
const wifiForm = document.getElementById('wifi-form');
const urlForm = document.getElementById('url-form');
const generateBtn = document.getElementById('generate-btn');
const wifiSecurity = document.getElementById('wifi-security');
const wifiPassword = document.getElementById('wifi-password');

let selectedType = 'wifi';

cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));

        card.classList.add('active');

        selectedType = card.getAttribute('data-type');

        if (selectedType === 'wifi') {
            wifiForm.classList.add('active');
            urlForm.classList.remove('active');
        } else if (selectedType === 'url') {
            urlForm.classList.add('active');
            wifiForm.classList.remove('active');
        }
    });
});

const toggleButtons = document.querySelectorAll('.toggle-password');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const eyeOpen = button.querySelector('.eye-open');
        const eyeClosed = button.querySelector('.eye-closed');

        if (input.type === 'password') {
            input.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            input.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    });
});

wifiSecurity.addEventListener('change', () => {
    if (wifiSecurity.value === 'nopass') {
        wifiPassword.disabled = true;
        wifiPassword.required = false;
        wifiPassword.value = '';
        wifiPassword.placeholder = 'No password required';
    } else {
        wifiPassword.disabled = false;
        wifiPassword.required = true;
        wifiPassword.placeholder = 'Enter your Wi-Fi password';
    }
});

const modal = document.getElementById('preview-modal');
const closeModal = document.querySelector('.close');
const qrDisplay = document.getElementById('qr-display');
const modalTitle = document.getElementById('modal-title');
const pdfIcon = document.getElementById('pdf-icon');
const pdfCardTitle = document.getElementById('pdf-card-title');
const pdfMainText = document.getElementById('pdf-main-text');
const pdfDetails = document.getElementById('pdf-details');
const pdfInstruction = document.getElementById('pdf-instruction');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const createNewBtn = document.getElementById('create-new-btn');

let currentQRData = '';
let currentType = '';
let currentDetails = {};

generateBtn.addEventListener('click', () => {
    if (selectedType === 'wifi') {
        const ssid = document.getElementById('wifi-ssid').value.trim();
        const password = document.getElementById('wifi-password').value;
        const security = wifiSecurity.value;

        if (!ssid) {
            alert('Please enter a Wi-Fi network name.');
            return;
        }

        if (security !== 'nopass' && !password) {
            alert('Please enter a Wi-Fi password.');
            return;
        }

        const securityType = security === 'nopass' ? 'nopass' : security;
        const wifiString = `WIFI:T:${securityType};S:${ssid};P:${password};;`;

        currentDetails = { ssid, password, security };
        generateQRCode(wifiString, 'wifi');

    } else if (selectedType === 'url') {
        const url = document.getElementById('website-url').value.trim();
        const title = document.getElementById('custom-title').value.trim();

        if (!url) {
            alert('Please enter a website URL.');
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('Please include "http://" or "https://" in your URL.');
            return;
        }

        currentDetails = { url, title };
        generateQRCode(url, 'url');
    }
});

function generateQRCode(data, type) {
    qrDisplay.innerHTML = '';

    currentQRData = data;
    currentType = type;

    new QRCode(qrDisplay, {
        text: data,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });

    if (type === 'wifi') {
        updateWiFiPreview();
    } else if (type === 'url') {
        updateURLPreview();
    }

    modal.style.display = 'block';
}

function updateWiFiPreview() {
    modalTitle.textContent = 'Your Wi-Fi QR Code is Ready!';

    pdfIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
    `;

    pdfCardTitle.textContent = 'Connect to Wi-Fi';
    pdfMainText.textContent = currentDetails.ssid;

    let detailsHTML = '';
    if (currentDetails.security !== 'nopass' && currentDetails.password) {
        detailsHTML = `
            <div class="pdf-detail-item">
                <span class="pdf-detail-label">Password:</span>
                <span class="pdf-detail-value">${currentDetails.password}</span>
            </div>
        `;
    }
    pdfDetails.innerHTML = detailsHTML;

    pdfInstruction.textContent = 'Scan to connect automatically';
}

function updateURLPreview() {
    modalTitle.textContent = 'Your Website QR Code is Ready!';

    pdfIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    `;

    pdfCardTitle.textContent = 'Scan to Visit';
    pdfMainText.textContent = currentDetails.title || currentDetails.url;

    pdfDetails.innerHTML = `
        <div class="pdf-url-full">${currentDetails.url}</div>
    `;

    pdfInstruction.textContent = 'Scan to open the website';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

createNewBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.getElementById('wifi-ssid').value = '';
    document.getElementById('wifi-password').value = '';
    document.getElementById('website-url').value = '';
    document.getElementById('custom-title').value = '';
});

downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const canvas = qrDisplay.querySelector('canvas');
    if (!canvas) return;

    const qrDataUrl = canvas.toDataURL('image/png');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    if (currentType === 'wifi') {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        let yPos = 55;

        pdf.setFontSize(44);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(102, 126, 234);
        pdf.text('Wi-Fi Network', pageWidth / 2, yPos, { align: 'center' });

        yPos += 20;

        pdf.setFontSize(34);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(currentDetails.ssid, pageWidth / 2, yPos, { align: 'center' });

        yPos += 25;

        const qrSize = 95;
        const qrX = (pageWidth - qrSize) / 2;

        pdf.setFillColor(102, 126, 234);
        pdf.roundedRect(qrX - 6, yPos - 6, qrSize + 12, qrSize + 12, 6, 6, 'F');

        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(qrX - 3, yPos - 3, qrSize + 6, qrSize + 6, 4, 4, 'F');

        pdf.addImage(qrDataUrl, 'PNG', qrX, yPos, qrSize, qrSize);

        yPos += qrSize + 22;

        if (currentDetails.security !== 'nopass' && currentDetails.password) {
            pdf.setFillColor(240, 242, 255);
            pdf.roundedRect(25, yPos - 10, pageWidth - 50, 32, 8, 8, 'F');

            pdf.setFillColor(102, 126, 234);
            pdf.roundedRect(25, yPos - 10, 4, 32, 2, 2, 'F');

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(102, 126, 234);
            pdf.text('PASSWORD', 35, yPos - 2);

            yPos += 10;

            pdf.setFontSize(20);
            pdf.setFont('courier', 'bold');
            pdf.setTextColor(51, 51, 51);
            pdf.text(currentDetails.password, pageWidth / 2, yPos, { align: 'center' });

            yPos += 18;
        }

        yPos += 8;

        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(102, 102, 102);
        pdf.text('Scan this QR code with your phone camera', pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;
        pdf.text('to connect to the Wi-Fi network automatically', pageWidth / 2, yPos, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generated by QR Studio', pageWidth / 2, pageHeight - 10, { align: 'center' });

        const filename = `WiFi-${currentDetails.ssid.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        pdf.save(filename);

    } else if (currentType === 'url') {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        let yPos = 55;

        pdf.setFontSize(44);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(102, 126, 234);
        pdf.text('Visit Website', pageWidth / 2, yPos, { align: 'center' });

        yPos += 20;

        const displayText = currentDetails.title || currentDetails.url;
        const splitTitle = pdf.splitTextToSize(displayText, pageWidth - 50);

        pdf.setFontSize(30);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        pdf.text(splitTitle, pageWidth / 2, yPos, { align: 'center' });

        yPos += splitTitle.length * 10 + 18;

        const qrSize = 95;
        const qrX = (pageWidth - qrSize) / 2;

        pdf.setFillColor(102, 126, 234);
        pdf.roundedRect(qrX - 6, yPos - 6, qrSize + 12, qrSize + 12, 6, 6, 'F');

        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(qrX - 3, yPos - 3, qrSize + 6, qrSize + 6, 4, 4, 'F');

        pdf.addImage(qrDataUrl, 'PNG', qrX, yPos, qrSize, qrSize);

        yPos += qrSize + 22;

        pdf.setFillColor(240, 242, 255);
        pdf.roundedRect(25, yPos - 8, pageWidth - 50, 28, 8, 8, 'F');

        pdf.setFillColor(102, 126, 234);
        pdf.roundedRect(25, yPos - 8, 4, 28, 2, 2, 'F');

        pdf.setFontSize(10);
        pdf.setFont('courier', 'normal');
        pdf.setTextColor(100, 100, 100);
        const splitUrl = pdf.splitTextToSize(currentDetails.url, pageWidth - 70);
        pdf.text(splitUrl, pageWidth / 2, yPos + 2, { align: 'center' });

        yPos += 32;

        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(102, 102, 102);
        pdf.text('Scan this QR code with your phone camera', pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;
        pdf.text('to open this website in your browser', pageWidth / 2, yPos, { align: 'center' });

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(150, 150, 150);
        pdf.text('Generated by QR Studio', pageWidth / 2, pageHeight - 10, { align: 'center' });

        const titleSlug = (currentDetails.title || 'Website').replace(/[^a-z0-9]/gi, '_');
        const filename = `QR-Website-${titleSlug}.pdf`;
        pdf.save(filename);
    }
});
