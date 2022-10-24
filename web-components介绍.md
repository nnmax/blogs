# Web Components 介绍

我们的程序会随着新代码的加入和旧代码的维护而慢慢变得臃肿而难以维护。出现这种问题的其中一个原因就是模块和模块之间的强耦合性（或者根本没有模块可言）。

模块讲究单一原则，及尽量只做一件事，尽量跟其他模块解绑。使用者不需要知道其实现细节。你只需要知道如何使用这个模块，和给定一组输入后会输出什么。

虽然模块化的概念非常简单，但是想在 Web 应用中应用模块化的思想却有点难。究其原因是：

1. Web 应用需要 HTML、JavaScript 和 CSS 来呈现多样化的内容，他们被分割到了三种不同的文件中；
2. 代码难以复用
3. 并且我们还要考虑全局样式和全局对象的干扰。

这些问题在 Web Components 出现之前，很难通过原生开发来解决。因此出现了很多以组件化为核心的框架，比如 React 和 Vue 等。

## 什么是 Web Components

Web Components 旨在解决以上的问题。它是一种创建模块化、组件化、单一职责的代码块的方式，可以在您喜欢的任何地方重用组件，而不必担心代码冲突。

HTML 中有许多原生标签是通过这种技术来封装的，比如 `<video>`, `<audio>`, `<input>` 等标签。

在我们使用 `<video>` 标签的使用，不需要了解其内部的代码结构已经实现方式，只需要提供一个视频 URL，它就会帮我们通过网络请求来获取视频内容，并提供一个容器来播放视频。还支持暂停、播放、快进、后退以及音量调节等功能。任意数量的 `<video>` 标签可以放在任意的地方，并且我们不需要担心它们之间会产生冲突。

如果我们没有 Web Components，只能使用 React 或 Vue 等框架来创建我们的组件，这些框架帮我们解决了很多复杂的编程问题，但是：

1. 使用 React 和 Vue 编写的组件只能在它们的框架中使用，无法与其他框架兼容；
2. 随着框架的发展而不得不更新你的代码；
3. 可能会被其他框架替代，到那时你不得不替换它们；

而在 Web Components 中，你不必担心这些。

## Web Components 的使用

Web Components 需要使用 ES6 的 Class 语法来定义一个继承 `HTMLElement` 的类，然后通过 `window.customElements.define() API` 来注册，才能在代码中使用。

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = 'Hello World'
  }
}

window.customElements.define('hello-world', HelloWorld)
```

> 我们定义的元素名称必须包含一个破折号，这是为了避免与原生标签冲突。

然后我们可以通过 `<hello-world>` 来使用我们的自定义组件。

```html
<hello-world></hello-world>
```

### Shadow DOM

Web Components 允许我们创建 Shadow DOM 并附加到自定义元素中。我们可以在 Shadow DOM 中定义 HTML 结构以及 CSS 样式，并与页面上的其他代码相隔离。

我们可以使用 `Element.attachShadow()` 方法创建一个 Shadow DOM 节点并附加到自定义元素中。该方法接收一个对象参数来定义此 Shadow DOM 是否是隐藏的（无法通过 `Element.shadowRoot` 获取）。

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = 'Hello World'
  }
}

window.customElements.define('hello-world', HelloWorld)
```

### Template & Slot

我们可以使用 HTML 提供的 `<template>` 标签来定义一组模板。`<template>` 标签不会呈现任何内容，但是可以使用 JavaScript 来获取它。

```html
<template id="custom-title">
  <h1>Title</h1>
</template>

<custom-title></custom-title>

<script>
  class CustomTitle extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const titleTemplate = document.querySelector('#custom-title')
      this.shadowRoot.appendChild(titleTemplate.content.cloneNode(true))
    }
  }

  window.customElements.define('custom-title', CustomTitle)
</script>
```

在以上代码中，我们创建了 id 为 custom-title 的模版，并在 Web Components 中使用。

接下来我们使用 slot 来添加灵活度。

```html
<template id="custom-title">
  <h1><slot></slot></h1>
</template>

<custom-title>
  Web Components
</custom-title>

<script>
  class CustomTitle extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const titleTemplate = document.querySelector('#custom-title')
      this.shadowRoot.appendChild(titleTemplate.content.cloneNode(true))
    }
  }

  window.customElements.define('custom-title', CustomTitle)
</script>
```

### 添加样式

我们可以直接在 `<template>` 标签内使用 `<style>` 来添加样式，比如：

```html
<template id="custom-title">
  <style>
    h1 {
      font-family: Roboto;
      font-size: 2em;
      color: #0c022f;
    }
  </style>

  <h1><slot></slot></h1>
</template>
```

如果不使用 template，则也可以直接嵌入到 JavaScript 代码中。

```js
class CustomTitle extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    this.shadowRoot.innerHTML = `
      <style>
        h1 {
          font-family: Roboto;
          font-size: 2em;
          color: #0c022f;
        }
      </style>

      <h1><slot></slot></h1>
    `
  }
}

window.customElements.define('custom-title', CustomTitle)
```

也可以使用 [CSS Module Scripts](https://web.dev/css-module-scripts/) 来导入外部的 css 文件。

```css
/* custom-title.css */

h1 {
  font-family: Roboto;
  font-size: 2em;
  color: #0c022f;
}
```

```js
import styles from './custom-title.css' assert { type: 'css' }

class CustomTitle extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.adoptedStyleSheets.push(styles)
    
    this.shadowRoot.innerHTML = `
      <h1><slot></slot></h1>
    `
  }
}

window.customElements.define('custom-title', CustomTitle)
```

### Attributes

我们可以将 slot 换成 attribute 的形式，并且监听 attribute 的变化。

```js
import styles from './custom-title.css' assert { type: 'css' }

class CustomTitle extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets.push(styles)
    this.shadowRoot.innerHTML = `
      <h1></h1>
    `
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (oldValue === newValue) return

    if (attribute === 'title') {
      this.shadowRoot.querySelector('h1').textContent = newValue
    }
  }
}
```

这样，我们就可以传入 attribute 了：

```html
<custom-title title="My Title"></custom-title>
```

一个静态的 `observedAttributes` getter 应该返回一个您需要监听的 attributes 数组。当其中的任意一个 attribute 改变之后，会调用 `attributeChangedCallback` 生命周期方法，该方法传入三个参数，分别是被改变的 attribute、旧值以及新值。

### 生命周期方法

自定义元素有其完整的生命周期，并调用其与之对应的回调函数。

* `constructor`: 自定义元素的构造函数，在初始化时被调用。在构造函数中必须调用 `super()` 方法以执行父类的构造函数。可以在构造函数中做一些初始化的工作，比如设置默认值和其他预渲染操作。
  
* `attributeChangedCallback`: 当自定义元素在新增、修改、删除属性时会被调用。必须设置 `static get observedAttributes` 来指定您需要监听的属性。此函数会先于 `connectedCallback` 执行。

* `connectedCallback`: 当自定义元素首次插入到 DOM 文档时调用。你应该这这里运行需要渲染的内容和设置一些需要监听的事件。
  
* `disconnectedCallback`: 当自定义元素从 DOM 文档中移除时调用。你应该在这里清除一些存储状态或终止 Ajax 请求。

* `adoptedCallback`: 当自定义元素被移动到新的文档时调用。你应该找不到使用它的场景。

### 参与 HTML 表单

默认情况下，自定义元素不支持直接参与表单。我们需要使用 `HTMLElement.attachInternals()` API 来实现。

```html
<script type="module">
  class TextField extends HTMLElement {
    static formAssociated = true;
    #internals;
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.#internals = this.attachInternals();
      this.shadowRoot.innerHTML = `
        <input type="text">
      `;
    }

    connectedCallback() {
      const input = this.shadowRoot.querySelector("input");
      input.addEventListener("input", (event) => {
        const { value } = event.target;
        this.#internals.setFormValue(value);
      });
    }
  }

  window.customElements.define("text-field", TextField);
</script>

<form>
  <text-field name="username"></text-field>
  <button type="submit">Submit</button>
</form>
```

> 您必须添加 `static formAssociated = true` 才能使用 `his.attachInternals()`，否则会抛出异常。

## 在其他框架中使用 Web Components

自定义元素支持所有的 JavaScript 框架，您可以在任何框架中像使用 `div` 一样简单（会有细微的差别）。

[custom-elements-everywhere.com](https://custom-elements-everywhere.com/) 列出了所有 JavaScript 框架对自定义元素的支持程度。
