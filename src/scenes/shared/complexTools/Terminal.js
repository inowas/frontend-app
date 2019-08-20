import React from 'react';
import PropTypes from 'prop-types';

const style = {
    height: 600,
    width: '100%',
    overflow: 'auto',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    backgroundColor: 'black',
    color: 'white',
    paddingTop: 5,
    paddingLeft: 15
};

const isJSON = (str) => {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
};


const Terminal = ({content, styles = null}) => {
    if (isJSON(content)) {
        content = JSON.parse(content);
        content = JSON.stringify(content, null, 2);
    }

    if (content)
        return (
            <div style={{...style, ...styles}}>
                <pre>{content}</pre>
            </div>
        );
};

Terminal.propTypes = {
    content: PropTypes.string.isRequired,
    styles: PropTypes.object
};

export default Terminal;
