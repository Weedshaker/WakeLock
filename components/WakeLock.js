// @ts-check
import { Shadow } from '../event-driven-web-components-prototypes/src/Shadow.js'

/* global location */
/* global self */
/* global sessionStorage */

/**
 * Wake Lock
 *
 * @export
 * @class WakeLock
 * @type {CustomElementConstructor}
 */
export default class WakeLock extends Shadow() {
  constructor (...args) {
    super(...args)
    
    this.wakeLock = null
    this.clickListener = event => {
      if (this.imgAvailable.classList.contains('hidden')) {
        this.requestWakeLock().then(wakeLock => {
          this.imgAvailable.classList.remove('hidden')
          this.imgAway.classList.add('hidden')
          document.title = 'Wake Lock => retained!'
        })
      } else {
        this.releaseWakeLock()
      }
    }
    this.changeListener = event => {
      if (event.target && !isNaN(Number(event.target.value))) this.setTimer(event.target, event.target.value)
    }
    this.releaseListener = event => {
      this.imgAvailable.classList.add('hidden')
      this.imgAway.classList.remove('hidden')
      document.title = 'Wake Lock => released!'
    }
    this.visibilitychangeListener = event => {
      if (this.wakeLock !== null && document.visibilityState === 'visible') this.clickListener()
    }
  }

  connectedCallback (newRound = true) {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    this.imgContainer.addEventListener('click', this.clickListener)
    this.input.addEventListener('change', this.changeListener)
    document.addEventListener('visibilitychange', this.visibilitychangeListener)
  }

  disconnectedCallback () {
    this.imgContainer.removeEventListener('click', this.clickListener)
    this.input.removeEventListener('change', this.changeListener)
    document.removeEventListener('visibilitychange', this.visibilitychangeListener)
    if (this.wakeLock) this.wakeLock.removeEventListener('release', this.releaseListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    // @ts-ignore
    return !this.imgContainer
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 100vh;
        justify-content: center;
        width: 100vw;
      }
      :host > h1 {
        color: var(--theme-color);
        font-size: min(3rem, 4vw);
      }
      :host > .img {
        align-items: center;
        display: grid;
        height: 100%;
        justify-content: center;
        width: 100%;
      }
      :host > .img > img {
        grid-column: 1;
        grid-row: 1;
      }
      :host > .img > img {
        border-radius: 50%;
        box-shadow: 7px 8px 31px var(--theme-color);
        cursor: pointer;
        height: auto;
        max-height: min(500px, calc(100vh - (20px + 11rem)));
        max-width: min(500px, calc(100vw - 20px));
        transition: opacity 0.8s ease;
        width: auto;
      }
      :host > .img > img.hidden {
        opacity: 0;
      }
      :host > p {
        color: red;
        font-size: 3rem;
        padding: 20px;
      }
      :host > div {
        color: var(--theme-color);
        font-size: 1rem;
      }
      :host > div, :host > div > input {
        max-width: min(500px, calc(100vw - 20px));
      }
      :host > div >  input {
        border: 0;
        color: var(--theme-color);
        font-size: min(3rem, 4vw);
        text-align: center;
      }
      :host > div >  input.active {
        border: 3px solid;
        animation: active 3s linear infinite;
      }
      @keyframes active {
        from {border-color: rgb(255, 0, 0, 0);}
        50% {border-color: rgb(255, 0, 0, 1);}
        to {border-color: rgb(255, 0, 0, 0);}
      }
    `
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = /* html */`
      <h1>Keep Microsoft Teams Status Available...</h1>
      <div class=img>
        <img class="available hidden" src=../img/iconAvailable.png />
        <img class=away src=../img/iconAway.png />
      </div>
      <div>Request/Release in (min.):<br><input type="number" placeholder="0"></div>
    `
  }

  /**
   * @return {Promise<WakeLock>}
   */
  requestWakeLock () {
    try {
      // @ts-ignore
      const wakeLockPromise = navigator.wakeLock.request('screen')
      wakeLockPromise.then(wakeLock => {
        this.wakeLock = wakeLock
        this.wakeLock.addEventListener('release', this.releaseListener)
      })
      return wakeLockPromise
    } catch (error) {
      this.html = ''
      this.html = /* html */`
        <p>By 2021 only Chrome/Edge support Wake Lock. Use an other Browser!<br>Error: ${error.name}, ${error.message}</p>
      `
      return Promise.reject(`${error.name}, ${error.message}`)
    }
  }

  releaseWakeLock () {
    if (!this.wakeLock) return
    this.wakeLock.release()
    this.wakeLock = null
  }

  setTimer (input, value) {
    input.value = value = Math.floor(value)
    clearTimeout(this.timer)
    if (!value || value <= 0) {
      input.classList.remove('active')
      input.value = 0
      this.clickListener()
    } else {
      input.classList.add('active')
      this.timer = setTimeout(() => this.setTimer(input, value - 1), 60000)
    }
    input.blur()
  }

  get imgContainer () {
    return this.root.querySelector('.img')
  }

  get imgAvailable () {
    return this.root.querySelector('img.available')
  }

  get imgAway () {
    return this.root.querySelector('img.away')
  }

  get input () {
    return this.root.querySelector('input')
  }
}
