import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ParticleSystem } from "../lib/ParticleSystem";
import { subscribe, updateMany } from "../lib/State";
import { initialState, type StateType } from "../state";

// Derives the keys that exist in both StateType and ParticleSystem, excluding undefined.
type ParticleSystemStateKeys = Exclude<
	{
		[K in keyof StateType]: K extends keyof ParticleSystem ? K : never;
	}[keyof StateType],
	undefined
>;

function updateParticleSystemFromState(
	particleSystem: ParticleSystem,
	state: Readonly<StateType>,
): void {
	// biome-ignore lint/complexity/noForEach: <explanation>
	(Object.keys(state) as Array<ParticleSystemStateKeys>).forEach((key) => {
		const value = state[key];
		if (value !== undefined && key in particleSystem) {
			if (key === "useTrails") {
				// Handle the special case for useTrails
				(particleSystem[key] as boolean) = value === "true";
			} else {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(particleSystem[key] as any) = value;
			}
		}
	});
}

@customElement("ds-particles")
export class DSParticles extends LitElement {
	static override styles = css`
		:host {
			display: flex;
			border: solid 1px gray;
			width: 100%;
			height: 100%;
		}
		canvas {
			background-color: var(--background);
			width: 100%;
			height: 100%;
		}
    `;

	@property({ type: String, reflect: true })
	clearColor = "#0099ff";

	private particleSystem: ParticleSystem | undefined;

	override updated(changedProperties: Map<string, unknown>) {
		if (changedProperties.has("clearColor")) {
			if (this.particleSystem) {
				this.particleSystem.clearColor = this.clearColor;
			}
		}
	}

	protected override firstUpdated(_changedProperties: PropertyValues): void {
		const canvas = this.renderRoot.querySelector("#g") as HTMLCanvasElement;

		this.particleSystem = new ParticleSystem(canvas);

		subscribe((state) => {
			if (this.particleSystem) {
				updateParticleSystemFromState(this.particleSystem, state);
			}
		});

		updateMany(initialState);

		this.particleSystem.animate();
	}

	override render() {
		return html`<canvas id="g"></canvas>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"ds-particles": DSParticles;
	}
}
