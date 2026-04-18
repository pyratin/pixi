import { useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { Assets, Sprite } from 'pixi.js';

import Application_ from './Component/Application_';

/** @type {[string, string[]][]} */
const bundleDefinitionCollection = [
  ['start-screen', ['flowerTop']],
  ['game-screen', ['eggHead']]
];

Assets.init({
  manifest: {
    bundles: bundleDefinitionCollection.map(([name, assetAliasCollection]) => ({
      name,
      assets: assetAliasCollection.map((alias) => ({
        alias,
        src: `/asset/sprite/${alias}.png`
      }))
    }))
  }
});

Assets.backgroundLoadBundle(bundleDefinitionCollection.map(([name]) => name));

const LayoutContainer_ = ({
  bundleDefinitionIndexActive,
  bundleDefinitionIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite });

  const [texture, textureSet] = useState(undefined);

  useEffect(() => {
    const [name, [alias]] =
      bundleDefinitionCollection[bundleDefinitionIndexActive];

    Assets.loadBundle(name).then((bundleObject) =>
      textureSet(bundleObject[alias])
    );
  }, [bundleDefinitionIndexActive]);

  return (
    <pixiLayoutContainer
      layout={{}}
      eventMode='static'
      cursor='pointer'
      onPointerTap={() =>
        bundleDefinitionIndexActiveSet((bundleDefinitionIndexActive = 0) =>
          !bundleDefinitionIndexActive ? 1 : 0
        )
      }
    >
      <pixiSprite texture={texture} layout={{}} />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  const [bundleDefinitionIndexActive, bundleDefinitionIndexActiveSet] =
    useState(0);

  return (
    <div className='Home'>
      <Application_>
        <LayoutContainer_
          bundleDefinitionIndexActive={bundleDefinitionIndexActive}
          bundleDefinitionIndexActiveSet={bundleDefinitionIndexActiveSet}
        />
      </Application_>
    </div>
  );
};

export default Home;
