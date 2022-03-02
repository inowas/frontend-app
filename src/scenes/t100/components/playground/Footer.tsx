import { Button } from 'semantic-ui-react';
import GameState from '../../../../core/marPro/GameState';

interface IProps {
  gameState: GameState;
  onClickCheck: () => any;
}

const Footer = (props: IProps) => {
  return (
    <div className="ui segment ui overlay bottom visible sidebar inverted calculation">
      <div className="ui floating black label">
        <i aria-hidden="true" className="angle down icon"></i>
      </div>
      <div className="ui center aligned grid">
        <div className="one column row">
          <div className="column">
          </div>
        </div>
        <div className="four column row">
          <div className="five wide column">
            <div className="ui segment">
              <h3 className="ui header">
                <i aria-hidden="true" className="tint icon"></i>
                <div className="content">
                  Water Budget
                  <div className="sub header">Select one or multiple objects</div>
                </div>
              </h3>
              {props.gameState.resources.map((r, key) => (
                <div className="ui left labeled input" key={`res_${key}`}>
                  <div className="ui label" style={{ width: '150px' }}>
                    {r.id}
                  </div>
                  <input className="ui input" value={r.value} type="text" />
                </div>
              ))}
              <div className="ui left labeled input">
                <div className="ui label" style={{ width: '150px' }}>
                  Objects
                </div>
                <input className="ui input" value={props.gameState.objects.length} type="text" />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui segment">
              <h3 className="ui header">
                <i aria-hidden="true" className="calculator icon"></i>
                <div className="content">
                  Calculation Values
                  <div className="sub header">Select object(s) and move slider</div>
                </div>
              </h3>
              <div className="ui list">
                <div className="item">
                  <div className="horizontal label">Groundwater Level</div>
                  <div className="ui labeled range">
                    <div className="inner">
                      <div className="track"></div>
                      <div className="track-fill" style={{ width: '100px' }}></div>
                      <div className="thumb" style={{ left: '90px' }}></div>
                    </div>
                    <ul className="auto labels">
                      <li className="label" style={{ left: '20%' }}></li>
                      <li className="label" style={{ left: '40%' }}></li>
                      <li className="label" style={{ left: '60%' }}></li>
                      <li className="label" style={{ left: '80%' }}></li>
                    </ul>
                  </div>
                </div>
                <div className="item">
                  <div className="horizontal label">Pumping Rate</div>
                  <div className="ui labeled range">
                    <div className="inner">
                      <div className="track"></div>
                      <div className="track-fill" style={{ width: '100px' }}></div>
                      <div className="thumb" style={{ left: '90px' }}></div>
                    </div>
                    <ul className="auto labels">
                      <li className="label" style={{ left: '20%' }}></li>
                      <li className="label" style={{ left: '40%' }}></li>
                      <li className="label" style={{ left: '60%' }}></li>
                      <li className="label" style={{ left: '80%' }}></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <Button color="blue" onClick={props.onClickCheck} size="big">
              Check
            </Button>
            <button className="ui big button orange">Cancel</button>
            <div className="ui hidden divider"></div>
            <div className="ui success progress" data-percent="100">
              <div className="bar" style={{ width: '100%', height: '0.5em' }}></div>
              <div className="ui success icon message black">
                <i aria-hidden="true" className="green check icon"></i>
                Your strategy was successful
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
