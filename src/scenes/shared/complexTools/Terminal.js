import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    container: {
        height: 600,
        width: '100%',
        overflow: 'auto',
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
        backgroundColor: 'black',
        color: 'white',
        paddingTop: 5,
        paddingLeft: 15
    },
};

const Terminal = ({content}) => {
    return (
        <div style={styles.container}>
            <pre>{content}</pre>
        </div>
    );
};

Terminal.propTypes = {
    content: PropTypes.string.isRequired
};

export default Terminal;
