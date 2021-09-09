const CLASSNAME_PREFIX = 'flip';
const CLASSNAME_VALUE = `${CLASSNAME_PREFIX}-value`;

const templateWrapper = document.createElement('template');

templateWrapper.innerHTML = `
  <style>
    :host {}

    :host .${CLASSNAME_VALUE} {}

    :host slot {
      display: none;
    }
  </style>
  <span class="${CLASSNAME_VALUE}"></span>
  <slot></slot>
`;

export default templateWrapper;
