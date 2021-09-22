import flip, { FlipOptions } from './methods/flip';
import flipAnimation from './methods/flip/flipAnimation';
import getCardInfo from './methods/getCardInfo';
import getNextIndex from './methods/getNextIndex';
import registerElement from './utils/registerElement';
import Attributes from './values/attributes';
import Directions from './values/directions';
import Modes from './values/modes';
import Slots from './values/slots';
import Styles from './values/styles';

const nodeName = 'flip-pack';

const { isNaN } = globalThis;
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      --3d-perspective: 10rem;

      position: relative;
      display: inline-block;
    }

    slot {
      position: relative;
      z-index: 0;
    }

    slot:not([name]) {
      display: none;
    }
  </style>
  <flip>
    <slot></slot>
    <slot name="${Slots.current}"></slot>
    <slot name="${Slots.temp}"></slot>
  </flip>
`;

export interface FlippingOption {
  duration: number;
  index: number;
  lastIndex: number;
  lastCard: HTMLElement | null;
  tempCard: HTMLElement;
}

class Flip extends HTMLElement {
  #mode: Modes = Modes.loop;

  #duration: number = 400;

  #direction: Directions = Directions.down;

  #index: number = -1;

  #cards: HTMLElement[] = Array.from(this.children) as HTMLElement[];

  #minFlips: number = 0;

  #maxFlips: number | undefined;

  #perspective: string = '10rem';

  #rootElement: HTMLElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(template.content.cloneNode(true));
    this.#rootElement = shadowRoot.querySelector('flip') as HTMLElement;
    (shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement)
      .addEventListener('slotchange', () => {
        this.#cards = Array.from(
          this.querySelectorAll(':scope > :not([slot=temp])'),
        );
      });
    Flip.observedAttributes
      .filter((attrName) => this.hasAttribute(attrName))
      .forEach((attrName) => {
        this.attributeChangedCallback(attrName);
      });

    if (this.index === -1) {
      this.index = 0;
    }
  }

  static get observedAttributes() {
    return [
      Attributes.index,
      Attributes.value,
      Attributes.mode,
      Attributes.duration,
      Attributes.direction,
      Attributes.minFlips,
      Attributes.maxFlips,
      Attributes.perspective,
    ];
  }

  attributeChangedCallback(attrName: string) {
    switch (attrName) {
      default:
        break;

      case Attributes.index: {
        const index = this.getAttribute(Attributes.index);

        if (index !== null && index.length > 0) {
          this.index = Number(index);
        }
        break;
      }

      case Attributes.value: {
        const value = this.getAttribute(Attributes.value);
        const index = this.cards.findIndex((card) => (
          Flip.getCardValue(card) === value
        ));

        this.index = index;
        break;
      }

      case Attributes.mode:
        if (this.hasAttribute(Attributes.mode)) {
          this.mode = this.getAttribute(Attributes.mode) as Modes;
        }
        break;

      case Attributes.duration: {
        const duration = this.getAttribute(Attributes.duration);

        if (duration !== null && duration.length > 0) {
          this.duration = Number(duration);
        }
        break;
      }

      case Attributes.direction:
        if (this.hasAttribute(Attributes.direction)) {
          this.direction = this.getAttribute(Attributes.direction) as Directions;
        }
        break;

      case Attributes.minFlips: {
        const minFlips = this.getAttribute(Attributes.minFlips);

        if (minFlips !== null && minFlips.length > 0) {
          this.minFlips = Number(minFlips);
        }
        break;
      }

      case Attributes.maxFlips: {
        const maxFlips = this.getAttribute(Attributes.maxFlips);

        if (maxFlips !== null && maxFlips.length > 0) {
          this.maxFlips = Number(maxFlips);
        }
        break;
      }

      case Attributes.perspective:
        if (this.hasAttribute(Attributes.perspective)) {
          this.perspective = this.getAttribute(Attributes.perspective) as string;
        }
        break;
    }
  }

  /**
   * Returns the value of card.
   */
  static getCardValue(card: HTMLElement | null): string | null {
    return card?.getAttribute?.(Attributes.value) ?? null;
  }

  /**
   * Returns card elements.
   */
  get cards(): HTMLElement[] {
    return [...this.#cards];
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
   * Returns flipping duration.
   */
  get duration(): number {
    return this.#duration;
  }

  /**
   * Sets flipping duration.
   */
  set duration(duration: number) {
    if (isNaN(duration)) {
      throw new TypeError(`Invalid duration: ${duration}`);
    } else if (duration < 0) {
      throw new RangeError(`Duration should be greater than 0: ${duration}`);
    }

    this.#duration = duration;
  }

  /**
   * Returns flipping direction.
   */
  get direction(): Directions {
    return this.#direction;
  }

  /**
   * Sets flipping direction.
   */
  set direction(direction: Directions) {
    if (!(direction in Directions)) {
      throw new TypeError(`Invalid direction: ${direction}`);
    }

    this.#direction = direction;
  }

  /**
   * Returns min flips.
   */
  get minFlips(): number {
    return this.#minFlips;
  }

  /**
   * Sets min flips.
   */
  set minFlips(minFlips: number) {
    if (isNaN(minFlips)) {
      throw new TypeError(`Invalid min flips: ${minFlips}`);
    } else if (parseInt(`${minFlips}`, 10) !== minFlips) {
      throw new TypeError(`Min flips should be an integer: ${minFlips}`);
    }

    this.#minFlips = minFlips;

    if (this.maxFlips < minFlips) {
      throw new RangeError(
        'Setting min flips that is greater than max flips might cause flipping error',
      );
    }
  }

  /**
   * Returns max flips.
   */
  get maxFlips(): number {
    return this.#maxFlips ?? Infinity;
  }

  /**
   * Returns max flips.
   */
  set maxFlips(maxFlips: number) {
    if (isNaN(maxFlips)) {
      throw new TypeError(`Invalid max flips: ${maxFlips}`);
    } else if (parseInt(`${maxFlips}`, 10) !== maxFlips) {
      throw new TypeError(`Max flips should be an integer: ${maxFlips}`);
    }

    this.#maxFlips = maxFlips;

    if (this.minFlips > maxFlips) {
      throw new RangeError(
        'Setting max flips that is less than min flips might cause flipping error',
      );
    }
  }

  /**
   * Returns 3D perspective value.
   */
  get perspective(): string {
    return this.#perspective;
  }

  /**
   * Sets 3D perspective value.
   */
  set perspective(perspective: string) {
    if (typeof perspective === 'string') {
      this.#perspective = perspective;
      this.#rootElement.style.setProperty(Styles.perspective, perspective);
    }
  }

  /**
   * Returns current index.
   */
  get index(): number {
    return this.#index;
  }

  /**
   * Sets current index.
   */
  set index(index: number) {
    if (isNaN(index)) {
      throw new TypeError(`Invalid index: ${index}`);
    } else if (parseInt(`${index}`, 10) !== index) {
      throw new TypeError(`Index should be an integer: ${index}`);
    } else if (this.cards[index] === undefined) {
      throw new RangeError(`Card index doesn't exist: ${index}`);
    }

    this.#index = index;
    this.querySelectorAll(`[slot="${Slots.current}"]`).forEach((card) => {
      card.removeAttribute('slot');
    });
    this.cards[index].setAttribute('slot', Slots.current);
  }

  /**
   * Returns current value.
   */
  get value(): string | null {
    return this.getValueByIndex(this.index);
  }

  /**
   * Sets current value.
   */
  set value(value: string | null) {
    const index = this.cards.findIndex((dom) => (
      Flip.getCardValue(dom) === value
    ));

    if (index === -1) {
      throw new ReferenceError(`Value is not in cards: ${value}`);
    }

    this.index = index;
  }

  /**
   * Returns current card.
   */
  get card(): HTMLElement | null {
    return this.getCardByIndex(this.index);
  }

  /**
   * Sets current card.
   */
  set card(card: HTMLElement | null) {
    if (card === null) {
      this.index = -1;
    } else {
      this.index = this.cards.indexOf(card);
    }
  }

  /**
   * Returns the nth card by index.
   */
  getCardByIndex(index: number): HTMLElement | null {
    return this.cards[index] ?? null;
  }

  /**
   * Returns card info with index and card element.
   */
  getCardInfo = getCardInfo

  /**
   * Returns the value of nth card by index.
   */
  getValueByIndex(index: number): string | null {
    return Flip.getCardValue(this.getCardByIndex(index));
  }

  /**
   * Returns the index of card.
   */
  getIndexByCard(card: HTMLElement): number {
    return this.cards.indexOf(card);
  }

  /**
   * Returns the index of the first card matches of value.
   */
  getIndexByValue(value: string): number {
    return this.cards.findIndex((card) => (
      Flip.getCardValue(card) === value
    ));
  }

  /**
   * Returns the next card index.
   */
  getNextIndex = getNextIndex

  /**
   * Returns the next card.
   */
  getNextCard(
    ...args: Parameters<Flip['getNextIndex']>
  ): HTMLElement | null {
    const nextIndex = this.getNextIndex(...args);

    return (nextIndex !== null
      ? this.getCardByIndex(nextIndex)
      : null
    );
  }

  /**
   * Flips to specific card/index.
   */
  flip = flip

  /**
   * Alias of .flip(...).
   */
  flipToCard(card: HTMLElement, options?: FlipOptions) {
    return this.flip(card, options);
  }

  /**
   * Flips to the nth card by index.
   */
  flipToIndex(index: number, options?: FlipOptions) {
    return this.flip(this.getCardByIndex(index), options);
  }

  /**
   * Flips to specific card/index Directly.
   */
  flipDirectly(...[next, options]: Parameters<Flip['flip']>) {
    return this.flip(next, {
      ...options,
      direct: true,
    });
  }

  /**
   * Alias of .flipDirectly(...).
   */
  flipToCardDirectly(card: HTMLElement, options?: FlipOptions) {
    return this.flipDirectly(card, options);
  }

  /**
   * Flips directly to the nth card by index.
   */
  flipToIndexDirectly(index: number, options?: FlipOptions) {
    return this.flipDirectly(this.getCardByIndex(index), options);
  }

  /**
   * Does flipping animation from last card to next card.
   */
  flipAnimation = flipAnimation

  /**
   * Returns cloned element of card.
   *
   * TODO: clone style?
   */
  static cloneCard(card: HTMLElement): HTMLElement {
    const newCard = card.cloneNode(true) as HTMLElement;

    { // case of canvas
      const newCardCanvases = Array.from(newCard.querySelectorAll('canvas'));

      if (newCard instanceof HTMLCanvasElement) {
        newCardCanvases.push(newCard);
      }
      if (newCardCanvases.length > 0) {
        card.querySelectorAll('canvas').forEach((dom, domIndex) => {
          const cardCanvas = dom as HTMLCanvasElement;
          const newCanvas = newCardCanvases[domIndex] as HTMLCanvasElement;

          newCanvas.width = cardCanvas.width;
          newCanvas.height = cardCanvas.height;
          newCanvas.getContext('2d')?.drawImage(cardCanvas, 0, 0);
        });
      }
    }

    return newCard;
  }
}

registerElement(Flip, nodeName);

export default Flip;
