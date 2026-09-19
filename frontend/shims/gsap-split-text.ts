// Shim for GSAP SplitText
export interface SplitTextVars {
  type?: string;
  smartWrap?: boolean;
  autoSplit?: boolean;
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  reduceWhiteSpace?: boolean;
  onSplit?: (self: SplitText) => any;
  tag?: string;
}

export class SplitText {
  element: HTMLElement;
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  originalHTML: string;

  constructor(target: HTMLElement | string, vars: SplitTextVars = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
    this.element = el;
    this.originalHTML = el ? el.innerHTML : '';
    if (!el) return;

    const rawText = el.textContent || '';
    const type = vars.type || 'chars';
    const charsClass = vars.charsClass || 'split-char';
    const wordsClass = vars.wordsClass || 'split-word';
    const linesClass = vars.linesClass || 'split-line';

    const words = rawText.trim().split(/\s+/);
    el.innerHTML = '';

    const wordElements: HTMLElement[] = [];
    const charElements: HTMLElement[] = [];

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = wordsClass;
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      if (type.includes('chars')) {
        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = charsClass;
          charSpan.style.display = 'inline-block';
          charSpan.textContent = word[i];
          wordSpan.appendChild(charSpan);
          charElements.push(charSpan);
        }
      } else {
        wordSpan.textContent = word;
      }

      el.appendChild(wordSpan);
      wordElements.push(wordSpan);

      if (wIdx < words.length - 1) {
        const space = document.createTextNode(' ');
        el.appendChild(space);
      }
    });

    this.chars = charElements;
    this.words = wordElements;
    this.lines = [el];

    if (vars.onSplit) {
      vars.onSplit(this);
    }
  }

  revert() {
    if (this.element) {
      this.element.innerHTML = this.originalHTML;
    }
  }

  static register(core: any) {
    // registered
  }
}

export default SplitText;
