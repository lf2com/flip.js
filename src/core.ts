import Attributes from './values/attributes';
import template from './utils/templates/wrapper';

interface SwitchValueOptions {
  [Attributes.loops]?: number;
}

class Flip extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    (this.shadowRoot as ShadowRoot)
      .appendChild(template.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [
      Attributes.value,
      Attributes.loops,
    ];
  }

  attributeChangedCallback(name: string, prev: string, next: string): void {
    switch (name) {
      default:
        break;

      case Attributes.value:
        if (prev !== next) {
          this.switchValue(next);
        }
        break;
    }
  }

  /**
   * Returns current displayed value.
   */
  get value(): string | null {
    return this.getAttribute(Attributes.value);
  }

  /**
   * Sets current displayed value.
   */
  set value(value: string | null) {
    if (value === null) {
      this.removeAttribute(Attributes.value);
    } else {
      this.setAttribute(Attributes.value, value);
    }
  }

  /**
   * Changes current displayed value.
   */
  switchValue(nextValue: string, options: SwitchValueOptions = {}) {
    const {
      loops = true,
    } = options;
    
    
  }
}

export default Flip;
