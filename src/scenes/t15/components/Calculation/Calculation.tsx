import Qmra from '../../../../core/model/qmra/Qmra';

interface IProps {
    qmra: Qmra;
}

const Calculation = ({qmra}: IProps) => {
    return (
        <div>{JSON.stringify(qmra.toPayload())}</div>
    );
};

export default Calculation;
