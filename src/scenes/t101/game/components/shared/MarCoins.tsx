import { Image } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import marCoin from '../../assets/mar-coin.png';
import sound from '../../assets/sounds/cash.mp3';

interface IProps {
  amount: number;
}

const audio = new Audio(sound);

const MarCoins = (props: IProps) => {
  const [amountHasChanged, setAmountHasChanged] = useState<boolean>(false);
  const [oldAmount, setOldAmount] = useState<number>(props.amount);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setAmountHasChanged(true);
      audio.play();
      setTimeout(() => {
        setAmountHasChanged(false);
        setOldAmount(props.amount);
      }, 1000);
    }
  }, [props.amount]);

  const renderAmount = () => {
    if (amountHasChanged && oldAmount !== undefined && oldAmount < props.amount) {
      return <span className={'ui left basic label positiveChange'}>{props.amount}</span>;
    }
    if (amountHasChanged && oldAmount !== undefined && oldAmount > props.amount) {
      return <span className={'ui left basic label negativeChange'}>{props.amount}</span>;
    }
    return <span className={'ui left basic label noChange'}>{props.amount}</span>;
  };

  return (
    <div className="ui right labeled tiny button coins">
      <button className="ui icon button">
        <Image src={marCoin} alt="Mar Coins" />
      </button>
      {renderAmount()}
    </div>
  );
};

export default MarCoins;
