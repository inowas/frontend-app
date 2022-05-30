import { Image, Progress } from 'semantic-ui-react';
import happyPoints from '../../assets/happy-points.png';

interface IProps {
  amount: number;
}

const Happiness = (props: IProps) => {
  const renderAmount = () => {
    return <Progress indicating percent={props.amount.toFixed(2)} progress />;
  };

  return (
    <div className="ui right labeled tiny button coins">
      <button className="ui icon button">
        <Image src={happyPoints} alt="Happiness Points" className="ui image" />
      </button>
      {renderAmount()}
    </div>
  );
};

export default Happiness;
