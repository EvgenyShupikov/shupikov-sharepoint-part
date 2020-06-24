import * as React from 'react';
import { connect } from 'react-redux';
import styles from './ListView.module.scss';
import { ISPListItem, IListViewProps } from '../../../types';
import { RootState, selectors, actions } from '../../../store';
import { List } from 'office-ui-fabric-react/lib/List';
import ListViewItem from './ListViewItem';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';


type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & IListViewProps;


const ListView: React.FunctionComponent<Props> = ({ listTitle, items, waitFetch, errorFetchMessage, updateItems }) => {

  React.useEffect(() => {
    updateItems();
  }, []);


  return (
    <div className={styles.listView}>
      {/* title */}
      <span className={styles.title}>Просмотр '{listTitle}'</span>

      {/* progress */}
      {waitFetch && 'Loading...'}

      {/* errors */}
      {errorFetchMessage &&
        <MessageBar messageBarType={MessageBarType.error}>
          {errorFetchMessage}
        </MessageBar>
      }

      {/* list */}
      <div className={styles.list}>
        <List items={items}
          onRenderCell={(item: ISPListItem) => (<ListViewItem item={item} />)} />
      </div>
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  items: selectors.list.getAllItems(state.list),
  errorFetchMessage: selectors.list.getErrorFetchMessage(state.list),
  waitFetch: selectors.list.getWaitFetch(state.list),
});


const mapDispatchToProps = {
  updateItems: () => actions.list.updateItems(),
};


export default connect(mapStateToProps, mapDispatchToProps)(ListView);