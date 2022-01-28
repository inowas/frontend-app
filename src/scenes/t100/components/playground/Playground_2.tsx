import { IGameState } from '../../../../core/marPro/GameState.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { styles } from './styles';
import { useState } from 'react';
import Dialog from '../shared/Dialog';
import GameState from '../../../../core/marPro/GameState';
import bg from '../../assets/mar-gameboard-01-riverbed.png';
import River from '../gameObjects/River';

interface IProps {
  scenario: IScenario;
}

const Playground = (props: IProps) => {
  const [gameState, setGameState] = useState<IGameState>(GameState.fromScenario(props.scenario).toObject());

  return (
    <div style={styles.body}>
      <div style={styles.bgNoise}>xx</div>
      <div
        style={{
          ...styles.boardBg,
          background: `url(${bg}) no-repeat`,
        }}
      >
        <River />
      </div>
      <Dialog />
      <Dialog />
    </div>
  );
};

export default Playground;
