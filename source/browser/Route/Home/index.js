import { useRef, useState, useEffect } from 'react';
import { useExtend, useApplication, useTick } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite } from 'pixi.js';

import Application_ from './Component/Application_';

const textureCollection = await Assets.load('/asset/sprite/monsters.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer__ = ({ index, dimension }) => {
  useExtend({ LayoutContainer, Sprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentChild = /** @type {Sprite} */ (refCurrent.getChildAt(0));

    Object.assign(refCurrent, {
      layout: /** @type {pixiLayout.LayoutOptions} */ ({
        position: 'absolute',
        ...(() => {
          const { width, height } = dimension;

          const { width: _width, height: _height } = refCurrent;

          return {
            left: Math.random() * width - _width / 2,
            top: Math.random() * height - _height / 2
          };
        })()
      })
    });

    Object.assign(
      refCurrentChild,
      /** @type {pixiJs.SpriteOptions} */ ({
        tint: Math.random() * 0xffffff
      })
    );
  }, [dimension]);

  useTick(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    Object.assign(
      refCurrent,
      /** @type {pixiJs.ContainerOptions} */ ({
        rotation: refCurrent.rotation + 0.1
      })
    );
  });

  return (
    <pixiLayoutContainer ref={ref} layout={{}}>
      <pixiSprite
        texture={textureCollection[index % textureCollection.length]}
        layout={{}}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const {
    app: { stage }
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

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useEffect(() => {
    stage.eventMode = 'static';

    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const onStagePointerTapHandle = () =>
      refCurrent.cacheAsTexture(!refCurrent.isCachedAsTexture);

    stage.on('pointertap', onStagePointerTapHandle);

    return () => {
      stage.off('pointertap', onStagePointerTapHandle);
    };
  }, [stage]);

  useTick(({ lastTime }) => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    Object.assign(
      refCurrent,
      /** @type {pixiJs.ContainerOptions} */ ({
        scale: Math.sin(lastTime / 1000),
        rotation: refCurrent.rotation + 0.01
      })
    );
  });

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        height: '100%',
        flex: 1,
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => (
        <LayoutContainer__ key={index} index={index} dimension={dimension} />
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
