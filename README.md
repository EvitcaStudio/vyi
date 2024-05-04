# VYI Module
A lightweight module to read / manage .vyi files created in the Vylocity Game Engine.

## Installation

### ES Module

```js
import { VYI } from './vyi.mjs';
```

### IIFE (Immediately Invoked Function Expression)

```js
<script src="vyi.js"></script>;
// ...
window.VyiBundle.VYI;
```

### CommonJS (CJS) Module

```js
const { VYI } = require('./vyi.cjs.js');
```

### Global Dependency

VYI relies on the `VYLO` variable being globally accessible.
