import { useEffect } from 'react';
import { useApplication } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { Application } from '@pixi/react';

const dimensionGet = () => {
  const { innerWidth, innerHeight } = window;

  return { width: innerWidth, height: innerHeight };
};

const Application__ = ({ children }) => {
  const {
    app: { stage, renderer }
  } = useApplication();

  useEffect(() => {
    Object.assign(stage, {
      layout: /** @type {pixiLayout.LayoutOptions} */ ({
        ...dimensionGet(),
        justifyContent: 'center',
        alignItems: 'center'
      })
    });

    const onRendererResizeHandle = () =>
      Object.assign(stage, { layout: dimensionGet() });

    renderer.on('resize', onRendererResizeHandle);

    return () => {
      renderer.off('resize', onRendererResizeHandle);
    };
  }, [stage, renderer]);

  return children;
};

const Application_ = ({ backgroundColor = undefined, children }) => {
  return (
    <Application
      resizeTo={window}
      backgroundColor={backgroundColor || 0x1099bb}
    >
      <Application__>{children}</Application__>
    </Application>
  );
};

export default Application_;
