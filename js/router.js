// Simple SPA Router with Query Parameters
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    navigate(path) {
        const url = path === '/' ? window.location.pathname : `${window.location.pathname}?page=${path.slice(1)}`;
        window.history.pushState({}, '', url);
        this.handleRoute();
    }
    
    handleRoute() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const route = page ? `/${page}` : '/';
        
        const handler = this.routes[route] || this.routes['/'];
        
        if (handler) {
            this.currentRoute = route;
            handler();
        }
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Export router instance
const router = new Router();
