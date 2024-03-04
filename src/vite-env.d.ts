/// <reference types="vite/client" />
declare module '*.vue' {
    import { Component } from 'vue'; const component: Component; export default component;
}

declare module 'colorthief' {
    export default class ColorThief {
      constructor(options?: {quality?: number, useCORS?: boolean});
      getPalette(image: HTMLImageElement | string, colorCount?: number, callback?: (palette: Array<string>) => void): Promise<Array<string>>;
      getColor(image: HTMLImageElement | string, callback?: (color: string) => void): Promise<string>;
    }
  }