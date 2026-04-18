import { useRef, useState, useEffect } from 'react';
import { useExtend, useApplication } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite } from 'pixi.js';

import Application_ from './Component/Application_';

const textureCollection = await Assets.load('/asset/sprite/mc.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer__ = ({ dimension }) => {
  useExtend({ LayoutContainer, AnimatedSprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentChild = /** @type {AnimatedSprite} */ (
      refCurrent.getChildAt(0)
    );

    Object.assign(
      refCurrent,
      /** @type {pixiJs.ContainerOptions} */ ({
        layout: /** @type {pixiLayout.LayoutOptions} */ ({
          ...(() => {
            const { width, height } = dimension;

            const { width: _width, height: _height } = refCurrent;

            return {
              left: Math.random() * width - _width / 2,
              top: Math.random() * height - _height / 2
            };
          })()
        }),
        scale: 1 + Math.random() * 0.5,
        rotation: Math.random() * (Math.PI * 2)
      })
    );

    refCurrentChild.gotoAndPlay((Math.random() * textureCollection.length) | 0);
  }, [dimension]);

  return (
    <pixiLayoutContainer ref={ref} layout={{ position: 'absolute' }}>
      <pixiAnimatedSprite
        textures={textureCollection}
        layout={{}}
        animationSpeed={0.5}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const {
    app: { renderer }
  } = useApplication();

  const ref = useRef(undefined);

  const [dimension, dimensionSet] = useState({});

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const onRefCurrentLayoutHandle = () =>
      dimensionSet((dimension) =>
        !Object.keys(dimension).length
          ? (() => {
              const { width, height } = refCurrent.layout._computedLayout;

              return { width, height };
            })()
          : dimension
      );

    const onRendererResizeHandle = () => dimensionSet({});

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    renderer.on('resize', onRendererResizeHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);

      renderer.off('resize', onRendererResizeHandle);
    };
  }, [renderer]);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        flex: 1,
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 50 }).map((_, index) => (
        <LayoutContainer__ key={index} dimension={dimension} />
      ))}
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className='Home'>
      <Application_>
        <LayoutContainer_ />
      </Application_>
    </div>
  );
};

export default Home;
