import { useRef, useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite, Graphics } from 'pixi.js';

import Application_ from './Component/Application_';
import style from './index.module.scss';

const textureCollection = await Assets.load(
  '/asset/sprite/0123456789.json'
).then(({ textures, data: { frames } }) =>
  Object.entries(textures).map(([key, texture]) => ({
    texture,
    time: frames[key].duration
  }))
);

const LayoutContainer__ = ({ index }) => {
  useExtend({ LayoutContainer, AnimatedSprite, Graphics });

  const ref = useRef(undefined);

  const refLayoutInitialized = useRef(false);

  const [active, activeSet] = useState(false);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const onRefCurrentLayoutHandle = () =>
      !refLayoutInitialized.current &&
      (() => {
        Object.assign(
          refCurrent,
          /** @type {pixiJs.ContainerOptions} */ ({
            layout: /** @type {pixiLayout.LayoutOptions} */ ({
              ...(() => {
                const {
                  layout: { _computedLayout: { left, width } = {} } = {}
                } = refCurrent;

                return {
                  left: left + (width / 2) * (!index ? -1 : 1)
                };
              })()
            })
          })
        );

        Object.assign(refLayoutInitialized, { current: true });
      })();

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, [index]);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentAnimatedSprite = /** @type {AnimatedSprite} */ (
      refCurrent.getChildByLabel('animatedSprite')
    );

    refCurrentAnimatedSprite.play();
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics')
    );

    const onRefCurrentLayoutHandle = () => {
      refCurrentGraphics
        .clear()
        .roundRect(
          ...(() => {
            const {
              layout: {
                _computedLayout: {
                  left = 0,
                  top = 0,
                  width = 0,
                  height = 0
                } = {}
              } = {}
            } = refCurrent;

            return /** @type {const} */ ([left, top, width, height, 20]);
          })()
        )
        .stroke({ alignment: 1, width: 10, color: 0x000000, alpha: 0.25 });
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    Object.assign(
      refCurrent,
      /** @type {pixiJs.ContainerOptions} */ ({
        layout: /** @type {pixiLayout.LayoutOptions} */ ({
          marginBottom: active ? 100 : 0
        })
      })
    );
  }, [active]);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 0xff0000
      }}
      eventMode='static'
      cursor='pointer'
      onPointerTap={() => activeSet((active) => (!active ? true : false))}
    >
      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{ margin: 40 }}
        scale={2}
        animationSpeed={!index ? 0.5 : 1}
      />

      <pixiGraphics
        label='graphics'
        draw={() => {}}
        layout={{ position: 'absolute' }}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  return (
    <pixiLayoutContainer
      layout={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <LayoutContainer__ key={index} index={index} />
      ))}
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_ backgroundColor={0x1099bb}>
        <LayoutContainer_ />
      </Application_>
    </div>
  );
};

export default Home;
