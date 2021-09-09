import applyFlipAnimation from './utils/flipAnimation';
import registerElement from './utils/registerElement';
import Attributes from './values/attributes';
import Modes from './values/modes';

const nodeName = 'flip-base';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      --background-color: #ccc;
      --axis-size: 0.05em;

      position: relative;
      padding: 0.25em 0.5em;
      border-radius: 0.5em;
      font-size: 1rem;
      display: inline-block;
    }

    slot {
      display: none;
    }

    current {
      position: relative;
      padding: inherit;
      box-shadow: inherit;
      border-radius: inherit;
      border: inherit;
      background-color: var(--background-color);
      font-size: inherit;
    }

    current > value {
      opacity: 0;
      pointer-events: none;
    }

    current::before,
    current::after {
      content: attr(value);
      transform-origin: center;
      position: absolute;
      top: 0;
      left: 0;
      padding: inherit;
      box-shadow: inherit;
      border-radius: inherit;
      border: inherit;
      background: inherit;
      font-size: inherit;
      display: block;
    }

    current::before {
      clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
      animation: anim-flip 0.5s linear forwards;
    }
    
    current::after {
      display: none;
    }

    @keyframes anim-flip {
      50% {
        transform: scale(1.5, 0);
      }
      100% {
        transform: scale(1, -1);
      }
    }
  </style>
  <flip>
    <slot></slot>
    <current>
      <upper></upper>
      <lower></lower>
    </current>
  </flip>
`;

class Flip extends HTMLElement {
  #mode: Modes = Modes.loop;

  #index: number = 0;

  #value: string | null = null;

  #options: HTMLElement[] = [];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(template.content.cloneNode(true));
    (shadowRoot.querySelector('slot') as HTMLSlotElement)
      .addEventListener('slotchange', () => {
        this.#options = Array.from(this.children) as HTMLElement[];
      });
  }

  static get observedAttributes() {
    return [
      Attributes.disabled,
      Attributes.value,
      Attributes.mode,
      Attributes.minFlips,
      Attributes.maxFlips,
    ];
  }

  attributeChangedCallback(attrName: string) {
    switch (attrName) {
      default:
        break;

      case Attributes.value:
        this.value = this.getAttribute(Attributes.value);
        break;
    }
  }

  /**
   * Returns the value of option.
   */
  static getOptionValue(option: HTMLElement | null): string | null {
    return option?.getAttribute(Attributes.value) ?? null;
  }

  /**
   * Applies flipping animation.
   */
  static applyFlipAnimation = applyFlipAnimation

  /**
   * Returns option elements.
   */
  get options(): HTMLElement[] {
    return [...this.#options];
  }

  /**
   * Returns flipping mode.
   */
  get mode(): Modes {
    return this.#mode;
  }

  /**
   * Sets flipping mode.
   */
  set mode(mode: Modes) {
    if (!(mode in Modes)) {
      throw new TypeError(`Invalid mode: ${mode}`);
    }

    this.#mode = mode;
  }

  /**
   * Returns current value.
   */
  get value(): string | null {
    return this.#value;
  }

  /**
   * Sets current value.
   */
  set value(value: string | null) {
    if (value !== null) {
      this.flipToValue(value);
      this.#value = value;
    }
  }

  /**
   * Returns the nth option by index.
   */
  getOptionByIndex(index: number): HTMLElement | null {
    return this.#options[index] ?? null;
  }

  /**
   * Returns the value of nth option by index.
   */
  getValueByIndex(index: number): string | null {
    return Flip.getOptionValue(this.getOptionByIndex(index));
  }

  /**
   * Returns the next option picked up from options.
   */
  getNextOption(different = false): HTMLElement | null {
    switch (this.mode) {
      default:
      case Modes.loop:
        return this.getOptionByIndex(
          (this.#index + 1) % this.#options.length,
        );

      case Modes.random: {
        switch (this.#options.length) {
          case 0:
            return null;

          case 1:
            return this.getOptionByIndex(0);

          default: {
            const currentIndex = this.#index;

            let nextIndex = currentIndex;

            while (different && nextIndex === currentIndex) {
              nextIndex = Math.floor(this.#options.length * Math.random());
            }

            return this.getOptionByIndex(nextIndex);
          }
        }
      }
    }
  }

  /**
   * Returns the next value picked up from options.
   */
  getNextValue(): string | null {
    return Flip.getOptionValue(this.getNextOption());
  }

  /**
   * Flips to specific opiton.
   */
  async flipToOption(
    option: HTMLElement,
    flips = true,
  ): Promise<HTMLElement> {
    const options = this.#options;

    if (!options.includes(option)) {
      throw new ReferenceError('Target is not in options');
    }

    if (flips) {
      let nextOption = this.getNextOption();

      while (nextOption !== option) {
        await Flip.applyFlipAnimation()

        nextOption = this.getNextOption();
      }

      // do flip animation with await
    }

    return option;
  }

  /**
   * Flips to specific value.
   */
  async flipToValue(
    value: string,
    flips?: boolean,
  ): Promise<string> {
    const option = this.#options.find((dom) => (
      Flip.getOptionValue(dom) === value
    ));

    if (option === undefined) {
      throw new ReferenceError(`Value is not in options: ${value}`);
    }

    await this.flipToOption(option, flips);

    return Flip.getOptionValue(option) as string;
  }
}

registerElement(Flip, nodeName);

export default Flip;
