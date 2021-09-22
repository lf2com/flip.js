# flip.js

Flip.js is an element for flipping effect for wrapped elements.

## Demo

[url-demo-flip]: https://lf2com.github.io/flip.js/demo/flip
[url-demo-list]: https://lf2com.github.io/flip.js/demo/list
[url-demo-card]: https://lf2com.github.io/flip.js/demo/card

[Flip][url-demo-flip]

Sets flip properties of duration, direction, and mode.

![Flip](./demo/flip/demo.gif)

[List][url-demo-list]

Flips items of list, you can arrange, add, and remove items.

![List](./demo/list/demo.gif)

[Card][url-demo-card]

Flips cards with images.

![Card](./demo/card/demo.gif)

## Usage

Install from [GitHub](https://github.com/lf2com/flip.js) or [npmjs](https://www.npmjs.com/package/@lf2com/flip.js):

```sh
npm install @lf2com/flip.js
# or
npm install https://github.com/lf2com/flip.js
```

Import to your project:

```js
import '@lf2com/flip.js';
// or
require('@lf2com/flip.js');
```

### Browser

Add the script file to your HTML file:

```html
<script src="PATH/TO/flip.js" defer></script>

<!-- create flip -->
<flip-pack direction="down">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
  <div class="card">4</div>
  <div class="card">5</div>
</flip-pack>

<!-- or create flip by JS -->
<script>
  const flip = document.createElement('flip-pack');
  flip.direction = 'down'; // or flip.setAttribute('direction', 'down');

  // or if you are using jQuery
  const $flip = $('<flip-pack>').attr({
    direction: 'down',
  });
</script>
```

### Styling Card Members

We need to define and style the cards in the flip element so that every card can be displayed and flipped rightly by flip.js. There are some rules we need to follow to prevent from issues of flipping animation.

#### Specific Parent Selector

A CSS selector `flip-pack > .card` defines the style of `.card` that belongs to the parent node `flip-pack`, which causes the cloned card element for flipping animation reference to no styles. Instead, use `flip-pack .card` in replacement.

```html
<style>
  /* Do NOT use:
   * flip-pack > .card
   */
  flip-pack .card {
    width: 100px;
    height: 150px;
    border-radius: 10px;
    background: #eee;
    font-size: 30px;
    color: #000;
  }
</style>

<flip-pack>
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

#### Nth Child Selector

The CSS selector `:nth-child()` defines the style of nth child of parent node, causing the cloned card element for flipping animation being applied unexpected styles due to the element would be the last child of `flip-pack` and there are cloned card element that would be seen as the first child.

```html
<style>
  flip-pack .card {
    width: 100px;
    height: 150px;
    border-radius: 10px;
    background: #eee;
    font-size: 30px;
    color: #000;
  }

  /* Do NOT use:
   * flip-pack .card:nth-child(odd)
   */
  flip-pack .card.odd {
    background: #fee;
  }
</style>

<flip-pack>
  <div class="card odd" value="a">A</div>
  <div class="card" value="b">B</div>
  <div class="card odd" value="c">C</div>
  <div class="card" value="d">D</div>
</flip-pack>
```

## Build

Build flip.js by the command:

```sh
npm run build
```

And get the built file at `./dist/flip.min.js`.

## Properties

We defined serveral properties for setting flip.

**NOTICE: `flip.getAttribute(...)` won't get the latest value of the attribute. The attribute getter is designed for configuring attribute value with HTML.**

### .index

Index of current displayed card. Set the value to change the current displayed card without flipping animation.

```html
<!-- initial index -->
<flip-pack index="2">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

```js
// set initial index
flip.index = 2;
// or
flip.setAttribute('index', 2);

// get index
console.log('index:', flip.index);
```

### .card

Current displayed card. Set an element wrapped in the flip to change the current displayed card without flipping.

```js
// set card
const domCard = document.createElement('div');
domCard.classList.add('card');
domCard.innerHTML = 'E';
flip.append(domCard);
flip.card = domCard;

// get card
console.log('card:', flip.card);
```

### .value

Value of current displayed card. Set a value of wrapped cards of the flip to change the current displayed card without flipping.

```html
<!-- set value -->
<flip-pack value="c">
  <div class="card" value="a">A</div>
  <div class="card" value="b">B</div>
  <div class="card" value="c">C</div>
  <div class="card" value="d">D</div>
</flip-pack>
```

```js
// set value
flip.value = 'c';

// get value
console.log('value:', flip.value);
```

### .cards

Gets the array of card elements wrapped in the flip element.

```js
// get cards
console.log('cards:', flip.cards);
```

### .mode

Mode of getting the next card and flipping animation. Default is `loop`:

| Name | Description |
| -: | :- |
| loop | Pick the next card after the current one |
| random | Pick card randomly from wrapped cards |

```html
<!-- set mode -->
<flip-pack mode="random">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

### .minFlips/.maxFlips

Minimum or maximum times of flipping on `random` mode.

```html
<!-- set min/max flips -->
<flip-pack mode="random" min-flips="5" max-flips="8">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

```js
// set min/max flips
flip.minFlips = 5;
flip.maxFlips = 8;
// or
flip.setAttribute('min-flips', 5);
flip.setAttribute('max-flips', 8);

// get min/max flips
console.log('min flips:', flip.minFlips);
console.log('max flips:', flip.maxFlips);
```

### .duration

Duration of flipping one card in milliseconds. Default is `400`.

```html
<!-- set duration -->
<flip-pack duration="200">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

```js
// set duration
flip.duration = 200;

// get duration
console.log('duration:', flip.duration);
```

### .direction

Direction of flipping. Default is `down`:

| Name | Description |
| -: | :- |
| down | Flipping down |
| up | Flipping up |
| left | Flipping left |
| right | Flipping right |

```html
<!-- set direction -->
<flip-pack direction="left">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

```js
// set direction
flip.direction = 'left';

// get direction
console.log('direction:', flip.direction);
```

### .perspective

3D perspective of flipping. The value is the CSS perspective. Default is `10rem`. You might have to set the value if the size of card is large.

**NOTICE: We should .**

```html
<!-- set perspective -->
<flip-pack perspective="50vmin">
  <div class="card">A</div>
  <div class="card">B</div>
  <div class="card">C</div>
  <div class="card">D</div>
</flip-pack>
```

```js
// set perspective
flip.perspective = '50vmin';

// get perspective
console.log('perspective:', flip.perspective);
```

## Methods

Flip supports the following methods:

### Static

#### Flip.getCardValue(_card_)

A static method returning the value of card element. Basically is the `value` attribute value of the card element.

#### Flip.cloneCard(_card_)

This is a static method returning a card element cloned from the input one. It will call this method for cloning the previous and next card element to making the flipping animation.

### Prototype

#### .getCardByIndex(_index_)

Returns the nth card by index of cards wrapped in the flip element. `null` if the target card doesn't exist.

#### .getCardInfo(_source_)

Returns the card info. The source can be _number_ as card index or _HTMLElement_ as card element. Values of returned object:

| Name | Type | Description |
| -: | :-: | :- |
| index | _number_ | Index of card. `-1` if source doesn't exist |
| card | _HTMLElement_ | Card element. `null` if source doesn't exist |

#### .getValueByIndex(_index_)

Returns the value of the nth card by index. `null` when the card doesn't exist.

#### .getIndexByCard(_card_)

Returns the index of card element of wrapped cards. The same as `flip.cards.indexOf(card)`. `-1` on the card doesn't exist.

#### .getIndexByValue(_value_)

Returns the index of card with the specific value. `-1` if there is no card matches the value.

#### .getNextIndex(_options?_)

Returns the next card index with options:

| Name | Type | Description |
| -: | :-: | :- |
| different? | _boolean_ | `true` to prevent from getting the same card as the current one. Default is `true` |
| mode? | _string_ | Mode of choosing the next card. Default is the configured mode value of flip |

#### .getNextCard(_options?_)

Returns the next card with options the same as [`.getNextIndex(options?)`](#getnextindexoptions).

#### .flip(_next?_, _options?_)

Flips to the specific card element/index with flipping animation. If not specify target to flip, it will call [`.getNextIndex()`](#getnextindexoptions) to get the next card. If there are cards between the current card and target card, the flip element would flip over these cards to the target card.

Values of options:

| Name | Type | Description |
| -: | :-: | :- |
| direct? | _boolean_ | `true` to flip only once to the target card. Default is `false` |
| duration? | _number_ | Duration of flipping one card. Default is the configured duration value of flip |
| direction? | _string_ | Flipping direction. Default is the configured direction value of flip |

```js
// flip 3 times
await flip.flip(); // use await to wait until flipping animation ends
await flip.flip();
await flip.flip();
```

#### .flipToCard(_next_, _options?_)

Alias of [`.flip()`](#flipnext-options) with the first argument for card element.

#### .flipToIndex(_index_, _options?_)

Alias of [`.flip()`](#flipnext-options) with the first argument for card index.

#### .flipDirectly(_next?_, _options?_)

Alias of [`.flip()`](#flipnext-options) with the `direct` of options set to `true`, which flips card only once to the target card.

#### .flipToCardDirectly(_card_, _options?_)

Alias of [`.flipDirectly()`](#flipdirectlynext-options) with the first argument for card element.

#### .flipToIndexDirectly(_index_, _options?_)

Alias of [`.flipDirectly()`](#flipdirectlynext-options) with the first argument for card index.

## Events

Flip supports the following events:

### flipstart

Start of flipping cards.

> **This event can be cancelled and the flipping would not be performed. Also the card would not be changed.**

Values of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| direct | _boolean_ | `true` to flip only once to the target card |
| duration | _number_ | Duration of flipping one card |
| direction | _string_ | Flipping direction |
| lastIndex | _number_ | The current card index |
| lastCard | _HTMLElement_ | The current card element |
| targetIndex | _number_ | The target card index |
| targetCard | _HTMLElement_ | The target card element |

### flipend

End of flipping cards. Values of `event.detail` is the same as [flipstart](#flipstart).

### flipcardstart

Start of flipping one card.

> **This event can be cancelled and the card would be changed without flipping animation.**

Values of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| direct | _boolean_ | `true` to flip only once to the target card |
| duration | _number_ | Duration of flipping one card |
| direction | _string_ | Flipping direction |
| lastIndex | _number_ | The current card index |
| lastCard | _HTMLElement_ | The current card element |
| nextIndex | _number_ | The next card index |
| nextCard | _HTMLElement_ | The next card element |
| tempCard | _HTMLElement_ | The temporary card element for flipping animation |

### flipcardend

End of flipping one card. Values of `event.detail` is the same as [flipcardstart](#flipcardstart).

## License

[url-license]: https://github.com/lf2com/flip.js/blob/master/LICENSE

Flip.js is [MIT licensed][url-license].
