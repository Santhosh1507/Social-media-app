// components/Modal.js
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal1 = ({ isOpen, onClose, children }) => {
	const modalRef = useRef();

	useEffect(() => {
		if (isOpen) {
			// Set focus on the close button when modal opens
			const closeButton = modalRef.current.querySelector('button');
			if (closeButton) closeButton.focus();

			// Trap focus within the modal
			const handleKeyDown = (e) => {
				if (e.key === 'Escape') {
					onClose();
				}
			};

			document.addEventListener('keydown', handleKeyDown);
			return () => {
				document.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
			aria-modal="true" // Indicate that this is a modal
			role="dialog" // Dialog role for accessibility
			tabIndex="-1" // To ensure focus can be managed
		>
			<div className='bg-white p-6 rounded-lg shadow-lg' ref={modalRef}>
				<button
					className='absolute top-2 right-2 text-gray-500'
					onClick={onClose}
					aria-label="Close Modal" // ARIA label for close button
				>
					&times;
				</button>
				{children}
			</div>
		</div>,
		document.body
	);
};

export default Modal1;
