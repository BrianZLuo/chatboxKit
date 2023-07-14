declare module '*.json' {
    const value: any;
    export default value;
  }
  
  interface Route {
    route: string;
    serve: string;
    statusCode: number;
  }
  
  interface Build {
    command: string;
    outputPath: string;
  }
  
  interface NavigationFallback {
    rewrite: string;
  }
  
  interface StaticWebAppConfig {
    routes: Route[];
    build: Build;
    appArtifactLocation: string;
    navigationFallback: NavigationFallback;
  }
  
  declare const staticWebAppConfig: StaticWebAppConfig;
  
  export default staticWebAppConfig;