// Global variables
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

// Voice reading variables
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isReading = false;
let voiceSpeed = 1;
let voiceVolume = 1;

// Start quiz function
function startQuiz() {
    showPositivePopup('Great! Let\'s start learning about online safety! 🎉', () => {
        window.location.href = 'quiz1.html';
    });
}

// Show positive popup with custom message
function showPositivePopup(message, callback) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #c8e6c9 0%, #e1f5fe 100%);
        border: 4px solid #4caf50;
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: popIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <p style="font-size: 1.3rem; font-weight: bold; color: #2e7d32; margin-bottom: 1.5rem; line-height: 1.4;">${message}</p>
        <button onclick="closePopup()" style="
            background: linear-gradient(135deg, #4caf50 0%, #2196f3 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        ">Continue! 🚀</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Store callback for later use
    window.popupCallback = callback;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes popIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Close popup function
function closePopup() {
    const overlay = document.querySelector('div[style*="position: fixed"]');
    if (overlay) {
        overlay.remove();
        if (window.popupCallback) {
            window.popupCallback();
            window.popupCallback = null;
        }
    }
}

// Select answer function
function selectAnswer(element, answerIndex) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    element.classList.add('selected');
    selectedAnswer = answerIndex;
    
    // Enable submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Submit answer function
function submitAnswer(correctAnswer, explanation) {
    if (selectedAnswer === null) {
        showPositivePopup('Please choose an answer first! 😊');
        return;
    }
    
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.style.display = 'none';
    
    // Show correct/incorrect styling
    options.forEach((option, index) => {
        if (index === correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
    
    // Show feedback
    if (selectedAnswer === correctAnswer) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
            <strong>Excellent! You got it right!</strong><br><br>
            ${explanation}
        `;
        score++;
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💡</div>
            <strong>Good try! Let's learn together!</strong><br><br>
            ${explanation}
        `;
    }
    
    feedback.style.display = 'block';
    
    // Show next button
    if (nextBtn) {
        nextBtn.style.display = 'block';
    }
    
    // Update progress
    updateProgress();
}

// Update progress function
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = ((currentQuestion + 1) / 12) * 100;
        progressBar.style.width = progress + '%';
    }
}

// Navigate to next question
function nextQuestion(nextPage) {
    if (nextPage) {
        showPositivePopup('Great job! Ready for the next question? 🌟', () => {
            window.location.href = nextPage;
        });
    } else {
        // Final question - show completion
        showPositivePopup(`Amazing! You completed the quiz! 🏆<br>You got ${score} out of 12 questions right!<br>You're becoming a cybersecurity expert! 🛡️`, () => {
            window.location.href = 'index.html';
        });
    }
}

// Go to previous question
function previousQuestion(prevPage) {
    if (prevPage) {
        window.location.href = prevPage;
    }
}

// Go back to home
function goHome() {
    window.location.href = 'index.html';
}

// Form validation for demonstration
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.border = '3px solid #f44336';
            isValid = false;
        } else {
            input.style.border = '3px solid #4caf50';
        }
    });
    
    if (!isValid) {
        showPositivePopup('Please fill in all the required fields! 📝');
        return false;
    }
    
    return true;
}

// Simulate malicious website behavior
function simulateMaliciousWebsite() {
    showPositivePopup('⚠️ STOP! This is what a malicious website might do!<br><br>It might try to steal your information or trick you into downloading harmful software.<br><br>Always be careful about what websites you visit and what information you share! 🛡️');
}

// Show safe website example
function showSafeWebsite() {
    showPositivePopup('✅ This is what a SAFE website looks like!<br><br>Notice the secure connection (https://) and trusted design.<br><br>Always look for these signs when browsing! 🔒');
}

// Initialize page
function initializePage() {
    // Add event listeners for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('option')) {
            e.target.click();
        }
    });
    
    // Add focus indicators
    document.querySelectorAll('.option, button').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid #2196f3';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Initialize progress if on quiz page
    updateProgress();
    
    // Initialize voice reading functionality
    initializeVoiceReading();
}

// Run initialization when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Prevent right-click context menu on quiz pages (educational purpose)
function disableRightClick() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showPositivePopup('Right-clicking is disabled for this educational quiz! 🎓');
    });
}

// Enable right-click (for normal browsing)
function enableRightClick() {
    document.removeEventListener('contextmenu', disableRightClick);
}

// Utility function to create accessible buttons
function createAccessibleButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    return button;
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Voice reading functions
function initializeVoiceReading() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser');
        return;
    }
    
    // Create voice control panel
    createVoiceControlPanel();
    
    // Add voice reading buttons to questions and options
    addVoiceButtonsToContent();
}

function createVoiceControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'voice-control-panel';
    controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border: 3px solid #2196f3;
        border-radius: 15px;
        padding: 1rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        min-width: 200px;
    `;
    
    controlPanel.innerHTML = `
        <div style="text-align: center; margin-bottom: 1rem;">
            <h4 style="color: #1976d2; margin: 0; font-size: 1rem;">🔊 Voice Helper</h4>
        </div>
        
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; justify-content: center; flex-wrap: wrap;">
            <button id="read-question-btn" onclick="readQuestion()" style="
                background: #4caf50;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: bold;
            ">📖 Question</button>
            
            <button id="read-options-btn" onclick="readAllOptions()" style="
                background: #ff9800;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: bold;
            ">📝 Options</button>
            
            <button id="read-all-btn" onclick="readQuestionAndOptions()" style="
                background: #9c27b0;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: bold;
            ">🔍 Read All</button>
        </div>
        
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; justify-content: center;">
            <button id="play-pause-btn" onclick="toggleReading()" style="
                background: #2196f3;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: bold;
            ">▶️ Play</button>
            
            <button id="stop-btn" onclick="stopReading()" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: bold;
            ">⏹️ Stop</button>
        </div>
        
        <div style="margin-bottom: 0.5rem;">
            <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 0.2rem;">Speed:</label>
            <input type="range" id="speed-slider" min="0.5" max="2" step="0.1" value="1" 
                   onchange="changeVoiceSpeed(this.value)" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #999;">
                <span>Slow</span><span>Fast</span>
            </div>
        </div>
        
        <div>
            <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 0.2rem;">Volume:</label>
            <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" 
                   onchange="changeVoiceVolume(this.value)" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #999;">
                <span>Quiet</span><span>Loud</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(controlPanel);
}

function addVoiceButtonsToContent() {
    // Add voice button to question
    const questionElement = document.querySelector('.question');
    if (questionElement) {
        const voiceBtn = createVoiceButton('Read Question', () => readText(questionElement.textContent));
        voiceBtn.style.marginTop = '1rem';
        questionElement.appendChild(voiceBtn);
    }
    
    // Add voice buttons to options
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        const voiceBtn = createVoiceButton(`Read Option ${index + 1}`, () => readText(option.textContent));
        voiceBtn.style.cssText += 'margin-left: 1rem; padding: 0.3rem 0.8rem; font-size: 0.8rem;';
        option.appendChild(voiceBtn);
    });
}

function createVoiceButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = `🔊 ${text}`;
    button.onclick = onClick;
    button.style.cssText = `
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    button.onmouseover = () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };
    
    button.onmouseout = () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    };
    
    return button;
}

function readText(text) {
    if (!speechSynthesis) return;
    
    // Stop any current reading
    stopReading();
    
    // Clean up text for better reading
    const cleanText = text.replace(/[🔊📖▶️⏹️🎉🛡️🔒📱👥💡✅❌]/g, '').trim();
    
    if (cleanText) {
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.rate = voiceSpeed;
        currentUtterance.volume = voiceVolume;
        currentUtterance.pitch = 1;
        
        // Set voice to a clear, friendly voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Female') || voice.name.includes('Google'))
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (preferredVoice) {
            currentUtterance.voice = preferredVoice;
        }
        
        currentUtterance.onstart = () => {
            isReading = true;
            updatePlayPauseButton();
            addReadingIndicator();
        };
        
        currentUtterance.onend = () => {
            isReading = false;
            updatePlayPauseButton();
            removeReadingIndicator();
        };
        
        currentUtterance.onerror = () => {
            isReading = false;
            updatePlayPauseButton();
            removeReadingIndicator();
        };
        
        speechSynthesis.speak(currentUtterance);
    }
}

function readQuestion() {
    const questionElement = document.querySelector('.question');
    if (questionElement) {
        readText(questionElement.textContent);
    }
}

function readAllOptions() {
    const options = document.querySelectorAll('.option');
    if (options.length > 0) {
        let allOptionsText = "Here are your answer choices: ";
        options.forEach((option, index) => {
            const cleanText = option.textContent.replace(/[🔊📖▶️⏹️🎉🛡️🔒📱👥💡✅❌📧🚫]/g, '').trim();
            allOptionsText += `Option ${index + 1}: ${cleanText}. `;
        });
        readText(allOptionsText);
    }
}

function readQuestionAndOptions() {
    const questionElement = document.querySelector('.question');
    const options = document.querySelectorAll('.option');
    
    if (questionElement && options.length > 0) {
        let fullText = questionElement.textContent + ". Here are your answer choices: ";
        options.forEach((option, index) => {
            const cleanText = option.textContent.replace(/[🔊📖▶️⏹️🎉🛡️🔒📱👥💡✅❌📧🚫]/g, '').trim();
            fullText += `Option ${index + 1}: ${cleanText}. `;
        });
        readText(fullText);
    }
}

function toggleReading() {
    if (isReading) {
        pauseReading();
    } else if (currentUtterance) {
        resumeReading();
    } else {
        readQuestion();
    }
}

function pauseReading() {
    if (speechSynthesis && isReading) {
        speechSynthesis.pause();
        isReading = false;
        updatePlayPauseButton();
    }
}

function resumeReading() {
    if (speechSynthesis && currentUtterance) {
        speechSynthesis.resume();
        isReading = true;
        updatePlayPauseButton();
    }
}

function stopReading() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        currentUtterance = null;
        isReading = false;
        updatePlayPauseButton();
        removeReadingIndicator();
    }
}

function changeVoiceSpeed(speed) {
    voiceSpeed = parseFloat(speed);
    if (currentUtterance && isReading) {
        // Restart with new speed
        const text = currentUtterance.text;
        stopReading();
        setTimeout(() => readText(text), 100);
    }
}

function changeVoiceVolume(volume) {
    voiceVolume = parseFloat(volume);
    if (currentUtterance) {
        currentUtterance.volume = voiceVolume;
    }
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        if (isReading) {
            playPauseBtn.innerHTML = '⏸️ Pause';
            playPauseBtn.style.background = '#ff9800';
        } else {
            playPauseBtn.innerHTML = '▶️ Play';
            playPauseBtn.style.background = '#2196f3';
        }
    }
}

function addReadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'reading-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(33, 150, 243, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: pulse 1.5s infinite;
    `;
    indicator.innerHTML = '🔊 Reading...';
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(indicator);
}

function removeReadingIndicator() {
    const indicator = document.getElementById('reading-indicator');
    if (indicator) {
        indicator.remove();
    }
}
