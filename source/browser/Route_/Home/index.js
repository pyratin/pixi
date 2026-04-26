import { useRef, useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite, Graphics } from 'pixi.js';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(useGSAP, gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

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

    Object.assign(
      refCurrentAnimatedSprite,
      /** @type {pixiJs.AnimatedSpriteOptions} */ ({
        tint: Math.random() * 0xffffff
      })
    );

    refCurrentAnimatedSprite.play();
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics')
    );

    const randomCollection = [Math.random(), Math.random()];

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
        .fill({ color: randomCollection[0] * 0xffffff })
        .stroke({ alignment: 1, width: 10, color: randomCollection[1] });
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

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      !active
        ? gsap.to(refCurrent, {
            pixi: { scale: 1.1, angle: 10 * (!index ? -1 : 1) },
            duration: 1,
            repeat: -1,
            yoyo: true
          })
        : gsap.to(refCurrent, { pixi: { scale: 1, angle: 0 }, duration: 0.25 });
    },
    { dependencies: [index, active], revertOnUpdate: true }
  );

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
      <pixiGraphics
        label='graphics'
        draw={() => {}}
        layout={{ position: 'absolute' }}
      />

      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{ margin: 40 }}
        scale={2}
        animationSpeed={!index ? 0.5 : 1}
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
