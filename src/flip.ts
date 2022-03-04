import flip, { FlipOptions } from './methods/flip';
import flipAnimation from './methods/flip/flipAnimation';
import getCardIndex from './methods/getCardIndex';
import getCardInfo from './methods/getCardInfo';
import getCardNode from './methods/getCardNode';
import getCardValue from './methods/getCardValue';
import getNextCardIndex from './methods/getNextCardIndex';
import cloneCard from './utils/cloneCard';
import registerElement from './utils/registerElement';
import Attribute from './values/attribute';
import Direction from './values/direction';
import Event from './values/event';
import Mode from './values/mode';
import Slot from './values/slot';

const nodeName = 'flip-pack';

const { isNaN } = globalThis;
const template = document.createElement('template');

export const defaultAttributeValues = {
  [Attribute.mode]: Mode.loop,
  [Attribute.direct]: false,
  [Attribute.duration]: 400,
  [Attribute.direction]: Direction.down,
  [Attribute.index]: -1,
  [Attribute.minFlips]: 0,
  [Attribute.maxFlips]: Infinity,
};

template.innerHTML = `
  <style>
    :host {
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
    <slot name="${Slot.current}"></slot>
    <slot name="${Slot.temp}"></slot>
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
  protected cardsCatch: HTMLElement[] = [];

  protected rootElement: HTMLElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(template.content.cloneNode(true));
    this.rootElement = shadowRoot.querySelector('flip') as HTMLElement;
    (shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement)
      .addEventListener('slotchange', () => {
        this.cardsCatch = Array.from(
          this.querySelectorAll(':scope > :not([slot=temp])'),
        );

        const { index, cardsCatch } = this;

        if (index === -1 || index >= cardsCatch.length) {
          this.index = cardsCatch.length > 0 ? 0 : -1;
        }
      });
  }

  static get DIRECTION() {
    return { ...Direction };
  }

  static get MODE() {
    return { ...Mode };
  }

  static get EVENT() {
    return { ...Event };
  }

  /**
   * Returns cloned card node.
   */
  static cloneCard = cloneCard

  /**
   * Returns value of card node.
   */
  static getCardValue(card: HTMLElement | null): string | null {
    return card?.getAttribute?.(Attribute.value) ?? null;
  }

  /**
   * Returns card elements.
   */
  get cards(): HTMLElement[] {
    return [...this.cardsCatch];
  }

  /**
   * Returns flipping mode.
   */
  get mode(): Mode {
    const mode = this.getAttribute(Attribute.mode) as Mode;

    return (mode === null || !Object.values(Mode).includes(mode)
      ? defaultAttributeValues[Attribute.mode]
      : mode
    );
  }

  /**
   * Sets flipping mode.
   */
  set mode(mode: Mode) {
    if (!Object.values(Mode).includes(mode)) {
      throw new TypeError(`Invalid mode: ${mode}`);
    }

    this.setAttribute(Attribute.mode, mode);
  }

  /**
   * Returns directly flipping.
   */
  get direct(): boolean {
    return this.getAttribute(Attribute.direct) !== null;
  }

  /**
   * Sets directly flipping.
   */
  set direct(direct: boolean) {
    if (direct) {
      this.setAttribute(Attribute.direct, '');
    } else {
      this.removeAttribute(Attribute.direct);
    }
  }

  /**
   * Returns flipping duration.
   */
  get duration(): number {
    const duration = this.getAttribute(Attribute.duration);

    return (duration === null || duration.length === 0
      ? defaultAttributeValues[Attribute.duration]
      : Number(duration)
    );
  }

  /**
   * Sets flipping duration.
   */
  set duration(duration: number) {
    if (isNaN(duration)) {
      throw new TypeError(`Invalid duration: ${duration}`);
    } else if (duration < 0) {
      throw new RangeError(`Duration should not be lesser than 0: ${duration}`);
    }

    this.setAttribute(Attribute.duration, `${duration}`);
  }

  /**
   * Returns flipping direction.
   */
  get direction(): Direction {
    const direction = this.getAttribute(Attribute.direction) as Direction;

    return (Object.values(Direction).includes(direction)
      ? direction
      : defaultAttributeValues[Attribute.direction]
    );
  }

  /**
   * Sets flipping direction.
   */
  set direction(direction: Direction) {
    if (!Object.values(Direction).includes(direction)) {
      throw new TypeError(`Invalid direction: ${direction}`);
    }

    this.setAttribute(Attribute.direction, direction);
  }

  /**
   * Returns min flips.
   */
  get minFlips(): number {
    const minFlips = this.getAttribute(Attribute.minFlips);

    return (minFlips === null || minFlips.length === 0
      ? defaultAttributeValues[Attribute.minFlips]
      : Number(minFlips)
    );
  }

  /**
   * Sets min flips.
   */
  set minFlips(minFlips: number) {
    if (isNaN(minFlips)) {
      throw new TypeError(`Invalid min flips: ${minFlips}`);
    } else if (parseInt(`${minFlips}`, 10) !== minFlips) {
      throw new TypeError(`Min flips should be an integer: ${minFlips}`);
    } else if (minFlips < 0) {
      throw new RangeError(`Min flips should not be lesser than 0: ${minFlips}`);
    }

    this.setAttribute(Attribute.minFlips, `${minFlips}`);

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
    const maxFlips = this.getAttribute(Attribute.maxFlips);

    return (maxFlips === null || maxFlips.length === 0
      ? defaultAttributeValues[Attribute.maxFlips]
      : Number(maxFlips)
    );
  }

  /**
   * Returns max flips.
   */
  set maxFlips(maxFlips: number) {
    if (isNaN(maxFlips)) {
      throw new TypeError(`Invalid max flips: ${maxFlips}`);
    } else if (parseInt(`${maxFlips}`, 10) !== maxFlips) {
      throw new TypeError(`Max flips should be an integer: ${maxFlips}`);
    } else if (maxFlips < 0) {
      throw new RangeError(`Max flips should not be lesser than 0: ${maxFlips}`);
    }

    this.setAttribute(Attribute.maxFlips, `${maxFlips}`);

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
    const perspective = this.getAttribute(Attribute.perspective);

    if (perspective !== null) {
      return perspective;
    }

    const { clientWidth, clientHeight } = this;
    const size = 2 * Math.max(clientWidth, clientHeight);

    return `${size}px`;
  }

  /**
   * Sets 3D perspective value.
   */
  set perspective(perspective: string) {
    if (typeof perspective === 'string' && perspective.length > 0) {
      this.setAttribute(Attribute.perspective, perspective);
    }
  }

  /**
   * Returns current index.
   */
  get index(): number {
    const index = this.getAttribute(Attribute.index);

    if (index === null || index.length === 0) {
      return defaultAttributeValues[Attribute.index];
    }

    return Number(index) % this.cards.length;
  }

  /**
   * Sets current index.
   */
  set index(index: number) {
    if (isNaN(index)) {
      throw new TypeError(`Invalid index: ${index}`);
    } else if (parseInt(`${index}`, 10) !== index) {
      throw new TypeError(`Index should be an integer: ${index}`);
    }

    const { cardsCatch } = this;
    const cardInfo = this.getCardInfo(index);
    const {
      index: cardIndex,
      value: cardValue,
      node: cardNode,
    } = cardInfo;

    if (cardNode === null && cardsCatch.length > 0) {
      throw new Error(`Illegal index: ${index}`);
    }

    if (cardIndex !== this.index) {
      this.querySelectorAll(`[slot="${Slot.current}"]`).forEach((card) => {
        card.removeAttribute('slot');
      });
      cardNode?.setAttribute?.('slot', Slot.current);
      this.setAttribute(Attribute.index, `${cardIndex}`);

      if (cardValue) {
        this.setAttribute(Attribute.value, cardValue);
      } else {
        this.removeAttribute(Attribute.value);
      }
    }
  }

  /**
   * Returns current value.
   */
  get value(): string | null {
    return this.getCardValue(this.index);
  }

  /**
   * Sets current value.
   */
  set value(value: string | null) {
    if (value !== null && typeof value !== 'string') {
      throw new TypeError(`Invalid value: ${value}`);
    }

    this.index = this.getCardIndex(value as string);
  }

  /**
   * Returns current card.
   */
  get card(): HTMLElement | null {
    return this.getCardNode(this.index);
  }

  /**
   * Sets current card.
   */
  set card(card: HTMLElement | null) {
    this.index = this.getCardIndex(card as HTMLElement);
  }

  /**
   * Returns card node.
   */
  getCardNode = getCardNode

  /**
   * Returns card index.
   */
  getCardIndex = getCardIndex

  /**
   * Returns card value.
   */
  getCardValue = getCardValue

  /**
   * Returns card info.
   */
  getCardInfo = getCardInfo

  /**
   * Returns the index of next card.
   */
  getNextCardIndex = getNextCardIndex

  /**
   * Returns the node of next card.
   */
  getNextCardNode(...args: Parameters<Flip['getNextCardIndex']>): ReturnType<Flip['getCardNode']> {
    const nextIndex = this.getNextCardIndex(...args);

    return this.getCardNode(nextIndex);
  }

  /**
   * Returns the value of next card.
   */
  getNextCardValue(...args: Parameters<Flip['getNextCardIndex']>): ReturnType<Flip['getCardValue']> {
    const nextIndex = this.getNextCardIndex(...args);

    return this.getCardValue(nextIndex);
  }

  /**
   * Returns the info of next card.
   */
  getNextCardInfo(...args: Parameters<Flip['getNextCardIndex']>): ReturnType<Flip['getCardInfo']> {
    const nextIndex = this.getNextCardIndex(...args);

    return this.getCardInfo(nextIndex);
  }

  /**
   * Flips to card by reference.
   */
  flip(
    source: number | string | HTMLElement,
    options?: FlipOptions,
  ): ReturnType<typeof flip>

  flip(options?: FlipOptions): ReturnType<typeof flip>

  flip(...args: Parameters<typeof flip>) {
    return flip.call(this, ...args);
  }

  /**
   * Does flipping animation from last card to next card.
   */
  flipAnimation = flipAnimation
}

registerElement(Flip, nodeName);

export default Flip;
