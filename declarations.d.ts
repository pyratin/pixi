import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /** Registered at runtime via `@pixi/react` useExtend */
      pixiLayoutContainer: import('@pixi/react').PixiReactElementProps<
        typeof import('@pixi/layout/components').LayoutContainer
      > & {
        layout?: Partial<import('@pixi/layout').LayoutStyles> | boolean;
      };
      pixiText: any;
    }
  }
}
