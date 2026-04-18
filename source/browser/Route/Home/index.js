import { useRef, useState, useEffect } from 'react';
import { useExtend, useApplication, useTick } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite, Text } from 'pixi.js';
import 'pixi.js/advanced-blend-modes';

import Application_ from './Component/Application_';

const assetAliasCollection = ['panda', 'rainbow-gradient'];

const dimensionMaximum = 707;

const columnCount = 5;

const textureCollection = await Assets.load([
  ...assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  })),
  {
    alias: 'short-stack',
    src: '/asset/font/Short_Stack/ShortStack-Regular.ttf',
    data: { family: 'short-stack' }
  }
]).then((assetObject) =>
  assetAliasCollection.map((alias) => assetObject[alias])
);

const LayoutContainer__ = ({ index, blendMode, dimension }) => {
  useExtend({ LayoutContainer, Sprite, Text });

  const ref = useRef(undefined);

  useTick(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentChild = /** @type {Sprite} */ (refCurrent.getChildAt(0));

    Object.assign(
      refCurrentChild,
      /** @type {pixiJs.SpriteOptions} */ ({
        rotation: refCurrentChild.rotation + 0.01 * (index % 2 ? -1 : 1)
      })
    );
  });

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        ...(() => {
          const _dimension = dimension / columnCount;

          return { width: _dimension, height: _dimension };
        })(),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 0x000000
      }}
    >
      <pixiSprite
        texture={textureCollection[0]}
        layout={{
          height: '75%',
          objectFit: 'contain'
        }}
      />

      <pixiSprite
        texture={textureCollection[1]}
        layout={{ position: 'absolute', width: '100%', height: '100%' }}
        blendMode={blendMode}
      />

      <pixiLayoutContainer
        layout={{
          justifyContent: 'center',
          padding: 4,
          backgroundColor: 0xffffff
        }}
      >
        <pixiText
          {...(() =>
            /** @type {import('pixi.js').CanvasTextOptions} */ ({
              text: blendMode,
              layout: {},
              style: {
                fontFamily: 'short-stack',
                fontSize: Math.min(16, dimension / 50)
              }
            }))()}
        />
      </pixiLayoutContainer>
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const {
    app: { renderer }
  } = useApplication();

  const ref = useRef(undefined);

  const [dimension, dimensionSet] = useState(0);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const onRefCurrentLayoutHandle = () =>
      dimensionSet((dimension) =>
        !dimension
          ? (() => {
              const { width, height } = refCurrent.layout._computedLayout;

              return Math.min(width, height, dimensionMaximum);
            })()
          : dimension
      );

    const onRendererResizeHandle = () => dimensionSet(0);

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
        maxWidth: dimensionMaximum,
        height: '100%',
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {[
        'normal',
        'add',
        'screen',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'linear-burn',
        'linear-dodge',
        'linear-light',
        'hard-light',
        'soft-light',
        'pin-light',
        'difference',
        'exclusion',
        'overlay',
        'saturation',
        'color',
        'luminosity',
        'add-npm',
        'subtract',
        'divide',
        'vivid-light',
        'hard-mix',
        'negation'
      ].map((blendMode, index) => (
        <LayoutContainer__
          key={index}
          index={index}
          blendMode={blendMode}
          dimension={dimension}
        />
      ))}
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className='Home'>
      <Application_ backgroundColor={0xffffff}>
        <LayoutContainer_ />
      </Application_>
    </div>
  );
};

export default Home;
