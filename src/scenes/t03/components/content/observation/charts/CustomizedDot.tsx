import React from 'react';

interface IProps {
    cx?: number;
    cy?: number;
    fill?: string;
}

const customizedDot = (props: IProps) => {
    const {cx, cy, fill} = props;

    if (cx && cy && fill) {
        return (
            <circle cx={cx} cy={cy} r={3} fill={fill}/>
        );
    }

    return null;

};

export default customizedDot;
