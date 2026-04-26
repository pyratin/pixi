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

  const [activeFlag, activeFlagSet] = useState(false);

  const [hoverFlag, hoverFlagSet] = useState(false);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics')
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        layout: { _computedLayout: { width = 0, height = 0 } = {} } = {}
      } = refCurrent;

      refCurrentGraphics
        .clear()
        .roundRect(0, 0, width, height)
        .fill({ color: 0xffffff, alpha: 0.25 })
        .stroke({ alignment: 1, width: 5, color: 0x000000, alpha: 0.25 });
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, [index]);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      !activeFlag
        ? gsap.fromTo(
            refCurrent,
            { pixi: { angle: -1 * Math.random() - 1 } },
            {
              pixi: { angle: 1 * Math.random() + 1 },
              duration: 1,
              repeat: -1,
              yoyo: true,
              ease: 'power1.in'
            }
          )
        : gsap.to(refCurrent, { pixi: { angle: 0 }, duration: 1 });
    },
    {
      dependencies: [activeFlag],
      revertOnUpdate: true
    }
  );

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        pixi: { y: !activeFlag ? 0 : -50 },
        duration: 0.5,
        ease: 'elastic'
      });
    },
    { dependencies: [activeFlag] }
  );

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        pixi: { scale: hoverFlag && !activeFlag ? 1.05 : 1 }
      });
    },
    { dependencies: [activeFlag, hoverFlag] }
  );

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        borderWidth: 1,
        borderColor: 0x000000
      }}
      eventMode='static'
      cursor='pointer'
      onPointerEnter={() => hoverFlagSet((hoverFlag) => !hoverFlag)}
      onPointerLeave={() => hoverFlagSet((hoverFlag) => !hoverFlag)}
      onPointerTap={() => activeFlagSet((activeFlag) => !activeFlag)}
    >
      <pixiGraphics
        label='graphics'
        draw={() => {}}
        layout={{ position: 'absolute' }}
      />

      <pixiAnimatedSprite
        textures={textureCollection}
        layout={{ margin: 20 }}
        scale={2}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  return (
    <pixiLayoutContainer
      layout={{
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 0xff0000
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
