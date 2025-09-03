import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import audio from './Time audio.mp3';

// UI Components Imports
import { Container } from './ui/reused-ui/Container.jsx'
import Clock from './Clock.jsx'

// Assets Imports
import Flexi_Faceplant from './assets/flexi_faceplant.png'
import Flexi_Excited from './assets/flexi_excited.png'
import Flexi_Hello from './assets/flexi_hello.png'
import Flexi_Hey from './assets/flexi_hey.png'
import Flexi_Stars from './assets/flexi_stars.png'
import Flexi_ThumbsUp from './assets/flexi_thumbsup.png'

// UI Animation Imports
import './ui/reused-animations/fade.css';
import './ui/reused-animations/scale.css';
import './ui/reused-animations/glow.css';
import './Snooze.css';

const TimeTo = () => {
    // State Management
	const [isClockAnimating, setIsClockAnimating] = useState(false);
    const [hour, setHour] = useState(10);
    const [minute, setMinute] = useState(30);
	const [showSnooze, setShowSnooze] = useState(false);
	const snoozeTimeoutRef = useRef(null);
	const [wakeMessage, setWakeMessage] = useState('');
	const audioRef = useRef(new Audio(audio));

    // Functions
    const chooseFlexiImage = (animating) => {
		if (!animating) return Flexi_Faceplant;
		const otherImages = [Flexi_Excited, Flexi_Hello, Flexi_Hey, Flexi_Stars, Flexi_ThumbsUp];
		return otherImages[Math.floor(Math.random() * otherImages.length)];
	};

	const wakeMessages = [
		"Thanks!",
		"I'm up!",
		"I'm awake!",
		"Ready to go!",
		"Good morning!"
	];

	const generateRandomTime = () => {
		const allowedMinutes = [0, 15, 30, 45];
		const newMinute = allowedMinutes[Math.floor(Math.random() * allowedMinutes.length)];
		const newHour = Math.floor(Math.random() * 12) + 1; // 1-12
		setHour(newHour);
		setMinute(newMinute);
	};

	const triggerConfetti = () => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 }
		});
	};

	const getPhraseForTime = (currentHour, currentMinute) => {
		const to12Hour = (h) => {
			const mod = h % 12;
			return mod === 0 ? 12 : mod;
		};

		const hour12 = to12Hour(currentHour);
		switch (currentMinute) {
			case 0:
				return `${hour12} o'clock`;
			case 15:
				return `Quarter past ${hour12}`;
			case 30:
				return `Half past ${hour12}`;
			case 45:
				return `Quarter to ${to12Hour(currentHour + 1)}`;
			default:
				return null;
		}
	};

	const handleAnswerClick = (answerText) => {
		if (isClockAnimating) return; // Prevent clicks during animation
		const correctPhrase = getPhraseForTime(hour, minute);
		if (!correctPhrase) return;
		if (answerText.trim().toLowerCase() === correctPhrase.trim().toLowerCase()) {
			setWakeMessage(wakeMessages[Math.floor(Math.random() * wakeMessages.length)]);
			triggerConfetti();
			setIsClockAnimating(true);
			// hide snooze Zs if showing
			if (snoozeTimeoutRef.current) clearTimeout(snoozeTimeoutRef.current);
			setShowSnooze(false);
			setTimeout(() => {
				setIsClockAnimating(false);
				generateRandomTime();
			}, 3000);
		} else {
			setShowSnooze(true);
		}
	};

	const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
	useEffect(() => {
		const onResize = () => setViewportWidth(window.innerWidth);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const handleSoundClick = () => {
		audioRef.current.currentTime = 0; // Reset to beginning
		audioRef.current.play()
	};

    // Constants
	const baseClockSize = 150;
	const baseFlexiWidth = 100;
	const scale = viewportWidth < 345 ? viewportWidth / 345 : 1;
	const clockSize = Math.round(baseClockSize * scale);
	const flexiWidth = Math.round(baseFlexiWidth * scale);

    // Render
	return (
        <Container
            text="Time Phrases Practice" 
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
            onSound={handleSoundClick}
        >
            <div className='text-center text-sm text-gray-500 p-5'>
                Flexi is asleep! Click the correct time to activate the alarm clock to wake him up, or else he will be late for school!
            </div>

            <div className='absolute top-[32%] left-[50%] -translate-x-1/2 flex justify-center items-end'>
                <Clock hour={hour} minute={minute} isAnimating={isClockAnimating} size={clockSize} />
                <img src={chooseFlexiImage(isClockAnimating)} alt="Flexi" className='relative top-[20px]' style={{ width: `${flexiWidth}px`, height: 'auto' }} />
                {showSnooze && (
					<div className='absolute -top-[5px] right-[-33%] -translate-x-1/2 flex flex-col items-center text-purple-600 drop-shadow-sm select-none pointer-events-none'>
						<div className='font-extrabold text-4xl rotate-[10deg] snooze-z snooze-z--delay-1'>Z</div>
						<div className='font-extrabold text-2xl rotate-[-10deg] opacity-80 snooze-z snooze-z--delay-2'>Z</div>
						<div className='font-extrabold text-xl rotate-[10deg] opacity-60 snooze-z snooze-z--delay-3'>Z</div>
					</div>
				)}
				{isClockAnimating && wakeMessage && (
					<div className='absolute top-[38px] left-[90%] -translate-x-1/2 text-[#FF7B00] font-extrabold text-sm select-none w-[150px] text-right'>
						{wakeMessage}
					</div>
				)}
            </div>

            <div className='absolute bottom-[8%] left-[50%] -translate-x-1/2 w-[90%] flex justify-between items-center gap-2'>
					{(() => {
 						const displayHour = (hour % 12) === 0 ? 12 : (hour % 12);
 						const nextDisplayHour = ((hour + 1) % 12) === 0 ? 12 : ((hour + 1) % 12);
						const correctPhrase = getPhraseForTime(hour, minute);
						const normalize = (s) => (s || '').trim().toLowerCase();
						const baseBtnClasses = 'no-wrap text-center w-[25%] bg-green-100 border border-green-300 hover:bg-green-200 rounded-lg p-2 h-[60px] flex items-center justify-center';
						const dimIfIncorrect = (label) => (isClockAnimating && normalize(label) !== normalize(correctPhrase) ? ' opacity-50' : '');

						const labelOclock = `${displayHour} o'clock`;
						const labelQuarterPast = `Quarter past ${displayHour}`;
						const labelHalfPast = `Half past ${displayHour}`;
						const labelQuarterTo = `Quarter to ${nextDisplayHour}`;
 						
                        return (
 							<>
								<button type='button' onClick={() => handleAnswerClick(labelOclock)} className={baseBtnClasses + dimIfIncorrect(labelOclock)}>
									{labelOclock}
								</button>
								<button type='button' onClick={() => handleAnswerClick(labelQuarterPast)} className={baseBtnClasses + dimIfIncorrect(labelQuarterPast)}>
									{labelQuarterPast}
								</button>
								<button type='button' onClick={() => handleAnswerClick(labelHalfPast)} className={baseBtnClasses + dimIfIncorrect(labelHalfPast)}>
									{labelHalfPast}
								</button>
								<button type='button' onClick={() => handleAnswerClick(labelQuarterTo)} className={baseBtnClasses + dimIfIncorrect(labelQuarterTo)}>
									{labelQuarterTo}
								</button>
 							</>
 						);
 					})()}
				</div>

        </Container>
)
};


export default TimeTo;