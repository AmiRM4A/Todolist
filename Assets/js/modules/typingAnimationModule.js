import { HEADER_TYPE_DELAY, $ } from "./constantsModule.js";

const textToType = "Get it done!";
const h1Elem = $.querySelector('#tasksHeader h1');
const caret = $.querySelector('.blink-caret');

/**
 * Type the header text with a typing animation.
 *
 * @function
 * @name typeText
 *
 * @description Types the header text with a typewriter-style animation effect.
 */
function typeHeaderText() {
	let i = 0;
	const typeNextCharacter = () => {
		if (i < textToType.length) {
			h1Elem.textContent += textToType.charAt(i);
			i++;
			setTimeout(typeNextCharacter, HEADER_TYPE_DELAY);
		} else {
			caret.style.display = 'none';
		}
	}
	typeNextCharacter();
}

export { typeHeaderText };
