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

    // Переключить класс
	toggleClass(className: string, force?: boolean): this {
		this.container.classList.toggle(className, force);
		return this;
	}

	// Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

	// Сменить статус блокировки
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
    
	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
	
	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
