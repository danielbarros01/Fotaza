import csrf from 'csurf'

// setup route middlewares
let csrfProtection = csrf({ cookie: true });

// Middleware personalizado para excluir rutas del middleware csurf
export default function conditionalCSRF(req, res, next) {
    // Solo aplica CSRF si la ruta no es '/payment/webhook'
    if (req.path === '/payment/webhook') {
        next();
    } else {
        csrfProtection(req, res, next);
    }
};

