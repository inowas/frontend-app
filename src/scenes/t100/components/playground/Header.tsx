import { Image } from 'semantic-ui-react';
import happyPoints from '../../assets/happy-points.png';
import marCoin from '../../assets/mar-coin.png';

const Header = () => {
  return (
    <div className="ui grid">
      <div className="row" style={{ paddingBottom: 0 }}>
        <div className="ten wide column">
          <div className="ui compact bottom attached icon message">
            <i aria-hidden="true" className="info circle icon"></i>
            <div className="content">
              Mission: Ezousa River, Cyprus
              <button className="ui icon button item">
                <i aria-hidden="true" className="right chevron icon"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="two wide column">
          <div className="ui right labeled tiny button coins">
            <button className="ui icon button">
              <Image src={marCoin} alt="Mar Coins" />
            </button>
            <a className="ui left basic label">-25</a>
          </div>
        </div>
        <div className="two wide column">
          <div className="ui right labeled tiny button coins">
            <button className="ui icon button">
              <Image src={happyPoints} className="ui image" />
            </button>
            <div className="ui indicating progress" data-percent="44">
              <div className="bar" style={{ width: '44%' }}>
                <div className="progress">44%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
