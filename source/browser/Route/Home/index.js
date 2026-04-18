import { useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { Assets, Sprite } from 'pixi.js';

import Application_ from './Component/Application_';

const assetAliasCollection = ['flowerTop', 'eggHead'];

Assets.add(
  assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  }))
);

Assets.backgroundLoad(assetAliasCollection);

const LayoutContainer_ = ({
  assetAliasIndexActive,
  assetAliasIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite });

  const [texture, textureSet] = useState(undefined);

  useEffect(() => {
    Assets.load(assetAliasCollection[assetAliasIndexActive]).then(textureSet);
  }, [assetAliasIndexActive]);

  return (
    <pixiLayoutContainer
      layout={{}}
      eventMode='static'
      cursor='pointer'
      onPointerTap={() =>
        assetAliasIndexActiveSet((assetAliasIndexActive = 0) =>
          !assetAliasIndexActive ? 1 : 0
        )
      }
    >
      <pixiSprite texture={texture} layout={{}} />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  const [assetAliasIndexActive, assetAliasIndexActiveSet] = useState(0);

  return (
    <div className='Home'>
      <Application_>
        <LayoutContainer_
          assetAliasIndexActive={assetAliasIndexActive}
          assetAliasIndexActiveSet={assetAliasIndexActiveSet}
        />
      </Application_>
    </div>
  );
};

export default Home;
