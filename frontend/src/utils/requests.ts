/**
 * HTTP methods supported by the request utility
 */
export enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

/**
 * Type of authentication to be used
 */
export type AuthType = "jwt" | "session";

/**
 * Controls how cookies are handled in cross-origin requests
 */
export enum TargetSource {
    /** Include credentials in cross-origin requests */
    OUTSOURCE = "include",
    /** Only include credentials in same-origin requests */
    INSOURCE = "same-origin",
    /** Never include credentials */
    NEVER = "omit"
}

/**
 * Interface for request configuration
 */
export interface RequestProps {
    /** The API endpoint route */
    route: string;
    /** HTTP method to use */
    method: Methods;
    /** Optional query parameters */
    params?: Record<string, any>;
    /** Optional request body */
    body?: any;
}

/**
 * Authentication configuration options
 */
export interface AuthOptions {
    /** Type of authentication */
    authType: AuthType;
    /** How to handle credentials */
    targetSource?: TargetSource;
    /** Token getter function or token string */
    token: (() => string) | string;
    /** Header key for auth (e.g., 'Authorization') */
    authKey?: string;
    /** Auth scheme (e.g., 'Bearer') */
    authValue?: string;
}

/**
 * Configuration options for the Requests class
 */
export interface RequestsOptions {
    /** Base URL for all requests */
    baseUrl: string;
    /** Default headers to include in all requests */
    headers?: Record<string, string>;
    /** Authentication strategy to use */
    authStrategy?: Strategy;
}


/**
 * Base strategy class for authentication
 * Extend this class to implement custom authentication strategies
 */
export class Strategy {
    authOptions: AuthOptions;
    constructor(authOptions: AuthOptions) {
        this.authOptions = authOptions;
    }
    applyHeaders(headers: Record<string, string>): Record<string, string> {
        return headers   
    }   
}
/**
 * Default authentication strategy using session-based auth
 */
export class DefaultStrategy extends Strategy {
    constructor() {
        super({
            authType:"session",
            targetSource: TargetSource.INSOURCE,
            token: "",
            authKey: undefined,
            authValue: undefined
        });
    }

    applyHeaders(headers: Record<string, string>): Record<string, string> {
        return {
            ...headers,
        };
    }
}
/**
 * JWT authentication strategy
 * Automatically adds 'Authorization: Bearer <token>' header to requests
 */
export class JWTStrategy extends Strategy {
    constructor(token: string|(() => string)) {
        super({
            authType:"jwt",
            targetSource: TargetSource.INSOURCE,
            token: token,
            authKey: "Authorization",
            authValue: "Bearer"
        });
    }
    applyHeaders(headers: Record<string, string>): Record<string, string> {
        const token = typeof this.authOptions.token === "function" ? this.authOptions.token() : this.authOptions.token;
        if (token){
            headers[this.authOptions.authKey!]= `${this.authOptions.authValue} ${token}`;
        }
        return headers;
    }   
}


// ---------------------------------------



/**
 * Base request class with common functionality for all request types
 */
class BaseRequest {
    baseUrl: string;
    headers:Record<string, string>;
    authStrategy: Strategy;
    
    constructor({ baseUrl , headers , authStrategy }: RequestsOptions) {
        this.baseUrl = baseUrl;
        this.headers = headers || {};
        this.authStrategy = authStrategy || new DefaultStrategy();
    }
    
    // private getDefaultsAuthOptions(authOptions?: AuthOptions): AuthOptions {
    //     return {
    //         authType: authOptions?.authType || "session",
    //         targetSource: authOptions?.targetSource || TargetSource.INSOURCE,
    //         token: authOptions?.token || "",
    //         authKey: authOptions?.authKey || "Authorization",
    //         authValue: authOptions?.authValue || "Bearer"
    //     };
    // }
}

/**
 * Handles request headers and authentication
 */
class HeadersRequestMaker extends BaseRequest {
    headers: Record<string, string>;
    
    constructor(options: RequestsOptions) {
        super(options);
        this.headers = this.getDefaultHeaders(options.headers);
        this.headers = this.authStrategy.applyHeaders(this.headers);
    }
    
    private getDefaultHeaders(headers?: Record<string, string>): Record<string, string> {
        return {
            ...headers,
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
    }
}

/**
 * Core request handling class with HTTP method implementations
 */
class Requests extends HeadersRequestMaker {
    private getFullURL(route: string): string {
        const base = this.baseUrl.endsWith('/') 
            ? this.baseUrl.slice(0, -1) 
            : this.baseUrl;
        
        const path = route.startsWith('/') 
            ? route 
            : `/${route}`;
            
        return `${base}${path}`;
    }
    
    async send({ route, method, params, body }: RequestProps): Promise<Response> {
        const url = new URL(this.getFullURL(route));
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });
        }
        return fetch(url.toString(), {
            method,
            credentials: this.authStrategy.authOptions.targetSource,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined
        });
    }
}

/**
 * Determines how the interceptor affects the request/response chain
 */
export enum InterceptorReturnType {
    /** Continue with the original value */
    RETURN_ARG,
    /** Use the value returned by the interceptor */
    RETURN_INTERCEPTED
}

/**
 * Type of interceptor (request or response)
 */
export enum InterceptorType {
    /** Intercepts requests before they are sent */
    REQUEST,
    /** Intercepts responses before they are processed */
    RESPONSE
}

/**
 * Function type for interceptors
 * @template T Type of the value being intercepted (RequestProps or Response)
 */
export type InterceptorFn<T> = (arg: T) => T | Promise<T>;

/**
 * Interceptor for modifying requests or responses
 * @template T Type of the value being intercepted
 */
export class Interceptor<T> {
    constructor(
        public interceptCall?: InterceptorFn<T>,
        public returnType: InterceptorReturnType = InterceptorReturnType.RETURN_INTERCEPTED
    ) {}
}

/**
 * Manages request and response interceptors
 * Handles registration, removal, and execution of interceptors
 */
export class InterceptorManager {
    interceptors: {
        interceptor: Interceptor<any>;
        rank: number;
        type: InterceptorType;
    }[] = [];
    
    addInterceptor(
        interceptor: Interceptor<any>,
        type: InterceptorType,
        rank: number = this.interceptors.length
    ) {
        this.interceptors.push({ interceptor, rank, type });
    }
    
    removeInterceptor(interceptor: Interceptor<any>) {
        this.interceptors = this.interceptors.filter(i => i.interceptor !== interceptor);
    }
    
    async executeInterceptors<T>(
        value: T,
        type: InterceptorType
    ): Promise<T> {
        let currentValue = value;
        const sortedInterceptors = [...this.interceptors]
            .filter(i => i.type === type)
            .sort((a, b) => a.rank - b.rank);
        
        for (const { interceptor } of sortedInterceptors) {
            if (!interceptor.interceptCall) continue;
            
            const result = await interceptor.interceptCall(currentValue);
            currentValue = interceptor.returnType === InterceptorReturnType.RETURN_ARG
                ? currentValue
                : result;
        }
        
        return currentValue;
    }
}

/**
 * Enhanced requests class with interceptors and response parsing
 * Provides a clean API for making HTTP requests with automatic JSON parsing
 */
export class APIRequests extends Requests {
    interceptorManager: InterceptorManager;
    
    constructor(options: RequestsOptions & { authStrategy?: Strategy }) {
        super({
            ...options,
            authStrategy: options.authStrategy,
        });
        this.interceptorManager = new InterceptorManager();
    }
    
    async send(request: RequestProps): Promise<Response> {
        const interceptedRequest = await this.interceptorManager.executeInterceptors(
            request,
            InterceptorType.REQUEST
        );
        
        const response = await super.send(interceptedRequest);
        
        return this.interceptorManager.executeInterceptors(
            response,
            InterceptorType.RESPONSE
        );
    }
    
    async parseResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            return response.json();
        }
        return response.text() as unknown as T;
    }
    
    async get<T>(route: string, params?: Record<string, any>): Promise<T> {
        const response = await this.send({ route, method: Methods.GET, params });
        return this.parseResponse<T>(response);
    }
    
    async post<T>(route: string, body?: any, params?: Record<string, any>): Promise<T> {
        const response = await this.send({ route, method: Methods.POST, params, body });
        return this.parseResponse<T>(response);
    }
    
    async put<T>(route: string, body?: any, params?: Record<string, any>): Promise<T> {
        const response = await this.send({ route, method: Methods.PUT, params, body });
        return this.parseResponse<T>(response);
    }
    
    async patch<T>(route: string, body?: any, params?: Record<string, any>): Promise<T> {
        const response = await this.send({ route, method: Methods.PATCH, params, body });
        return this.parseResponse<T>(response);
    }
    
    async delete<T>(route: string, params?: Record<string, any>): Promise<T> {
        const response = await this.send({ route, method: Methods.DELETE, params });
        return this.parseResponse<T>(response);
    }
}

/**
 * Standard paginated response format
 * @template T Type of items in the results array
 */
export interface PaginationResponse<T> {
    /** Array of paginated items */
    results: T[];
    /** URL to the previous page, or null if on first page */
    previous: string | null;
    /** URL to the next page, or null if on last page */
    next: string | null;
    /** Number of items in the current page */
    count: number;
    /** Total number of items across all pages (optional) */

    total_count?: number;
}