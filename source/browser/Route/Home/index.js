import { useExtend } from '@pixi/react';
import '@pixi/layout';
import { useRef, useEffect } from 'react';
import { LayoutContainer } from '@pixi/layout/components';
import { Assets, AnimatedSprite } from 'pixi.js';

import Application_ from './Component/Application_';

const textureCollection = await Assets.load(
  '/asset/sprite/0123456789.json'
).then(({ textures, data: { frames } }) =>
  Object.entries(textures).map(([key, texture]) => ({
    texture,
    time: frames[key].duration
  }))
);

const LayoutContainer_ = ({ index }) => {
  useExtend({ LayoutContainer, AnimatedSprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentChild = /** @type {AnimatedSprite} */ (
      refCurrent.getChildAt(0)
    );

    refCurrentChild.play();
  }, []);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        borderWidth: 1,
        borderColor: 0x000000
      }}
    >
      <pixiAnimatedSprite
        textures={textureCollection}
        layout={{}}
        scale={2}
        animationSpeed={!index ? 0.5 : 1}
      />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className='Home'>
      <Application_>
        {Array.from({ length: 2 }).map((_, index) => (
          <LayoutContainer_ key={index} index={index} />
        ))}
      </Application_>
    </div>
  );
};

export default Home;
