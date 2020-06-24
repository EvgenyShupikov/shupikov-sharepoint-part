import * as React from 'react';
import { connect } from 'react-redux';
import { ISPListItem, IListViewProps } from '../../../types';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { RootState, selectors, actions } from '../../../store';
import ItemEditor from './ItemEditor';
import { ListEditorLocators } from './locators';


type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & IListViewProps;

type State = {
  selectedItemId: number
};

const columns = [
  { key: 'Id', name: 'Id', fieldName: 'Id', minWidth: 50, maxWidth: 100, isResizable: true },
  { key: 'Title', name: 'Название', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'Code', name: 'Код', fieldName: 'Code', minWidth: 50, maxWidth: 100, isResizable: true },
  { key: 'Description', name: 'Описание', fieldName: 'Description', minWidth: 100, maxWidth: 200, isResizable: true },
];


class ListEditor extends React.Component<Props, State> {

  private _columns: IColumn[];
  private _selection: Selection;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedItemId: -1
    };

    this._columns = columns;

    this._selection = new Selection({
      onSelectionChanged: () => {
        const selectedItem = this._selection.getSelection()[0] as ISPListItem | undefined;
        this.setState({ selectedItemId: selectedItem !== undefined ? selectedItem.Id : -1 });
      }
    });
  }


  public componentDidMount() {
    this.props.updateItems();
  }


  private getSelectedItem(): ISPListItem | undefined {
    const { items } = this.props;
    const { selectedItemId } = this.state;

    return items.filter(item => item.Id === selectedItemId)[0];
  }


  public render(): React.ReactElement<IListViewProps> {
    const { waitFetch, errorFetchMessage, items, toggleItemEditor, itemEditorIsOpen, itemForEditor } = this.props;
    const commandButtons = this.getCommandButtons();

    return (
      <div data-automationid={ListEditorLocators.RootElement}>
        {/* errors */}
        {errorFetchMessage &&
          <MessageBar messageBarType={MessageBarType.error}>
            {errorFetchMessage}
          </MessageBar>
        }

        {/* list */}
        <CommandBar items={commandButtons} />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={this._columns}
            setKey="Id"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            selectionMode={SelectionMode.single}
          />
        </MarqueeSelection>

        {/* progress */}
        {waitFetch && 'Loading...'}

        {/* editor */}
        {itemEditorIsOpen &&
          <ItemEditor
            item={itemForEditor}
            isOpen={itemEditorIsOpen}
            onClose={() => toggleItemEditor(false)} />
        }
      </div>
    );
  }


  private getCommandButtons() {
    const { waitFetch, waitRemove, toggleItemEditor, setItemForEditor } = this.props;
    const waitAsyncOperation = waitFetch || waitRemove;
    const selectedItem = this.getSelectedItem();
    const hasSelectedItem = selectedItem !== undefined;

    const commandButtons: ICommandBarItemProps[] = [
      {
        key: 'add',
        text: 'Добавить',
        'data-automationid': ListEditorLocators.ButtonAddItem,
        disabled: waitAsyncOperation,
        iconProps: { iconName: 'Add' },
        onClick: () => {
          toggleItemEditor(true);
          setItemForEditor(undefined);
        }
      },
      {
        key: 'del',
        text: 'Удалить',
        'data-automationid': ListEditorLocators.ButtonRemoveItem,
        disabled: !hasSelectedItem || waitAsyncOperation,
        iconProps: { iconName: 'Delete' },
        onClick: () => {
          // TODO добавить запрос на подтверждение
          if (selectedItem !== undefined) {
            this.props.removeItem(selectedItem.Id);
            this._selection.setItems([]);
          }
        }
      },
      {
        key: 'edit',
        text: 'Редактировать',
        'data-automationid': ListEditorLocators.ButtonEditItem,
        disabled: !hasSelectedItem || waitAsyncOperation,
        iconProps: { iconName: 'Edit' },
        onClick: () => {
          toggleItemEditor(true);
          setItemForEditor(selectedItem);
        }
      },
    ];

    return commandButtons;
  }
}


const mapStateToProps = (state: RootState) => ({
  items: selectors.list.getAllItems(state.list),
  errorFetchMessage: selectors.list.getErrorFetchMessage(state.list),
  waitFetch: selectors.list.getWaitFetch(state.list),
  waitRemove: selectors.list.getWaitRemove(state.list),
  itemEditorIsOpen: selectors.list.getItemEditorIsOpen(state.list),
  itemForEditor: selectors.list.getItemForEditor(state.list),
});


const mapDispatchToProps = {
  updateItems: () => actions.list.updateItems(),
  removeItem: (itemId: number) => actions.list.removeItem(itemId),
  toggleItemEditor: (itemEditorIsOpen: boolean) => actions.list.toggleItemEditor(itemEditorIsOpen),
  setItemForEditor: (item: ISPListItem) => actions.list.setItemForEditor(item),
};


export default connect(mapStateToProps, mapDispatchToProps)(ListEditor);