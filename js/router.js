// Simple SPA Router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    navigate(path) {
        window.location.hash = path;
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes[hash] || this.routes['/'];
        
        if (route) {
            this.currentRoute = hash;
            route();
        }
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Export router instance
const router = new Router();
