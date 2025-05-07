/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Основные методы
	public getContainer(): HTMLElement {
		return this.container;
	}

	addClass(className: string): this {
		this.container.classList.add(className);
		return this;
	}

	removeClass(className: string): this {
		this.container.classList.remove(className);
		return this;
	}

	toggleClass(className: string, force?: boolean): this {
		this.container.classList.toggle(className, force);
		return this;
	}

	// Вспомогательные методы
	protected setText(selector: string, value: string): void {
		const element = this.container.querySelector(selector);
		if (element) element.textContent = value;
	}

	// Смена статуса блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

	protected setHidden(element: HTMLElement): void {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement): void {
		element.style.removeProperty('display');
	}

	protected setImage(selector: string, src: string, alt = ''): void {
		const image = this.container.querySelector<HTMLImageElement>(selector);
		if (image) {
			image.src = src;
			image.alt = alt;
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
