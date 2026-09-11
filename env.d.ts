/// <reference types="vite/client" />
/// <reference types="@react-router/node" />
/// <reference types="@shopify/polaris-types" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
