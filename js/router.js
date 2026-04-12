// Simple SPA Router with Query Parameters
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.defaultPage = 'public';
        
        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    navigate(path) {
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
        const url = `${window.location.pathname}?page=${normalizedPath || this.defaultPage}`;
        window.history.pushState({}, '', url);
        this.handleRoute();
    }
    
    async handleRoute() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const normalizedPage = page || this.defaultPage;
        const route = `/${normalizedPage}`;
        
        if (!page) {
            const url = `${window.location.pathname}?page=${normalizedPage}`;
            window.history.replaceState({}, '', url);
        }
        
        const handler = this.routes[route] || this.routes[`/${this.defaultPage}`];
        
        if (handler) {
            this.currentRoute = route;
            await handler();
            document.dispatchEvent(new CustomEvent('app:route-rendered', {
                detail: {
                    route,
                    params: Object.fromEntries(params.entries())
                }
            }));
        }
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Export router instance
const router = new Router();
