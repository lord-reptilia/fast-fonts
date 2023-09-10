/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px grey;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  defaultSampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  @property()
  customSampleText = '';

  @property()
  localFonts = [];

  @property()
  size = 14

  override render() {
    const formatSample = (family) => `
        font-size: ${this.size}pt;
        font-family: ${family};
        src: local(${family});
    `;

    return html`
      <input 
        type="text"
        placeholder="Escribe el texto de muestra"
        value=${this.customSampleText} 
        @input=${this._handleSampleTextChange} 
      />

      <span>${this.size} pt</span>
      <input
        id="sample-size"
        type="range"
        value=${this.size}
        min="7"
        max="50"

        @input=${this._handleSampleSize}
      />

      ${this.localFonts?.splice(0, 9).map((localFont, i) => html`
        <article>
          <h1 class=".font-name">${i + 1} - ${localFont.fullName}</h1>
          <p style=${formatSample(localFont.postscriptName)}>${this.customSampleText || this.defaultSampleText}</p>
        </article>
      `)}
      
    `;
  }

  private _handleSampleTextChange(e: any) {
    this.customSampleText = e.target.value
  }

  private _handleSampleSize(e: any) {
    this.size = e.target.value;
    console.log(e.target.value)
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const getLocatFonts = async () => {
      try {
        const fontsQuery = await window.queryLocalFonts()
        console.log(fontsQuery);

        return fontsQuery;
      } catch(error: Error) {
        console.error(error.name, error.message);
      }
    };

    getLocatFonts()
      .then(res => this.localFonts = res)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
