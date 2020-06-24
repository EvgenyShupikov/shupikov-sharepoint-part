import * as React from 'react';
import styles from './ListView.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISPListItem } from '../../../types';


type Props = {
  item: ISPListItem
};


const ListViewItem: React.FunctionComponent<Props> = ({ item }) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.itemContent}>
        <div className={styles.itemTitle}>{escape(item.Title)}</div>
        <div className={styles.itemDescription}>{escape(item.Description)}</div>
        <div className={styles.itemFooter}>{item.Id}</div>
      </div>
    </div>
  );
};


export default ListViewItem;