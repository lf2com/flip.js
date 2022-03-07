import flip, { FlipOptions } from './methods/flip';
import flipAnimation from './methods/flip/flipAnimation';
import getCandidateIndex from './methods/getCandidateIndex';
import getCandidateInfo from './methods/getCandidateInfo';
import getCandidateNode from './methods/getCandidateNode';
import getCandidateValue from './methods/getCandidateValue';
import getNextCandidateIndex from './methods/getNextCandidateIndex';
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
  lastCandidate: HTMLElement | null;
  tempCandidate: HTMLElement;
}

class Flip extends HTMLElement {
  protected candidatesCatch: HTMLElement[] = [];

  protected rootElement: HTMLElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(template.content.cloneNode(true));
    this.rootElement = shadowRoot.querySelector('flip') as HTMLElement;
    (shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement)
      .addEventListener('slotchange', () => {
        this.candidatesCatch = Array.from(
          this.querySelectorAll(':scope > :not([slot=temp])'),
        );

        const { candidatesCatch } = this;

        if (this.index === -1 && this.hasAttribute(Attribute.value)) {
          // initialize index by value
          this.value = this.getAttribute(Attribute.value);
        }

        if (this.index >= candidatesCatch.length || this.index < 0) {
          const index = candidatesCatch.length > 0 ? 0 : -1;

          this.index = index;
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

  static get observedAttributes() {
    return [
      Attribute.index,
      Attribute.value,
    ];
  }

  attributeChangedCallback(attributeName: Attribute) {
    switch (attributeName) {
      default:
        break;

      case Attribute.index:
        if (this.hasAttribute(Attribute.index)) {
          this.index = Number(this.getAttribute(Attribute.index));
        }
        break;

      case Attribute.value:
        if (this.hasAttribute(Attribute.value)) {
          this.value = this.getAttribute(Attribute.value);
        }
        break;
    }
  }

  /**
   * Returns value of candidate node.
   */
  static getCandidateValue(candidate: HTMLElement | null): string | null {
    return candidate?.getAttribute?.(Attribute.value) ?? null;
  }

  /**
   * Returns candidate elements.
   */
  get candidates(): HTMLElement[] {
    return [...this.candidatesCatch];
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

    return Number(index) % this.candidates.length;
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

    const { candidatesCatch } = this;
    const candidateInfo = this.getCandidateInfo(index);
    const {
      index: candidateIndex,
      value: candidateValue,
      node: candidateNode,
    } = candidateInfo;

    if (candidateNode === null && candidatesCatch.length > 0) {
      throw new Error(`Illegal index: ${index}`);
    }

    this.querySelectorAll(`[slot="${Slot.current}"]`).forEach((candidate) => {
      candidate.removeAttribute('slot');
    });
    candidateNode?.setAttribute?.('slot', Slot.current);

    if (candidateIndex !== this.index) {
      this.setAttribute(Attribute.index, `${candidateIndex}`);

      if (candidateValue) {
        this.setAttribute(Attribute.value, candidateValue);
      } else {
        this.removeAttribute(Attribute.value);
      }
    }
  }

  /**
   * Returns current value.
   */
  get value(): string | null {
    return this.getCandidateValue(this.index);
  }

  /**
   * Sets current value.
   */
  set value(value: string | null) {
    if (value !== null && typeof value !== 'string') {
      throw new TypeError(`Invalid value: ${value}`);
    }

    this.index = this.getCandidateIndex(value);
  }

  /**
   * Returns current candidate.
   */
  get candidate(): HTMLElement | null {
    return this.getCandidateNode(this.index);
  }

  /**
   * Sets current candidate.
   */
  set candidate(candidate: HTMLElement | null) {
    this.index = this.getCandidateIndex(candidate);
  }

  /**
   * Returns candidate node.
   */
  getCandidateNode = getCandidateNode

  /**
   * Returns candidate index.
   */
  getCandidateIndex = getCandidateIndex

  /**
   * Returns candidate value.
   */
  getCandidateValue = getCandidateValue

  /**
   * Returns cacandidaterd info.
   */
  getCandidateInfo = getCandidateInfo

  /**
   * Returns the index of next candidate.
   */
  getNextCandidateIndex = getNextCandidateIndex

  /**
   * Returns the node of next candidate.
   */
  getNextCandidateNode(...args: Parameters<Flip['getNextCandidateIndex']>): ReturnType<Flip['getCandidateNode']> {
    const nextIndex = this.getNextCandidateIndex(...args);

    return this.getCandidateNode(nextIndex);
  }

  /**
   * Returns the value of next candidate.
   */
  getNextCandidateValue(...args: Parameters<Flip['getNextCandidateIndex']>): ReturnType<Flip['getCandidateValue']> {
    const nextIndex = this.getNextCandidateIndex(...args);

    return this.getCandidateValue(nextIndex);
  }

  /**
   * Returns the info of next candidate.
   */
  getNextCandidateInfo(...args: Parameters<Flip['getNextCandidateIndex']>): ReturnType<Flip['getCandidateInfo']> {
    const nextIndex = this.getNextCandidateIndex(...args);

    return this.getCandidateInfo(nextIndex);
  }

  /**
   * Flips to candidate by reference.
   */
  flip(
    source?: number | string | HTMLElement,
    options?: FlipOptions,
  ): ReturnType<typeof flip>

  flip(options?: FlipOptions): ReturnType<typeof flip>

  flip(...args: Parameters<typeof flip>) {
    return flip.call(this, ...args);
  }

  /**
   * Does flipping animation from last candidate to next candidate.
   */
  protected flipAnimation = flipAnimation
}

registerElement(Flip, nodeName);

export default Flip;
