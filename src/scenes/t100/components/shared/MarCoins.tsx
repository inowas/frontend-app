import { Image } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import marCoin from '../../assets/mar-coin.png';

interface IProps {
  amount: number;
}

const MarCoins = (props: IProps) => {
  const [amountHasChanged, setAmountHasChanged] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setAmountHasChanged(true);
      setTimeout(() => {
        setAmountHasChanged(false);
      }, 1000);
    }
  }, [props.amount]);

  return (
    <div className="ui right labeled tiny button coins">
      <button className="ui icon button">
        <Image src={marCoin} alt="Mar Coins" />
      </button>
      <span className={`ui left basic label ${amountHasChanged ? 'negativeChange' : 'noChange'}`}>{props.amount}</span>
    </div>
  );
};

export default MarCoins;
