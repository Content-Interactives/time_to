import React from 'react';
import './Clock.css';

const Clock = ({ size = 150, borderColor = '#ff4242', hour = 10, minute = 10, isAnimating = false }) => {
	const normalizedHour = ((Number(hour) % 12) + 12) % 12;
	const normalizedMinute = ((Number(minute) % 60) + 60) % 60;

	const minuteAngle = normalizedMinute * 6;
	const hourAngle = normalizedHour * 30 + normalizedMinute * 0.5;

	const radius = size / 2;

	// Wrapper holds bells/handle/legs and the circular face
	const wrapperStyle = {
		position: 'relative',
		width: size,
		height: size,
	};

	const containerStyle = {
		width: size,
		height: size,
		border: `12px solid ${borderColor}`,
		borderRadius: '50%',
		position: 'relative',
		zIndex: 2,
		overflow: 'hidden',
		backgroundColor: '#ffffff',
		boxShadow: '0 10px 25px rgba(0,0,0,0.08), inset 0 0 20px rgba(0,0,0,0.05)'
	};

	const handStyle = (length, thickness, color, angle) => ({
		position: 'absolute',
		left: '50%',
		top: '50%',
		width: thickness,
		height: length,
		backgroundColor: color,
		transformOrigin: 'bottom center',
		transform: `translate(-50%, -100%) rotate(${angle}deg)`,
		borderRadius: thickness
	});

	// Smaller, evenly spaced tick marks (hour markers)
	const tickElements = Array.from({ length: 12 }).map((_, i) => {
		const angle = i * 30;
		const isQuarter = i % 3 === 0;
		const tickThickness = isQuarter ? 2 : 1;
		const tickLength = isQuarter ? size * 0.04 : size * 0.02;
		const tickDistance = radius - size * 0.08;
		return (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: tickThickness,
					height: tickLength,
					backgroundColor: '#333',
					transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${tickDistance}px)`,
					borderRadius: 2,
					opacity: isQuarter ? 0.9 : 0.6
				}}
			/>
		);
	});

	const numeralElements = Array.from({ length: 12 }).map((_, idx) => {
		const n = idx + 1;
		const angle = n * 30;
		const distance = radius - size * 0.14;
		return (
			<div
				key={`num-${n}`}
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px) rotate(${-angle}deg)`,
					fontSize: Math.max(10, Math.round(size * 0.08)),
					fontWeight: 600,
					color: '#333',
					userSelect: 'none',
				}}
			>
				{n}
			</div>
		);
	});

	// Bells, handle, and legs
	const stroke = Math.max(2, Math.round(size * 0.02));
	const bellWidth = size * 0.35;
	const bellHeight = bellWidth * 0.40;
	const metallicBorder = '#8f8f8f';
	const metallicFill = '#c0c0c0';
	const bellBase = {
		position: 'absolute',
		top: -bellHeight * 0.50,
		width: bellWidth,
		height: bellHeight,
		background: metallicFill,
		border: `${stroke}px solid ${metallicBorder}`,
		borderTopLeftRadius: bellWidth,
		borderTopRightRadius: bellWidth,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		boxShadow: 'inset 0 0 8px rgba(0,0,0,0.06)',
		zIndex: 1
	};
	const leftBellStyle = {
		...bellBase,
		left: 3,
		transform: 'rotate(-30deg)'
	};
	const rightBellStyle = {
		...bellBase,
		right: 3,
		transform: 'rotate(30deg)'
	};
	// Curved handle as a three-sided path (top + sides), slightly curved
	const handleStroke = Math.max(stroke, Math.round(size * 0.025));
	const handleHeight = size * 0.30;
	const handleTop = -size * 0.33;
	const handleWidth = size * 0.88;
	const handleLeft = (size - handleWidth) / 2;
	const handleSvgStyle = {
		position: 'absolute',
		top: handleTop,
		left: handleLeft,
		width: handleWidth,
		height: handleHeight,
		zIndex: 0,
		pointerEvents: 'none'
	};
	const leftAnchorX = bellWidth * 0.42;
	const rightAnchorX = size - bellWidth * 0.42;
	const handleAnchorY = handleHeight * 1.;
	const handleControlY = handleHeight * 0.06;
	const sideTopY = handleHeight * 0.80;

	const legWidth = size * 0.04;
	const legHeight = size * 0.14;
	const legBorder = Math.max(1, Math.round(size * 0.01));
	const legBase = {
		position: 'absolute',
		bottom: 0,
		width: legWidth,
		height: legHeight,
		background: metallicFill,
		border: `${legBorder}px solid ${metallicBorder}`,
		borderRadius: 6,
		boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
		zIndex: 1
	};
	const leftLegStyle = {
		...legBase,
		left: size * 0.18,
		transform: 'rotate(30deg)'
	};
	const rightLegStyle = {
		...legBase,
		right: size * 0.18,
		transform: 'rotate(-30deg)'
	};

	// Circular feet at leg ends
	const footDiameter = size * 0.08;
	const footBase = {
		position: 'absolute',
		bottom: -footDiameter * 0.2,
		width: footDiameter,
		height: footDiameter,
		background: metallicFill,
		border: `${legBorder}px solid ${metallicBorder}`,
		borderRadius: '50%',
		boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
		zIndex: 1
	};
	const leftFootStyle = {
		...footBase,
		left: size * 0.153 + (legWidth / 2) - (footDiameter / 2)
	};
	const rightFootStyle = {
		...footBase,
		right: size * 0.153 + (legWidth / 2) - (footDiameter / 2)
	};

	// Bell supports
	const supportBorder = Math.max(1, Math.round(size * 0.01));
	const supportWidth = Math.max(2, Math.round(size * 0.02));
	const supportHeight = size * 0.22;
	const supportBase = {
		position: 'absolute',
		top: -size * 0.02,
		width: supportWidth,
		height: supportHeight,
		background: metallicFill,
		border: `${supportBorder}px solid ${metallicBorder}`,
		borderRadius: supportWidth,
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		zIndex: 1
	};
	const leftSupportStyle = {
		...supportBase,
		left: size * 0.23,
		transform: 'rotate(-35deg)'
	};
	const rightSupportStyle = {
		...supportBase,
		right: size * 0.23,
		transform: 'rotate(35deg)'
	};

	// Silver clapper (stem + bar) between bells
	const clapperBarWidth = size * 0.22;
	const clapperBarHeight = Math.max(6, Math.round(size * 0.05));
	const clapperTop = -size * 0.04;
	const clapperBarTop = clapperTop - size * 0.05;
	const clapperBarStyle = {
		position: 'absolute',
		top: clapperBarTop,
		left: '50%',
		transform: 'translateX(-50%)',
		width: clapperBarWidth,
		height: clapperBarHeight,
		background: metallicFill,
		border: `${legBorder}px solid ${metallicBorder}`,
		borderRadius: clapperBarHeight,
		boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
		zIndex: 1
	};
	const clapperStemHeight = size * 0.09;
	const clapperStemStyle = {
		position: 'absolute',
		top: clapperTop - clapperStemHeight + clapperBarHeight,
		left: '50%',
		transform: 'translateX(-50%)',
		width: Math.max(2, Math.round(size * 0.02)),
		height: clapperStemHeight,
		background: metallicFill,
		border: `${legBorder}px solid ${metallicBorder}`,
		borderRadius: 999,
		zIndex: 1
	};

	const wrapperClassName = isAnimating ? 'clock-animate' : '';

	return (
		<div className="flex items-center justify-center">
			<div style={wrapperStyle} className={wrapperClassName} aria-label="Analog alarm clock">
				<svg style={handleSvgStyle} viewBox={`0 0 ${size} ${handleHeight}`} aria-hidden="true">
					<path d={`M ${leftAnchorX} ${handleAnchorY} C ${leftAnchorX} ${handleAnchorY - (handleAnchorY - sideTopY) * 0.6}, ${leftAnchorX} ${sideTopY + (handleAnchorY - sideTopY) * 0.2}, ${leftAnchorX} ${sideTopY} Q ${size / 2} ${handleControlY}, ${rightAnchorX} ${sideTopY} C ${rightAnchorX} ${sideTopY + (handleAnchorY - sideTopY) * 0.2}, ${rightAnchorX} ${handleAnchorY - (handleAnchorY - sideTopY) * 0.6}, ${rightAnchorX} ${handleAnchorY}`} fill="none" stroke={metallicBorder} strokeWidth={handleStroke} strokeLinecap="butt" strokeLinejoin="round" />
				</svg>
				<div style={leftSupportStyle} />
				<div style={rightSupportStyle} />
				<div style={clapperStemStyle} />
				<div style={clapperBarStyle} />
				<div style={leftBellStyle} />
				<div style={rightBellStyle} />
				<div style={containerStyle}>
					{tickElements}
					{numeralElements}
					<div style={handStyle(radius * 0.55, 6, '#222', hourAngle)} />
					<div style={handStyle(radius * 0.72, 4, '#444', minuteAngle)} />
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 12,
							height: 12,
							backgroundColor: '#222',
							borderRadius: '50%',
							transform: 'translate(-50%, -50%)',
							boxShadow: '0 0 0 3px rgba(0,0,0,0.05)'
						}}
					/>
				</div>
				<div style={leftLegStyle} />
				<div style={rightLegStyle} />
				<div style={leftFootStyle} />
				<div style={rightFootStyle} />
			</div>
		</div>
	);
};

export default Clock;
