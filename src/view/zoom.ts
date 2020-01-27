export class Zoom {
    element: HTMLElement;
    intensity: number;
    onZoom: Function;
    previous: { cx: number, cy: number, distance: number } | null = null;
    pointers: PointerEvent[] = [];
    destroy: () => void;

    constructor (container: HTMLElement, element: HTMLElement, intensity: number, onZoom: Function) {
        this.element = element;
        this.intensity = intensity;
        this.onZoom = onZoom;

        container.addEventListener();
        container.addEventListener();
        container.addEventListener();

        const cleanup = [
            listenWindow('pointermove', this.move.bind(this)),
            listenWindow('pointerup', this.end.bind(this)),
            listenWindow('pointercancel', this.end.bind(this))
        ];

        this.destroy = () => cleanup.forEach(callback => callback());
    }
}