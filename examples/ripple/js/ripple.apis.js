const rippleChildren = []

/**
 * 创建以下结构并返回：
 * <span class="ripple-child enter">
 *   <span class="ripple-child-child"></span>
 * </span>
 */
function createRippleChild(rect) {
  const rippleChild = document.createElement('span')
  rippleChild.classList.add('ripple-child', 'enter')
  const rippleChildChild = document.createElement('span')
  rippleChildChild.classList.add('ripple-child-child')
  rippleChild.appendChild(rippleChildChild)

  const { height, left, top, width } = rect
  rippleChild.style.height = height
  rippleChild.style.width = width
  rippleChild.style.top = top
  rippleChild.style.left = left

  rippleChildren.push(rippleChild)

  return rippleChild
}

export function startRipple(event) {
  const { currentTarget: container } = event
  const { left, top, width, height } = container.getBoundingClientRect()
  let rippleX, rippleY
  let clientX = 0,
    clientY = 0
  /**
   * 涟漪效果是否从节点的中心扩散，否则从鼠标点击的位置开始扩散
   * 使用 Tab 键移动焦点的时候，从节点的中心扩散
   */
  let center = false
  let isFocusVisible = false

  if (container.matches(':focus-visible')) {
    center = isFocusVisible = true
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }

  rippleX = center ? width / 2 : clientX - left
  rippleY = center ? height / 2 : clientY - top

  // 从鼠标点击的中心位置，构造一个能正好包围当前元素的圆
  const sizeX = Math.max(width - rippleX, rippleX) * 2
  const sizeY = Math.max(height - rippleY, rippleY) * 2
  const diagonal = Math.sqrt(sizeX ** 2 + sizeY ** 2)

  const rippleChild = createRippleChild({
    width: `${diagonal}px`,
    height: `${diagonal}px`,
    left: `${-diagonal / 2 + rippleX}px`,
    top: `${-diagonal / 2 + rippleY}px`,
  })
  if (isFocusVisible) {
    rippleChild.classList.add('pulsate')
  }
  const rippleRoot = container.querySelector(':scope > .ripple-root')
  rippleRoot.appendChild(rippleChild)
}

export function stopRipple() {
  const rippleChild = rippleChildren.shift()

  if (!rippleChild) return

  rippleChild.addEventListener('animationend', (event) => {
    if (event.animationName === 'exitKeyframe') {
      rippleChild.remove()
    }
  })
  rippleChild.classList.add('exit')
}
