import React from 'react';

import Toolbar from '../../components/Toolbar/Toolbar';
import Search from '../../components/Search/Search';
import Notes from '../../components/Notes/Notes';
import Tree from '../../containers/Tree/Tree';

import styles from './Layout.css'

const layout = props => {
    return (
        <div className={styles.Layout}>
            <Toolbar/>
            <Tree />
            <div><Search /><Notes /></div>
        </div>
    )
};

export default layout;
