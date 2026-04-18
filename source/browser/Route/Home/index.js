import { useRef, useEffect } from 'react';
import { useExtend, useTick } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite } from 'pixi.js';

import Application_ from './Component/Application_';

const textureCollection = await Assets.load('/asset/sprite/fighter.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer, AnimatedSprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentChild = /** @type {AnimatedSprite} */ (
      refCurrent.getChildAt(0)
    );

    refCurrentChild.play();
  }, []);

  useTick(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    Object.assign(
      refCurrent,
      /** @type {pixiJs.ContainerOptions} */ ({
        rotation: refCurrent.rotation + 0.01
      })
    );
  });

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      <pixiAnimatedSprite
        textures={textureCollection}
        layout={{}}
        animationSpeed={0.5}
      />
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
