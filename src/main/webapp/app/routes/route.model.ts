export class Route {
    constructor(
        public path: string,
        public prefix: string,
        public serviceId: string,
        public appName: string,
        public active: string,
        public status: string
    ) { }
}
