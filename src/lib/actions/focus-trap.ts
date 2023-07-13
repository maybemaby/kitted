/**
MIT License

Copyright (c) 2023 Skeleton Labs, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/

// Action: Focus Trap
export function focusTrap(node: HTMLElement, enabled: boolean) {
	const elemWhitelist =
		'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
	let elemFirst: HTMLElement;
	let elemLast: HTMLElement;

	// When the first element is selected, shift+tab pressed, jump to the last selectable item.
	function onFirstElemKeydown(e: KeyboardEvent): void {
		if (e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemLast.focus();
		}
	}

	// When the last item selected, tab pressed, jump to the first selectable item.
	function onLastElemKeydown(e: KeyboardEvent): void {
		if (!e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemFirst.focus();
		}
	}

	const onScanElements = (fromObserver: boolean) => {
		if (enabled === false) return;
		// Gather all focusable elements
		const focusableElems: HTMLElement[] = Array.from(node.querySelectorAll(elemWhitelist));
		if (focusableElems.length) {
			// Set first/last focusable elements
			elemFirst = focusableElems[0];
			elemLast = focusableElems[focusableElems.length - 1];
			// Auto-focus first focusable element only when not called from observer
			if (!fromObserver) elemFirst.focus();
			// Listen for keydown on first & last element
			elemFirst.addEventListener('keydown', onFirstElemKeydown);
			elemLast.addEventListener('keydown', onLastElemKeydown);
		}
	};
	onScanElements(false);

	function onCleanUp(): void {
		if (elemFirst) elemFirst.removeEventListener('keydown', onFirstElemKeydown);
		if (elemLast) elemLast.removeEventListener('keydown', onLastElemKeydown);
	}

	// When children of node are changed (added or removed)
	const onObservationChange = (mutationRecords: MutationRecord[], observer: MutationObserver) => {
		if (mutationRecords.length) {
			onCleanUp();
			onScanElements(true);
		}
		return observer;
	};
	const observer = new MutationObserver(onObservationChange);
	observer.observe(node, { childList: true, subtree: true });

	// Lifecycle
	return {
		update(newArgs: boolean) {
			enabled = newArgs;
			newArgs ? onScanElements(false) : onCleanUp();
		},
		destroy() {
			onCleanUp();
			observer.disconnect();
		}
	};
}
